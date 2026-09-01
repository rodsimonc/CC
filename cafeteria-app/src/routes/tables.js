// Mesas del salón: el mapa es público. El layout es fijo (viene del seed);
// lo único que el admin edita es la disponibilidad de cada mesa.
import { Router } from 'express';
import { tablesRepo } from '../repositories/tables.repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ProblemError } from '../middleware/problem.js';

const router = Router();
export const ZONES = ['interior', 'exterior', 'barra'];

router.get('/', (_req, res) => {
  const data = tablesRepo.findAll();
  res.json({ data, meta: { total: data.length, zones: ZONES } });
});

router.patch('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  const table = tablesRepo.findById(req.params.id);
  if (!table) return next(new ProblemError({ status: 404, title: 'Not Found', detail: `No existe la mesa ${req.params.id}.` }));
  const { available } = req.body || {};
  if (typeof available !== 'boolean') {
    return next(new ProblemError({
      status: 422, title: 'Unprocessable Entity', detail: 'Solo se puede editar "available" (true/false).',
      extensions: { errors: [{ field: 'available', message: 'debe ser true o false' }] },
    }));
  }
  res.json({ data: tablesRepo.setAvailable(table.id, available) });
});

export default router;
