import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import { HttpProblem } from './problem.js';

const BASE = 'https://moixlegal.com.ar/errors';

export function issueToken({ sub, role }) {
  return jwt.sign(
    { sub, role },
    config.jwt.secret,
    {
      algorithm: 'HS256',
      issuer: config.jwt.issuer,
      audience: config.jwt.audience,
      expiresIn: config.jwt.ttlSeconds,
    }
  );
}

export function requireAuth(roles = []) {
  return (req, _res, next) => {
    const header = req.headers.authorization ?? '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(new HttpProblem({
        type: `${BASE}/unauthorized`,
        title: 'Se requiere autenticación',
        status: 401,
        detail: 'Falta el header Authorization: Bearer <token>',
      }));
    }
    try {
      const payload = jwt.verify(token, config.jwt.secret, {
        algorithms: ['HS256'],
        issuer: config.jwt.issuer,
        audience: config.jwt.audience,
      });
      if (roles.length > 0 && !roles.includes(payload.role)) {
        return next(new HttpProblem({
          type: `${BASE}/forbidden`,
          title: 'Sin permisos suficientes',
          status: 403,
          detail: `Se requiere rol ${roles.join(' o ')}`,
        }));
      }
      req.user = { id: payload.sub, role: payload.role };
      next();
    } catch (err) {
      next(new HttpProblem({
        type: `${BASE}/unauthorized`,
        title: 'Token inválido',
        status: 401,
        detail: err.message,
      }));
    }
  };
}
