# Despliegue

Cada servicio se despliega por separado. Recomendación por servicio:

| Servicio | Plataforma sugerida | Notas |
|----------|---------------------|-------|
| `web`    | Vercel              | Deploy directo desde GitHub, edge functions habilitadas. |
| `api`    | Render / Railway    | Servicio web con SQLite → migración a Postgres/Supabase. |
| `chatbot`| Render              | Free tier alcanza para Fase 1. Ver `render.yaml`. |
| `scrapers`| Render Cron o VPS | Corren en batch, no requieren HTTP público. |

## Variables de entorno por servicio

### api/

```
NODE_ENV=production
PORT=4000
DATABASE_URL=postgres://user:pass@host:5432/moix
JWT_SECRET=<generar con openssl rand -hex 32>
JWT_ISSUER=moix-legal-api
JWT_AUDIENCE=moix-legal-web
CHATBOT_URL=https://moix-chatbot.onrender.com
RESEND_API_KEY=re_...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_WHATSAPP_FROM=whatsapp:+549...
CAL_COM_API_KEY=cal_...
CORS_ORIGIN=https://moixlegal.com.ar
```

### chatbot/

```
LLM_PROVIDER=google        # o anthropic
GOOGLE_API_KEY=...
ANTHROPIC_API_KEY=...
EMBEDDINGS_PROVIDER=hf     # o google
FAISS_INDEX_PATH=./storage/faiss_index
API_INTERNAL_URL=https://moix-api.onrender.com
API_INTERNAL_TOKEN=<token compartido con api/>
```

### web/

```
NEXT_PUBLIC_API_URL=https://api.moixlegal.com.ar
NEXT_PUBLIC_SITE_URL=https://moixlegal.com.ar
```

### scrapers/

```
API_INTERNAL_URL=https://moix-api.onrender.com
API_INTERNAL_TOKEN=<token compartido>
CAMDP_THROTTLE_MS=2000
MEV_THROTTLE_MS=3000
USER_AGENT=Moix-Legal-Bot/0.1 (contacto@moixlegal.com.ar)
```

## Pasos de despliegue

1. **Base de datos.** Crear proyecto en Supabase, obtener la `DATABASE_URL`. Ejecutar migraciones (`npm run migrate` desde `api/`).
2. **API.** Deploy en Render con la variable `DATABASE_URL` apuntando a Supabase. Verificar `/healthz`.
3. **Chatbot.** Deploy en Render con `render.yaml`. Setear `API_INTERNAL_URL` a la URL pública de la API.
4. **Web.** Deploy en Vercel con `NEXT_PUBLIC_API_URL` apuntando a la API. Configurar dominio.
5. **Scrapers.** Cron job en Render o VPS. Corren, escriben en `public_data` vía API, marcan draft.

## Certificados y HTTPS

En producción, HTTPS es obligatorio (lo resuelven Vercel y Render). Para desarrollo local con HTTPS, usar `mkcert`:

```bash
mkcert -install
mkcert localhost 127.0.0.1
# copiar los .pem a api/certs/ y setear TLS_CERT / TLS_KEY
```

## Rollback

Cada servicio mantiene sus últimas releases en su plataforma. El rollback es por servicio, no por monorepo — un problema en el chatbot no requiere revertir la web.
