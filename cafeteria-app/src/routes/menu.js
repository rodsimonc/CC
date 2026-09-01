// Menú: lectura pública por categoría (desayuno/brunch/cena) y ABM para el admin.
// La imagen viaja como multipart/form-data (campo "image"); en la base va solo la ruta.
import { Router } from 'express';
import { menuRepo } from '../repositories/menu.repo.js';
import { requireAuth, requireRole, optionalAuth } from '../middleware/auth.js';
import { ProblemError } from '../middleware/problem.js';
import { uploadImage, publicPathFor, removeUploadedFile } from '../middleware/upload.js';

const router = Router();
export const CATEGORIES = ['desayuno', 'brunch', 'cena'];
const SIDES = ['left', 'right'];

// En multipart todo llega como string: normalizamos antes de validar.
function bool(v, fallback) {
  if (v === undefined || v === '') return fallback;
  return v === true || v === 'true' || v === '1' || v === 1;
}

function validate(body, { partial = false } = {}) {
  const errors = [];
  if (!partial || body.name !== undefined) {
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) errors.push({ field: 'name', message: 'requerido' });
  }
  if (!partial || body.category !== undefined) {
    if (!CATEGORIES.includes(body.category)) errors.push({ field: 'category', message: `debe ser una de: ${CATEGORIES.join(', ')}` });
  }
  if (!partial || body.price !== undefined) {
    const price = Number(body.price);
    if (Number.isNaN(price) || price < 0) errors.push({ field: 'price', message: 'debe ser un número mayor o igual a 0' });
  }
  if (body.side !== undefined && body.side !== '' && !SIDES.includes(body.side)) {
    errors.push({ field: 'side', message: `debe ser uno de: ${SIDES.join(', ')}` });
  }
  if (body.sortOrder !== undefined && body.sortOrder !== '' && Number.isNaN(Number(body.sortOrder))) {
    errors.push({ field: 'sortOrder', message: 'debe ser un número' });
  }
  return errors;
}

function findOr404(id) {
  const item = menuRepo.findById(id);
  if (!item) throw new ProblemError({ status: 404, title: 'Not Found', detail: `No existe el ítem de menú ${id}.` });
  return item;
}

// Si la validación falla después de que multer ya guardó el archivo, lo borramos.
function invalid(req, errors) {
  if (req.file) removeUploadedFile(publicPathFor(req.file));
  return new ProblemError({ status: 422, title: 'Unprocessable Entity', detail: 'Ítem de menú inválido.', extensions: { errors } });
}

// GET /menu?category=desayuno : público ve los disponibles; admin ve todos.
router.get('/', optionalAuth, (req, res, next) => {
  const { category } = req.query;
  if (category !== undefined && !CATEGORIES.includes(category)) {
    return next(new ProblemError({
      status: 422, title: 'Unprocessable Entity',
      detail: `Categoría inválida. Válidas: ${CATEGORIES.join(', ')}.`,
      extensions: { errors: [{ field: 'category', message: 'inválida' }] },
    }));
  }
  const isAdmin = req.user && req.user.role === 'admin';
  let items = menuRepo.findAll({ category });
  if (!isAdmin) items = items.filter((i) => i.available);
  res.json({ data: items, meta: { total: items.length, categories: CATEGORIES } });
});

router.get('/:id', (req, res, next) => {
  try { res.json({ data: findOr404(req.params.id) }); } catch (e) { next(e); }
});

router.post('/', requireAuth, requireRole('admin'), uploadImage, (req, res, next) => {
  const body = req.body || {};
  const errors = validate(body);
  if (errors.length) return next(invalid(req, errors));
  const side = SIDES.includes(body.side) ? body.side : 'left';
  const item = menuRepo.create({
    category: body.category,
    side,
    sortOrder: body.sortOrder === undefined || body.sortOrder === ''
      ? menuRepo.nextSortOrder(body.category, side)
      : Number(body.sortOrder),
    name: body.name.trim(),
    description: (body.description || '').trim(),
    price: Number(body.price) || 0,
    imagePath: publicPathFor(req.file),
    available: bool(body.available, true),
  });
  res.status(201).location(`/api/v1/menu/${item.id}`).json({ data: item });
});

// PUT: reemplaza el ítem completo. Sin archivo nuevo se conserva la imagen actual.
router.put('/:id', requireAuth, requireRole('admin'), uploadImage, (req, res, next) => {
  try {
    const current = findOr404(req.params.id);
    const body = req.body || {};
    const errors = validate(body);
    if (errors.length) return next(invalid(req, errors));
    const side = SIDES.includes(body.side) ? body.side : 'left';
    const imagePath = req.file ? publicPathFor(req.file) : current.imagePath;
    const item = menuRepo.update(current.id, {
      category: body.category,
      side,
      sortOrder: body.sortOrder === undefined || body.sortOrder === '' ? current.sortOrder : Number(body.sortOrder),
      name: body.name.trim(),
      description: (body.description || '').trim(),
      price: Number(body.price) || 0,
      imagePath,
      available: bool(body.available, true),
    });
    if (req.file && current.imagePath) removeUploadedFile(current.imagePath);
    res.json({ data: item });
  } catch (e) { next(e); }
});

// PATCH: cambios puntuales (precio, disponibilidad, orden, lado o solo la foto).
router.patch('/:id', requireAuth, requireRole('admin'), uploadImage, (req, res, next) => {
  try {
    const current = findOr404(req.params.id);
    const body = req.body || {};
    const errors = validate(body, { partial: true });
    if (errors.length) return next(invalid(req, errors));
    const merged = { ...current };
    for (const f of ['category', 'side', 'name', 'description']) {
      if (body[f] !== undefined) merged[f] = String(body[f]).trim();
    }
    if (body.price !== undefined) merged.price = Number(body.price) || 0;
    if (body.sortOrder !== undefined && body.sortOrder !== '') merged.sortOrder = Number(body.sortOrder);
    if (body.available !== undefined) merged.available = bool(body.available, current.available);
    if (req.file) merged.imagePath = publicPathFor(req.file);
    else if (body.imagePath === '') merged.imagePath = '';
    const item = menuRepo.update(current.id, merged);
    if (merged.imagePath !== current.imagePath && current.imagePath) removeUploadedFile(current.imagePath);
    res.json({ data: item });
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const current = findOr404(req.params.id);
    menuRepo.remove(current.id);
    if (current.imagePath) removeUploadedFile(current.imagePath);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
