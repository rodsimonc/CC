# Changelog

Sigue [SemVer](https://semver.org/lang/es/). Los cambios más recientes van arriba.

## [0.1.0] - 2026-08-24

### Agregado
- Estructura inicial del monorepo con cuatro servicios: `api`, `chatbot`, `web`, `scrapers`.
- Backend REST en Node.js + Express con SQLite en desarrollo, repositorios y seed inicial (perfil del Dr. Moix + 3 abogados demo).
- Servicio de chatbot en FastAPI con endpoint `/api/chat` (respuesta dummy con estructura RAG lista).
- Frontend Next.js 14 con landing, chat mock embebido y perfil de abogado individual.
- Scaffolding de scrapers para CAMDP, MEV SCBA y fuentes complementarias.
- Documentación transversal: arquitectura, despliegue, contrato de errores, cumplimiento legal, OpenAPI.
