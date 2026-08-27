# AI SaaS App — Summarize-as-a-Service

Full-stack scaffold: FastAPI backend, SQLite storage, vanilla-JS frontend, Docker deploy. The "AI" is an offline TF-IDF extractive summarizer — swap the `summarize()` function for an LLM later if you want.

## Stack

- **Backend:** FastAPI + Pydantic
- **Storage:** SQLite (`users`, `summaries`)
- **Auth:** per-user API keys (`X-API-Key` header)
- **Frontend:** static `index.html` served by the same app
- **Deploy:** Docker + docker-compose

## Run locally (no Docker)

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Open `http://localhost:8000` for the UI, `/docs` for the OpenAPI console.

## Run with Docker

```bash
docker compose up --build
```

## Endpoints

| Method | Path | Auth | Body |
|---|---|---|---|
| `POST` | `/signup` | — | `{email}` → `{api_key}` |
| `POST` | `/summarize` | `X-API-Key` | `{text, sentences}` |
| `GET` | `/summaries` | `X-API-Key` | list your history |
| `GET` | `/health` | — | ping |
| `GET` | `/docs` | — | OpenAPI UI |

## Try it

```bash
curl -X POST http://localhost:8000/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com"}'
# → {"email":"...","api_key":"sk_..."}

curl -X POST http://localhost:8000/summarize \
  -H "Content-Type: application/json" \
  -H "X-API-Key: sk_..." \
  -d '{"text":"A long article about anything at all. It has many sentences. Some are important. Others are filler. The summarizer picks the top ones by TF-IDF weight.","sentences":2}'
```

## Layout

```
backend/
  main.py         — FastAPI app, auth dependency, routes
  db.py           — SQLite init and helpers
  summarizer.py   — TF-IDF extractive summarizer
frontend/
  index.html      — one-page UI
Dockerfile
docker-compose.yml
```
