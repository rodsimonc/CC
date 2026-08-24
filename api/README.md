# api/ — Backend REST

Node.js 20 + Express. Persistencia con SQLite en desarrollo (Postgres/Supabase en producción). Autenticación con JWT propio (HS256). Errores en formato Problem Details (RFC 7807).

## Requisitos

- Node.js **>= 20**
- npm (o pnpm)
- SQLite viene embebido vía `better-sqlite3`, no requiere instalar el motor.

## Puesta en marcha

```bash
cd api
cp .env.example .env
npm install
npm run seed          # crea DB y carga perfiles demo
npm run dev           # levanta en http://localhost:4000
```

Notas para Windows:

- `better-sqlite3` requiere herramientas de build. Con Node.js 20 y npm >= 10 suele bastar; si falla, instalar los `windows-build-tools` (viejo) o Visual Studio Build Tools 2022 con "Desktop development with C++".
- Los scripts asumen shell POSIX. En PowerShell, usar `npm run <script>` normalmente funciona; para variables inline usar `$env:VAR="valor"; npm run dev`.

## Estructura

```
api/
├── src/
│   ├── server.js               # bootstrap Express
│   ├── config.js               # lectura y validación de env
│   ├── db/
│   │   ├── index.js            # conexión SQLite + migraciones
│   │   └── seed.js             # seed: perfil Moix + 3 abogados demo + admin
│   ├── repositories/           # capa de acceso a datos
│   ├── services/               # dominio (matching, password, notif, scheduling)
│   ├── routes/                 # controllers Express
│   └── middleware/             # problem, auth, rateLimit
├── openapi.yaml                # (ver docs/openapi.yaml a nivel monorepo)
├── postman_collection.json
├── Dockerfile
└── .env.example
```

## Endpoints

| Método | Ruta                           | Auth              | Descripción |
|--------|--------------------------------|-------------------|-------------|
| GET    | `/healthz`                     | público           | health check |
| GET    | `/api/v1/lawyers`              | público           | listar abogados publicados |
| GET    | `/api/v1/lawyers/:slug`        | público           | detalle por slug |
| POST   | `/api/v1/lawyers`              | admin             | crear abogado |
| POST   | `/api/v1/leads`                | público           | crear lead (viene del chat) |
| GET    | `/api/v1/leads`                | admin / abogado   | listar leads |
| POST   | `/api/v1/appointments`         | público           | reservar turno |
| GET    | `/api/v1/appointments`         | admin / abogado   | listar turnos |
| POST   | `/api/v1/auth/login`           | público           | emitir JWT |
| POST   | `/api/v1/chat`                 | público           | proxy al chatbot |

Contrato completo en `docs/openapi.yaml`.

## Scripts

| Script       | Qué hace |
|--------------|----------|
| `npm run dev`  | Levanta el servidor con `--watch` |
| `npm start`    | Levanta en modo producción |
| `npm run seed` | Corre migraciones y carga datos demo |
| `npm test`     | Corre tests unitarios (`node --test`) |

## Seguridad

- **Sin credenciales por defecto en producción.** El seed crea un usuario admin con contraseña de desarrollo que debe cambiarse en el primer login.
- **Passwords con scrypt** (`services/password.js`), formato `scrypt$N$salt$hash`.
- **JWT HS256** validando `iss`, `aud`, `exp`, `sub` y forzando el algoritmo (rechazo explícito de `alg: none`).
- **Rate limiting** en `/auth/login` y `/chat` con `express-rate-limit`.
- **Helmet** con configuración por defecto para headers de seguridad.
- **CORS** restringido a `CORS_ORIGIN`.
- **Problem Details** en todos los errores (`application/problem+json`).
- **HTTPS obligatorio en producción**; en local usar cert autofirmado (`mkcert`).

## Despliegue

Ver `docs/DEPLOY.md`. Recomendado: Render o Railway; Dockerfile incluido.
