# web/ — Frontend público

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Landing con chatbot embebido, perfiles individuales de abogados y panel admin (placeholder en Fase 1).

## Requisitos

- Node.js **>= 20**
- npm

## Puesta en marcha

```bash
cd web
cp .env.example .env.local
npm install
npm run dev            # http://localhost:3000
```

En Fase 1 la home consume respuestas mock del chat sin depender de la API. Para probar con backend real, levantar `api/` y `chatbot/` y setear `NEXT_PUBLIC_API_URL`.

Notas para Windows:

- Tailwind y Next funcionan out-of-the-box. Si `npm install` falla por permisos, correr la terminal como administrador o usar WSL.
- Las fuentes se cargan desde Google Fonts (con `preconnect`), lo que requiere red en el primer render.

## Estructura

```
web/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # home con hero + chat + red
│   ├── abogados/[slug]/page.tsx    # perfil individual
│   ├── admin/                      # panel (placeholder)
│   ├── api/chat/route.ts           # proxy opcional
│   └── globals.css
├── components/
│   ├── ChatWidget.tsx
│   ├── LawyerCard.tsx
│   ├── LawyerHero.tsx
│   ├── Timeline.tsx
│   └── BookingCalendar.tsx
├── lib/
│   ├── api.ts                      # cliente REST tipado
│   ├── schema.ts                   # zod
│   └── demo-lawyers.ts             # fallback para Fase 1
├── public/
├── tailwind.config.ts
└── next.config.mjs
```

## Scripts

| Script         | Qué hace |
|----------------|----------|
| `npm run dev`  | Dev server en `http://localhost:3000` |
| `npm run build`| Build de producción |
| `npm start`    | Servir el build |

## Estética

- Primario `#0F2A44`, acento `#C9A961`, fondo `#FAFAF7`.
- Titulares en **Fraunces** (serif moderna), cuerpo en **Inter**.
- Modo oscuro con `class="dark"` (paleta invertida coherente).
- Micro-animaciones sutiles con Framer Motion.
- Mobile-first; el chat es visible desde el hero (no burbuja oculta).
- Accesibilidad WCAG AA como línea de base.

## SEO

- `metadata` global + `generateMetadata` en perfiles.
- `application/ld+json` con `schema.org/Attorney` por perfil.
- `robots.txt` y `sitemap` a completar en Fase 2.

## Despliegue

Vercel. `NEXT_PUBLIC_API_URL` como env var apuntando a la API pública.
