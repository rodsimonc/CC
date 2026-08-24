import 'dotenv/config';

function required(name, fallback) {
  const value = process.env[name] ?? fallback;
  if (value === undefined) {
    throw new Error(`Falta variable de entorno ${name}`);
  }
  return value;
}

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: required('DATABASE_URL', 'file:./data/moix.db'),
  jwt: {
    secret: required('JWT_SECRET', 'dev-only-secret-please-change'),
    issuer: process.env.JWT_ISSUER ?? 'moix-legal-api',
    audience: process.env.JWT_AUDIENCE ?? 'moix-legal-web',
    ttlSeconds: Number(process.env.JWT_TTL_SECONDS ?? 3600),
  },
  chatbotUrl: process.env.CHATBOT_URL ?? 'http://localhost:8000',
  corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  rateLimit: {
    loginMax: Number(process.env.RATE_LIMIT_LOGIN_MAX ?? 5),
    chatMax: Number(process.env.RATE_LIMIT_CHAT_MAX ?? 30),
  },
};

export const isProd = config.env === 'production';
