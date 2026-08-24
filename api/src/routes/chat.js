import { Router } from 'express';
import { z } from 'zod';
import { config } from '../config.js';
import { HttpProblem } from '../middleware/problem.js';
import { chatLimiter } from '../middleware/rateLimit.js';

const router = Router();
const BASE = 'https://moixlegal.com.ar/errors';

const chatSchema = z.object({
  session_id: z.string().min(1).max(80),
  question: z.string().min(1).max(2000),
});

router.post('/', chatLimiter, async (req, res, next) => {
  try {
    const body = chatSchema.parse(req.body);
    const upstream = await fetch(`${config.chatbotUrl}/api/chat`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) {
      return next(new HttpProblem({
        type: `${BASE}/upstream-unavailable`,
        title: 'El servicio de chat no está disponible',
        status: 502,
        detail: `Chatbot respondió ${upstream.status}`,
      }));
    }
    const data = await upstream.json();
    res.json(data);
  } catch (err) {
    if (err?.cause?.code === 'ECONNREFUSED') {
      return next(new HttpProblem({
        type: `${BASE}/upstream-unavailable`,
        title: 'El servicio de chat no responde',
        status: 502,
        detail: 'No se pudo contactar al chatbot',
      }));
    }
    next(err);
  }
});

export default router;
