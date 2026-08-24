import { ZodError } from 'zod';

const BASE = 'https://moixlegal.com.ar/errors';

export class HttpProblem extends Error {
  constructor({ type, title, status, detail, extras = {} }) {
    super(title);
    this.type = type;
    this.title = title;
    this.status = status;
    this.detail = detail;
    this.extras = extras;
  }
}

export function notFound(req, res) {
  res.status(404).type('application/problem+json').json({
    type: `${BASE}/not-found`,
    title: 'Recurso no encontrado',
    status: 404,
    detail: `No existe la ruta ${req.method} ${req.originalUrl}`,
    instance: req.originalUrl,
    'x-request-id': req.id,
  });
}

// eslint-disable-next-line no-unused-vars
export function problemHandler(err, req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(400).type('application/problem+json').json({
      type: `${BASE}/validation-failed`,
      title: 'La solicitud tiene errores de validación',
      status: 400,
      detail: 'Uno o más campos no cumplen el schema esperado',
      instance: req.originalUrl,
      'x-request-id': req.id,
      'x-errors': err.issues.map((i) => ({ field: i.path.join('.'), code: i.code, message: i.message })),
    });
  }

  if (err instanceof HttpProblem) {
    return res.status(err.status).type('application/problem+json').json({
      type: err.type,
      title: err.title,
      status: err.status,
      detail: err.detail,
      instance: req.originalUrl,
      'x-request-id': req.id,
      ...Object.fromEntries(Object.entries(err.extras).map(([k, v]) => [`x-${k}`, v])),
    });
  }

  req.log?.error({ err }, 'unhandled error');
  return res.status(500).type('application/problem+json').json({
    type: `${BASE}/internal`,
    title: 'Error interno',
    status: 500,
    detail: 'Ocurrió un error inesperado. Intente más tarde.',
    instance: req.originalUrl,
    'x-request-id': req.id,
  });
}
