# chatbot/ — Servicio RAG

Servicio Python + FastAPI que orquesta la conversación con el consultante, clasifica el área legal y recomienda 1 a 3 abogados de la red. En Fase 2 se completa con LangChain + FAISS para RAG real sobre los perfiles y la normativa argentina indexada.

## Requisitos

- Python **3.11+**
- pip

## Puesta en marcha

```bash
cd chatbot
python -m venv .venv
source .venv/bin/activate       # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.server:app --reload --port 8000
```

Endpoints levantan en `http://localhost:8000`.

Notas para Windows:

- Si `pip install` falla con `sentence-transformers` en Fase 2, instalar primero `torch` desde la [guía oficial](https://pytorch.org/get-started/locally/) según CPU/GPU.
- En PowerShell, la activación del venv es `.venv\Scripts\Activate.ps1`. Si Windows bloquea el script: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass`.

## Estructura

```
chatbot/
├── app/
│   ├── server.py       # FastAPI, endpoints
│   ├── config.py       # settings con pydantic-settings
│   ├── rag.py          # cadena RAG (Fase 1: dummy con forma final)
│   ├── router.py       # detección heurística de área/urgencia
│   └── ingest.py       # reindexación desde data/
├── data/
│   ├── lawyers.jsonl   # perfiles sincronizados desde api/
│   └── normativa/      # normativa argentina para el índice
├── storage/
│   └── faiss_index/    # persistencia del índice (Fase 2)
├── requirements.txt
├── render.yaml         # deploy en Render
└── .env.example
```

## Endpoints

| Método | Ruta            | Descripción |
|--------|-----------------|-------------|
| GET    | `/health`       | estado del servicio |
| POST   | `/api/chat`     | responde `{answer, recommendations[], booking_cta, area, urgency}` |
| POST   | `/api/reindex`  | reindexa desde `data/` (admin) |

Ejemplo:

```bash
curl -X POST http://localhost:8000/api/chat \
  -H 'content-type: application/json' \
  -d '{"session_id":"demo-1","question":"Me despidieron sin causa"}'
```

## Comportamiento del bot

- Español rioplatense (voseo).
- Tono empático, no da asesoramiento legal directo.
- Detecta área (penal, laboral, familia, civil, comercial, sucesiones, administrativo, tránsito, contravenciones, consumidor).
- Detecta urgencia (detención, plazo procesal, medida cautelar).
- Recupera perfiles filtrados por área.
- Cierra con CTA de agenda y disclaimer visible.

## Scripts

| Comando | Qué hace |
|---------|----------|
| `uvicorn app.server:app --reload --port 8000` | dev server con recarga |
| `python -m app.ingest` | reindexa desde `data/` |

## Seguridad

- No expone credenciales por defecto.
- `/api/reindex` debe protegerse con token compartido (`API_INTERNAL_TOKEN`) en Fase 2.
- Rate limiting a nivel gateway (la API hace el proxy y limita en `/chat`).
- No persiste el texto crudo del usuario más allá del `session_id`; los logs sensibles se anonimizan a 12 meses (ver `docs/LEGAL-COMPLIANCE.md`).

## Despliegue

`render.yaml` incluido. Requiere setear `GOOGLE_API_KEY` (o `ANTHROPIC_API_KEY`) y `API_INTERNAL_URL` desde el panel.
