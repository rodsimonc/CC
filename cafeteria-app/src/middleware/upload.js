// Subida de imágenes con multer. El archivo se guarda en public/uploads/ y en la base
// se persiste SOLO la ruta pública (/uploads/<archivo>), nunca el binario.

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import multer from 'multer';
import { config } from '../config.js';
import { ProblemError } from './problem.js';

const EXT_BY_MIME = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

fs.mkdirSync(config.uploads.dir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, config.uploads.dir),
  // Nombre generado por el servidor: nunca se usa el nombre que manda el cliente.
  filename: (_req, file, cb) => {
    const ext = EXT_BY_MIME[file.mimetype] || '.bin';
    cb(null, `${Date.now().toString(36)}-${crypto.randomBytes(8).toString('hex')}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: config.uploads.maxBytes, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!EXT_BY_MIME[file.mimetype]) {
      return cb(new ProblemError({
        status: 422, title: 'Unprocessable Entity',
        detail: 'Formato de imagen no soportado. Usá JPG, PNG, WEBP o GIF.',
        extensions: { errors: [{ field: 'image', message: 'formato inválido' }] },
      }));
    }
    cb(null, true);
  },
});

// Middleware para un único archivo en el campo "image" (opcional en los PUT/PATCH).
export const uploadImage = upload.single('image');

// Ruta pública que se guarda en la base para el archivo recién subido.
export function publicPathFor(file) {
  return file ? `${config.uploads.publicPath}/${file.filename}` : '';
}

// Borra del disco una imagen que ya no se usa. Solo toca archivos dentro de uploads/.
export function removeUploadedFile(publicPath) {
  if (!publicPath || !publicPath.startsWith(`${config.uploads.publicPath}/`)) return false;
  const filename = path.basename(publicPath);
  const target = path.join(config.uploads.dir, filename);
  if (path.dirname(target) !== path.resolve(config.uploads.dir)) return false;
  try { fs.unlinkSync(target); return true; } catch { return false; }
}
