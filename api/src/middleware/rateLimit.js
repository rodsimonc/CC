import rateLimit from 'express-rate-limit';
import { config } from '../config.js';

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.rateLimit.loginMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://moixlegal.com.ar/errors/rate-limited',
    title: 'Demasiados intentos de login',
    status: 429,
    detail: 'Espere unos minutos antes de volver a intentar.',
  },
});

export const chatLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: config.rateLimit.chatMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    type: 'https://moixlegal.com.ar/errors/rate-limited',
    title: 'Demasiadas consultas al chat',
    status: 429,
    detail: 'Espere un momento y vuelva a preguntar.',
  },
});
