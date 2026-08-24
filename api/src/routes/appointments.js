import { Router } from 'express';
import { z } from 'zod';
import { appointmentsRepo } from '../repositories/appointments.repo.js';
import { lawyersRepo } from '../repositories/lawyers.repo.js';
import { isSlotAvailable } from '../services/scheduling.js';
import { notifyAppointmentBooked } from '../services/notifications.js';
import { HttpProblem } from '../middleware/problem.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const BASE = 'https://moixlegal.com.ar/errors';

const createSchema = z.object({
  lawyer_slug: z.string(),
  slot_at: z.string().datetime(),
  lead_id: z.string().optional(),
  contact: z.object({
    name: z.string().min(2).max(120),
    phone: z.string().max(40).optional(),
    email: z.string().email(),
  }),
});

router.post('/', async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const lawyer = lawyersRepo.findBySlug(input.lawyer_slug);
    if (!lawyer) {
      return next(new HttpProblem({
        type: `${BASE}/not-found`, title: 'Abogado no encontrado', status: 404,
        detail: `No existe ${input.lawyer_slug}`,
      }));
    }
    if (!isSlotAvailable(lawyer.id, input.slot_at)) {
      return next(new HttpProblem({
        type: `${BASE}/conflict`, title: 'Turno ya reservado', status: 409,
        detail: 'Elegí otro horario disponible.',
      }));
    }
    const appt = appointmentsRepo.create({
      lawyer_id: lawyer.id,
      lead_id: input.lead_id,
      slot_at: input.slot_at,
      contact_name: input.contact.name,
      contact_phone: input.contact.phone,
      contact_email: input.contact.email,
    });
    await notifyAppointmentBooked(appt);
    res.status(201).json(appt);
  } catch (err) { next(err); }
});

router.get('/', requireAuth(['admin', 'lawyer']), (req, res) => {
  const lawyerId = req.user.role === 'lawyer' ? req.user.lawyerId : req.query.lawyer_id;
  const items = lawyerId ? appointmentsRepo.listByLawyer(lawyerId) : [];
  res.json({ items });
});

export default router;
