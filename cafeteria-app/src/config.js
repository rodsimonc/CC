// Configuración central leída desde variables de entorno (.env en local).
import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const isProd = process.env.NODE_ENV === 'production';

export const config = {
  isProd,
  port: Number(process.env.PORT || 3200),

  jwtSecret: process.env.JWT_SECRET || 'dev-insecure-secret-cambiar-en-produccion',
  jwtIssuer: process.env.JWT_ISSUER || 'cafeteria-app',
  jwtAudience: process.env.JWT_AUDIENCE || 'cafeteria-users',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '2h',

  databaseFile: process.env.DATABASE_FILE || path.join(root, 'data', 'cafeteria.db'),

  // Las imágenes se guardan como archivos (multer); en la base va solo la ruta pública.
  uploads: {
    dir: process.env.UPLOAD_DIR || path.join(root, 'public', 'uploads'),
    publicPath: '/uploads',
    maxBytes: Number(process.env.UPLOAD_MAX_MB || 4) * 1024 * 1024,
  },

  // Admin inicial OPCIONAL (para deploys headless). Si no se define, se crea en el primer uso.
  admin: {
    email: process.env.ADMIN_EMAIL || null,
    password: process.env.ADMIN_PASSWORD || null,
  },

  seedSampleData: process.env.SEED_SAMPLE_DATA !== 'false',

  trustProxy: process.env.TRUST_PROXY === 'true' || isProd,

  tls: {
    enabled: process.env.TLS_ENABLED === 'true',
    keyFile: process.env.TLS_KEY_FILE || path.join(root, 'certs', 'key.pem'),
    certFile: process.env.TLS_CERT_FILE || path.join(root, 'certs', 'cert.pem'),
  },
};

if (isProd && config.jwtSecret.startsWith('dev-insecure')) {
  console.error('[FATAL] JWT_SECRET no está configurado en producción. Definí uno seguro.');
  process.exit(1);
}
