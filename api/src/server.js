import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import pinoHttp from 'pino-http';
import pino from 'pino';
import { ulid } from 'ulid';

import { config, isProd } from './config.js';
import './db/index.js';

import lawyersRoutes from './routes/lawyers.js';
import leadsRoutes from './routes/leads.js';
import appointmentsRoutes from './routes/appointments.js';
import authRoutes from './routes/auth.js';
import chatRoutes from './routes/chat.js';

import { problemHandler, notFound } from './middleware/problem.js';

const logger = pino({
  level: isProd ? 'info' : 'debug',
  transport: isProd ? undefined : { target: 'pino-pretty' },
});

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '128kb' }));
app.use(pinoHttp({
  logger,
  genReqId: (req, res) => {
    const id = req.headers['x-request-id']?.toString() ?? ulid();
    res.setHeader('x-request-id', id);
    return id;
  },
}));

app.get('/healthz', (_req, res) => res.json({ ok: true, service: 'api', version: '0.1.0' }));

app.use('/api/v1/lawyers', lawyersRoutes);
app.use('/api/v1/leads', leadsRoutes);
app.use('/api/v1/appointments', appointmentsRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chat', chatRoutes);

app.use(notFound);
app.use(problemHandler);

app.listen(config.port, () => {
  logger.info({ port: config.port, env: config.env }, 'api arriba');
});
