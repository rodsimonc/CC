// Reservas de mesa:
//  - GET   /reservations/availability?date= : turnos ya ocupados de una fecha (público).
//  - POST  /reservations                    : crea la reserva y devuelve los deep-links wa.me.
//  - GET   /reservations                    : listado para el admin (por fecha o paginado).
//  - PATCH /reservations/{id}/status        : admin cambia el estado.

import { Router } from 'express';
import { reservationsRepo, SlotTakenError } from '../repositories/reservations.repo.js';
import { tablesRepo } from '../repositories/tables.repo.js';
import { shopRepo } from '../repositories/shop.repo.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { ProblemError } from '../middleware/problem.js';
import { rateLimit } from '../middleware/rateLimit.js';
import { buildReservationLinks, normalizeWhatsapp } from '../services/whatsapp.js';

const router = Router();
const reserveLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 12 });

// Turnos fijos de 2 h. Los huecos (12-13, 17-18) son limpieza / cambio de personal
// y no se reservan, por eso no existen como turno.
export const SLOTS = [
  '08:00-10:00',
  '10:00-12:00',
  '13:00-15:00',
  '15:00-17:00',
  '18:00-20:00',
  '20:00-22:00',
  '22:00-23:30',
];
const STATUSES = ['pendiente', 'confirmada', 'cancelada'];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Fecha de hoy en la zona horaria del servidor, en formato YYYY-MM-DD.
function today() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

function validDate(date) {
  if (!DATE_RE.test(String(date || ''))) return false;
  const [y, m, d] = String(date).split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

// Disponibilidad de una fecha: turnos del día + pares (mesa, turno) ya tomados.
router.get('/availability', (req, res, next) => {
  const date = req.query.date || today();
  if (!validDate(date)) {
    return next(new ProblemError({
      status: 422, title: 'Unprocessable Entity', detail: 'La fecha debe tener formato YYYY-MM-DD.',
      extensions: { errors: [{ field: 'date', message: 'formato inválido' }] },
    }));
  }
  const taken = reservationsRepo.takenOn(date);
  res.json({
    data: {
      date,
      slots: SLOTS,
      taken,
      // Mesas dadas de baja por el local: tampoco se pueden reservar ese día.
      unavailableTables: tablesRepo.findAll().filter((t) => !t.available).map((t) => t.id),
    },
    meta: { total: taken.length },
  });
});

// Crear reserva. Abierta al público; si viene un cliente logueado, queda igual registrada.
router.post('/', reserveLimiter, optionalAuth, (req, res, next) => {
  const { tableId, date, slot, customerName, customerWhatsapp } = req.body || {};
  const errors = [];

  const table = tablesRepo.findById(tableId);
  if (!table) errors.push({ field: 'tableId', message: 'elegí una mesa del salón' });
  else if (!table.available) errors.push({ field: 'tableId', message: `la mesa ${table.code} no está habilitada` });

  if (!validDate(date)) errors.push({ field: 'date', message: 'elegí una fecha válida (YYYY-MM-DD)' });
  else if (date < today()) errors.push({ field: 'date', message: 'no se puede reservar una fecha pasada' });

  if (!SLOTS.includes(slot)) errors.push({ field: 'slot', message: 'elegí uno de los turnos disponibles' });

  const name = String(customerName || '').trim();
  if (name.length < 2 || !/\p{L}/u.test(name)) errors.push({ field: 'customerName', message: 'ingresá tu nombre y apellido' });

  const whatsapp = normalizeWhatsapp(customerWhatsapp);
  if (whatsapp.length < 8 || whatsapp.length > 15) {
    errors.push({ field: 'customerWhatsapp', message: 'ingresá tu WhatsApp con código de país (ej: 5491122334455)' });
  }

  if (errors.length) {
    return next(new ProblemError({ status: 422, title: 'Unprocessable Entity', detail: 'No se pudo crear la reserva.', extensions: { errors } }));
  }

  let reservation;
  try {
    reservation = reservationsRepo.book({
      tableId: table.id, date, slot, customerName: name, customerWhatsapp: whatsapp, status: 'pendiente',
    });
  } catch (e) {
    // La constraint única (table_id, date, slot) es la que evita la doble reserva.
    if (e instanceof SlotTakenError || String(e.message).includes('UNIQUE')) {
      return next(new ProblemError({
        status: 409, title: 'Conflict',
        detail: `La mesa ${table.code} ya está reservada el ${date} en el turno ${slot}. Elegí otra mesa u otro turno.`,
        extensions: { errors: [{ field: 'slot', message: 'turno ocupado' }] },
      }));
    }
    return next(e);
  }

  // Deep-links wa.me: uno para el local y otro para el cliente.
  const links = buildReservationLinks({ reservation, table, shop: shopRepo.get() });
  res.status(201).location(`/api/v1/reservations/${reservation.id}`).json({ data: reservation, whatsapp: links });
});

// Listado para el admin: por fecha (?date=) o paginado.
router.get('/', requireAuth, requireRole('admin'), (req, res, next) => {
  const { date } = req.query;
  if (date !== undefined) {
    if (!validDate(date)) {
      return next(new ProblemError({
        status: 422, title: 'Unprocessable Entity', detail: 'La fecha debe tener formato YYYY-MM-DD.',
        extensions: { errors: [{ field: 'date', message: 'formato inválido' }] },
      }));
    }
    const data = reservationsRepo.findByDate(date);
    return res.json({ data, meta: { date, total: data.length } });
  }
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize, 10) || 20));
  const total = reservationsRepo.countAll();
  const data = reservationsRepo.findAll({ limit: pageSize, offset: (page - 1) * pageSize });
  res.json({ data, meta: { page, pageSize, total, totalPages: Math.max(1, Math.ceil(total / pageSize)) } });
});

router.get('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  const reservation = reservationsRepo.findById(req.params.id);
  if (!reservation) return next(new ProblemError({ status: 404, title: 'Not Found', detail: 'Reserva no encontrada.' }));
  res.json({ data: reservation });
});

// Cambiar estado: pendiente -> confirmada -> cancelada (solo admin).
router.patch('/:id/status', requireAuth, requireRole('admin'), (req, res, next) => {
  const reservation = reservationsRepo.findById(req.params.id);
  if (!reservation) return next(new ProblemError({ status: 404, title: 'Not Found', detail: 'Reserva no encontrada.' }));
  const { status } = req.body || {};
  if (!STATUSES.includes(status)) {
    return next(new ProblemError({
      status: 422, title: 'Unprocessable Entity', detail: `Estado inválido. Válidos: ${STATUSES.join(', ')}.`,
      extensions: { errors: [{ field: 'status', message: 'inválido' }] },
    }));
  }
  res.json({ data: reservationsRepo.updateStatus(reservation.id, status) });
});

export default router;
