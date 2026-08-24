import { Router } from 'express';
import { z } from 'zod';
import { usersRepo } from '../repositories/users.repo.js';
import { verifyPassword } from '../services/password.js';
import { issueToken } from '../middleware/auth.js';
import { HttpProblem } from '../middleware/problem.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const router = Router();
const BASE = 'https://moixlegal.com.ar/errors';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

router.post('/login', loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = usersRepo.findByEmail(email);
    const ok = user && await verifyPassword(password, user.password_hash);
    if (!user || !ok) {
      return next(new HttpProblem({
        type: `${BASE}/unauthorized`,
        title: 'Credenciales inválidas',
        status: 401,
        detail: 'Email o contraseña incorrectos',
      }));
    }
    const token = issueToken({ sub: user.id, role: user.role });
    res.json({
      token,
      expires_at: new Date(Date.now() + 3600 * 1000).toISOString(),
      role: user.role,
    });
  } catch (err) { next(err); }
});

export default router;
