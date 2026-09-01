// Imágenes del carrusel de la landing: listado público, carga/orden/borrado solo admin.
import { Router } from 'express';
import { landingImagesRepo } from '../repositories/shop.repo.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { ProblemError } from '../middleware/problem.js';
import { uploadImage, publicPathFor, removeUploadedFile } from '../middleware/upload.js';

const router = Router();

function findOr404(id) {
  const image = landingImagesRepo.findById(id);
  if (!image) throw new ProblemError({ status: 404, title: 'Not Found', detail: `No existe la imagen ${id}.` });
  return image;
}

router.get('/', (_req, res) => {
  const data = landingImagesRepo.findAll();
  res.json({ data, meta: { total: data.length } });
});

// Subida de una imagen del carrusel (multipart, campo "image").
router.post('/', requireAuth, requireRole('admin'), uploadImage, (req, res, next) => {
  if (!req.file) {
    return next(new ProblemError({
      status: 422, title: 'Unprocessable Entity', detail: 'Adjuntá una imagen en el campo "image".',
      extensions: { errors: [{ field: 'image', message: 'requerida' }] },
    }));
  }
  const body = req.body || {};
  const image = landingImagesRepo.create({
    imagePath: publicPathFor(req.file),
    caption: (body.caption || '').trim(),
    sortOrder: body.sortOrder === undefined || body.sortOrder === '' ? undefined : Number(body.sortOrder),
  });
  res.status(201).location(`/api/v1/landing-images/${image.id}`).json({ data: image });
});

// PATCH: reordenar o cambiar el epígrafe (la imagen en sí no se edita, se reemplaza).
router.patch('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const current = findOr404(req.params.id);
    const { sortOrder, caption } = req.body || {};
    if (sortOrder !== undefined && Number.isNaN(Number(sortOrder))) {
      return next(new ProblemError({
        status: 422, title: 'Unprocessable Entity', detail: 'Orden inválido.',
        extensions: { errors: [{ field: 'sortOrder', message: 'debe ser un número' }] },
      }));
    }
    res.json({ data: landingImagesRepo.update(current.id, { sortOrder, caption }) });
  } catch (e) { next(e); }
});

router.delete('/:id', requireAuth, requireRole('admin'), (req, res, next) => {
  try {
    const current = findOr404(req.params.id);
    landingImagesRepo.remove(current.id);
    removeUploadedFile(current.imagePath);
    res.status(204).end();
  } catch (e) { next(e); }
});

export default router;
