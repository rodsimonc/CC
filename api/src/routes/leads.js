import { Router } from 'express';
import { z } from 'zod';
import { leadsRepo } from '../repositories/leads.repo.js';
import { lawyersRepo } from '../repositories/lawyers.repo.js';
import { notifyLeadCreated } from '../services/notifications.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const createSchema = z.object({
  area: z.string().min(2).max(60),
  urgency: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  summary: z.string().max(2000).optional(),
  session_id: z.string().max(80).optional(),
  lawyer_slug: z.string().optional(),
  contact: z.object({
    name: z.string().min(2).max(120).optional(),
    phone: z.string().max(40).optional(),
    email: z.string().email().optional(),
  }).default({}),
});

router.post('/', async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const lawyer = input.lawyer_slug ? lawyersRepo.findBySlug(input.lawyer_slug) : null;
    const created = leadsRepo.create({
      lawyer_id: lawyer?.id ?? null,
      area: input.area,
      urgency: input.urgency,
      summary: input.summary,
      contact_name: input.contact.name,
      contact_phone: input.contact.phone,
      contact_email: input.contact.email,
      session_id: input.session_id,
    });
    await notifyLeadCreated(created);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

router.get('/', requireAuth(['admin', 'lawyer']), (req, res) => {
  const lawyerId = req.user.role === 'lawyer' ? req.user.lawyerId : req.query.lawyer_id;
  const items = lawyerId ? leadsRepo.listByLawyer(lawyerId) : [];
  res.json({ items });
});

export default router;
