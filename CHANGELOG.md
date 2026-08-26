# Changelog

Sigue [SemVer](https://semver.org/lang/es/). Los cambios más recientes van arriba.

## [0.2.0] - 2026-08-25

### Cambio de alcance
- El proyecto pivota de "directorio/marketplace de la red del Dr. Moix" a **sitio institucional del Estudio Moix Abogados**, que se dedica exclusivamente a derecho penal.
- El asistente virtual pasa a ser **filtro por área**: si el caso es penal, deriva al estudio; si no, orienta al consultante hacia el fuero correspondiente.
- Se agregan las páginas `/mi-caso` (portal del cliente, vista previa Fase 3) y se reescribe `/admin` como **Panel del estudio** (vista previa Fase 2).
- El chat pide **historial de conversación** para poder repreguntar en casos ambiguos con memoria.
- El chatbot suma un "manual" concreto de qué es penal y qué no, con listado de ejemplos y zona gris. Cuando duda, pregunta antes de derivar.
- El campo `is_criminal` guía la derivación del backend. Nuevo `confidence` = `low` para preguntas de aclaración (no recomienda ni ofrece agenda hasta tener seguridad).
- Sacamos del catálogo a Ana Benítez, Martín Losada y Lucía Ferrari (no eran del estudio). Solo queda Cristian Moix + placeholders del equipo hasta que cada integrante se sume.

## [0.1.1] - 2026-08-24

### Agregado
- Blueprint `render.yaml` en la raíz para desplegar los tres servicios (api, chatbot, web) con un click.
- `docs/DEPLOY-RENDER.md` con guía paso a paso, cableado de URLs cruzadas y limitaciones del plan free.

### Removido
- `chatbot/render.yaml` redundante (reemplazado por el blueprint raíz, que es el que Render lee).

## [0.1.0] - 2026-08-24

### Agregado
- Estructura inicial del monorepo con cuatro servicios: `api`, `chatbot`, `web`, `scrapers`.
- Backend REST en Node.js + Express con SQLite en desarrollo, repositorios y seed inicial (perfil del Dr. Moix + 3 abogados demo).
- Servicio de chatbot en FastAPI con endpoint `/api/chat` (respuesta dummy con estructura RAG lista).
- Frontend Next.js 14 con landing, chat mock embebido y perfil de abogado individual.
- Scaffolding de scrapers para CAMDP, MEV SCBA y fuentes complementarias.
- Documentación transversal: arquitectura, despliegue, contrato de errores, cumplimiento legal, OpenAPI.
