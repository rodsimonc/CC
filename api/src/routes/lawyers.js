import { Router } from 'express';
import { z } from 'zod';
import { lawyersRepo } from '../repositories/lawyers.repo.js';
import { HttpProblem } from '../middleware/problem.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
const BASE = 'https://moixlegal.com.ar/errors';

const listQuery = z.object({
  area: z.string().min(2).max(40).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

const createSchema = z.object({
  slug: z.string().min(2).max(80).regex(/^[a-z0-9-]+$/),
  full_name: z.string().min(2).max(120),
  bar_number: z.string().min(3).max(80),
  bar_status: z.enum(['active', 'suspended', 'inactive']).default('active'),
  practice_areas: z.array(z.string().min(2)).min(1),
  headline: z.string().max(160).optional(),
  bio: z.string().max(4000).optional(),
  photo_url: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().max(40).optional(),
  published: z.boolean().default(false),
  consented: z.boolean().default(false),
});

router.get('/', (req, res, next) => {
  try {
    const { area, limit } = listQuery.parse(req.query);
    const rows = lawyersRepo.listPublished({ area, limit });
    const items = rows.map((r) => ({
      slug: r.slug,
      full_name: r.full_name,
      headline: r.headline,
      practice_areas: JSON.parse(r.practice_areas ?? '[]'),
      photo_url: r.photo_url,
      city: r.city,
    }));
    res.json({ items, total: items.length });
  } catch (err) { next(err); }
});

router.get('/:slug', (req, res, next) => {
  const lawyer = lawyersRepo.findBySlug(req.params.slug);
  if (!lawyer || !lawyer.published) {
    return next(new HttpProblem({
      type: `${BASE}/not-found`,
      title: 'Abogado no encontrado',
      status: 404,
      detail: `No hay abogado publicado con slug ${req.params.slug}`,
    }));
  }
  res.json(lawyer);
});

router.post('/', requireAuth(['admin']), (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    if (lawyersRepo.findBySlug(input.slug)) {
      return next(new HttpProblem({
        type: `${BASE}/conflict`,
        title: 'Slug ya existe',
        status: 409,
        detail: `Ya existe un abogado con slug ${input.slug}`,
      }));
    }
    const created = lawyersRepo.create(input);
    res.status(201).json(created);
  } catch (err) { next(err); }
});

export default router;
