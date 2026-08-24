# Deploy a Render (blueprint)

Guía para levantar los tres servicios en https://dashboard.render.com/ a partir del `render.yaml` en la raíz del repo.

## 1. Conectar el blueprint

1. Dashboard → **New +** → **Blueprint**.
2. **Connect a repository** → autorizar Render en GitHub y elegir `rodsimonc/CC`.
3. Render detecta `render.yaml` en la raíz y muestra los tres servicios:
   - `moix-legal-api` (Node · Express)
   - `moix-legal-chatbot` (Python · FastAPI)
   - `moix-legal-web` (Node · Next.js)
4. **Apply**. Render los crea en paralelo en la región **oregon** con plan free.

## 2. Cablear las URLs cruzadas (post primer deploy)

Cuando los tres servicios estén "live", cada uno tiene una URL `https://<name>.onrender.com`. Volver al blueprint y setear las variables marcadas `sync: false`:

**moix-legal-api**
- `CHATBOT_URL` = URL pública de `moix-legal-chatbot` (ej. `https://moix-legal-chatbot.onrender.com`)
- `CORS_ORIGIN` = URL pública de `moix-legal-web` (ej. `https://moix-legal-web.onrender.com`)

**moix-legal-web**
- `NEXT_PUBLIC_API_URL` = URL pública de `moix-legal-api` (ej. `https://moix-legal-api.onrender.com`)
  > Es una variable **build-time** de Next.js. Después de guardar, disparar **Manual Deploy → Clear build cache & deploy** para que el frontend embeba la URL correcta en el bundle.

**moix-legal-chatbot** (opcional, Fase 2)
- `GOOGLE_API_KEY` = clave de Google Gemini (o `ANTHROPIC_API_KEY` si se cambia `LLM_PROVIDER=anthropic`). En Fase 1 el bot responde con lógica dummy y no requiere clave.

## 3. Verificación

```bash
curl https://moix-legal-api.onrender.com/healthz
curl https://moix-legal-chatbot.onrender.com/health
curl https://moix-legal-web.onrender.com/
```

Los tres deberían responder 200. La landing pública queda en la URL de `moix-legal-web`.

## Limitaciones del plan free (relevantes para la prueba)

- **Cold start:** los servicios free se duermen tras ~15 min sin tráfico. La primera request tarda ~30 s en despertar.
- **Filesystem efímero:** el SQLite de `moix-legal-api` se pierde en cada redeploy. El `startCommand` corre `npm run seed` al arrancar para regenerar el perfil de Moix y los 3 abogados demo. Suficiente para probar; para persistencia real, migrar a Postgres (ver `docs/DEPLOY.md`).
- **Sin disco persistente:** el índice FAISS del chatbot (Fase 2) tampoco persiste; se reindexa en el arranque si `data/` está en el repo.
- **Sin outbound estable:** la IP saliente cambia; los scrapers no corren acá — se despliegan aparte (VPS o Render Background Worker con plan pago).

## Versiones pineadas

- **api** y **web** corren en Node 20 LTS (pineado en `render.yaml` con `NODE_VERSION=20.18.0` y `.nvmrc` en cada servicio). Sin el pin, Render puede resolver una versión inestable (ej. 26.x) que rompe la compilación nativa de `better-sqlite3`.
- **chatbot** corre en Python 3.11.9 (`PYTHON_VERSION` en el blueprint y `.python-version` en el servicio).

## Rollback

Cada servicio en Render mantiene un historial de deploys. Desde su página → **Manual Deploy → Rollback** para volver a la versión anterior. Se rollbackea por servicio, no por blueprint.
