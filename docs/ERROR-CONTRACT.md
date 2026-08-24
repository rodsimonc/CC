# Contrato de errores

Toda respuesta con status 4xx o 5xx desde `api/` sigue [RFC 7807 — Problem Details for HTTP APIs](https://datatracker.ietf.org/doc/html/rfc7807).

## Formato base

```
Content-Type: application/problem+json
```

```json
{
  "type": "https://moixlegal.com.ar/errors/validation-failed",
  "title": "La solicitud tiene errores de validación",
  "status": 400,
  "detail": "El campo 'email' no tiene formato válido",
  "instance": "/api/v1/leads",
  "x-request-id": "01J9F5V4H7K2W8Q0T3B6",
  "x-errors": [
    { "field": "email", "code": "invalid_format" }
  ]
}
```

Campos:

- `type` — URI que identifica el tipo de error. Debe ser estable y documentable.
- `title` — resumen legible, no cambia entre ocurrencias.
- `status` — mismo código HTTP de la respuesta.
- `detail` — descripción específica de esta ocurrencia. Puede variar.
- `instance` — URI del recurso donde ocurrió el error.
- `x-request-id` — id de correlación (ULID) para trazar en logs.
- `x-errors` — array opcional con detalles por campo (validación).

Extensiones custom siempre prefijadas con `x-`.

## Tipos definidos

| type (URI) | HTTP | Cuándo |
|------------|------|--------|
| `/errors/validation-failed` | 400 | Payload no cumple el schema zod / joi. |
| `/errors/unauthorized` | 401 | Falta token o es inválido. |
| `/errors/forbidden` | 403 | Token válido, sin permisos para la acción. |
| `/errors/not-found` | 404 | Recurso no existe. |
| `/errors/conflict` | 409 | Estado inconsistente (turno ya reservado, slug duplicado). |
| `/errors/rate-limited` | 429 | Superó el rate limit. Devuelve `Retry-After`. |
| `/errors/internal` | 500 | Error no clasificado. En prod nunca expone stack. |
| `/errors/upstream-unavailable` | 502 | El chatbot o un servicio externo no responde. |

## Reglas

- Nunca devolver stack traces en producción.
- Los errores de validación siempre listan todos los problemas encontrados, no el primero.
- `x-request-id` es obligatorio en toda respuesta (incluso 2xx) para correlacionar logs.
- El frontend lee `type` para decidir el handler; nunca hace matching por `title`.
