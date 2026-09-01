// Datos del local y texto de bienvenida de la landing: lectura pública, edición solo admin.
import { Router } from 'express';
import { shopRepo } from '../repositories/shop.repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { normalizeWhatsapp } from '../services/whatsapp.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json({ data: shopRepo.get() });
});

router.put('/', requireAuth, requireRole('admin'), (req, res) => {
  const b = req.body || {};
  const saved = shopRepo.save({
    name: b.name, address: b.address, phone: b.phone, email: b.email,
    whatsapp: normalizeWhatsapp(b.whatsapp), hours: b.hours,
    welcomeText: b.welcomeText, notes: b.notes,
  });
  res.json({ data: saved });
});

export default router;
