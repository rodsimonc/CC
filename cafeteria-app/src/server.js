// Punto de entrada. Sirve el front (landing, menú, reservas y admin) y la API /api/v1.
import express from 'express';
import helmet from 'helmet';
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { config } from './config.js';
import { runSeed } from './db/seed.js';
import authRoutes from './routes/auth.js';
import shopRoutes from './routes/shop.js';
import menuRoutes from './routes/menu.js';
import landingRoutes from './routes/landing.js';
import tableRoutes from './routes/tables.js';
import reservationRoutes from './routes/reservations.js';
import { errorHandler, notFoundHandler } from './middleware/problem.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

runSeed({ verbose: true });

const app = express();
if (config.trustProxy) app.set('trust proxy', 1);
app.use(helmet({ contentSecurityPolicy: false }));
// Las imágenes viajan como multipart (multer), así que el JSON puede quedar chico.
app.use(express.json({ limit: '256kb' }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const v1 = express.Router();
v1.use('/auth', authRoutes);
v1.use('/shop', shopRoutes);
v1.use('/menu', menuRoutes);
v1.use('/landing-images', landingRoutes);
v1.use('/tables', tableRoutes);
v1.use('/reservations', reservationRoutes);
app.use('/api/v1', v1);

app.use(notFoundHandler);
app.use(errorHandler);

const { port } = config;
function startHttps() {
  const key = fs.readFileSync(config.tls.keyFile);
  const cert = fs.readFileSync(config.tls.certFile);
  https.createServer({ key, cert }, app).listen(port, () => {
    console.log(`Cafetería (HTTPS) en https://localhost:${port}`);
  });
}
function startHttp() {
  http.createServer(app).listen(port, () => {
    console.log(`Cafetería (HTTP) en http://localhost:${port}`);
    console.log(`Landing: http://localhost:${port}/   ·   Menú: /menu.html   ·   Reservas: /reservar.html   ·   Admin: /admin.html`);
  });
}
if (config.tls.enabled && fs.existsSync(config.tls.keyFile) && fs.existsSync(config.tls.certFile)) {
  startHttps();
} else {
  if (config.tls.enabled) console.warn('[TLS] Falta el certificado (npm run gen-cert). Arranco en HTTP.');
  startHttp();
}

export default app;
