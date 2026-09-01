// Emisión y verificación de JWT (HS256). Claims iss/aud/exp/sub validados siempre.
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

const ALGORITHM = 'HS256';

export function signAccessToken(user) {
  return jwt.sign(
    { role: user.role },
    config.jwtSecret,
    {
      algorithm: ALGORITHM,
      issuer: config.jwtIssuer,
      audience: config.jwtAudience,
      subject: String(user.id),
      expiresIn: config.accessTokenTtl,
      jwtid: crypto.randomUUID(),
    }
  );
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret, {
    algorithms: [ALGORITHM], // rechaza alg: none
    issuer: config.jwtIssuer,
    audience: config.jwtAudience,
  });
}
