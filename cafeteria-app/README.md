# Cafetería online

App de cafetería con **landing pública**, **menú por franja horaria**, **reservas de mesa con aviso por WhatsApp** y **panel de administración**, con la misma arquitectura que el proyecto `polleria-app`: Node/Express + SQLite, contraseñas con hash (scrypt), JWT, headers de seguridad (Helmet), errores Problem Details (RFC 7807) y soporte HTTPS.

## Qué incluye

- **Landing** (`/`): carrusel con las fotos reales del local que **rota cada 15 segundos** (placeholder neutro mientras el dueño no cargue ninguna), texto de bienvenida editable, datos del local, botón de **WhatsApp** y mail, y accesos al menú y a las reservas.
- **Menú** (`/menu.html`): tres secciones fijas — **Desayuno, Brunch y Cena** — cada una dividida en **dos columnas a lo ancho**, como una carta física. Cada ítem lleva foto, nombre, descripción y precio, con su orden y su lado.
- **Reservas** (`/reservar.html`): mapa de mesas agrupado por zona (**interior, exterior y barra**), turnos de 2 horas, grilla que deshabilita lo ya ocupado y confirmación que devuelve **dos deep-links `wa.me`** (uno para avisar al local, otro para el cliente).
- **Admin (dueño)** (`/admin.html`): ABM del menú con subida de fotos, carrusel y datos de la landing, disponibilidad de las mesas y gestión de reservas.

## Puesta en marcha

```bash
npm install
npm run seed
npm start
# Landing: http://localhost:3200/   ·   Menú: /menu.html
# Reservas: /reservar.html          ·   Admin: /admin.html
```

La primera vez se crea la base `data/cafeteria.db` con los datos del local, las 17 mesas y ítems de menú de ejemplo. **No hay admin por defecto**: la primera vez que entrás a `/admin.html` creás la cuenta del dueño. El registro de admin queda cerrado después; los clientes se registran libremente.

## Roles y flujo

1. Entrás a `/admin.html` → creás la cuenta del dueño (admin).
2. Cargás las fotos del carrusel, el texto de bienvenida y los datos del local.
3. Editás el menú: foto, nombre, descripción, precio, columna, orden y disponibilidad de cada ítem.
4. Un cliente entra a `/reservar.html`, elige día, turno y mesa, deja su nombre y WhatsApp y confirma.
5. Al confirmar se abren los dos links de WhatsApp (aviso al local y confirmación al cliente).
6. El dueño ve la reserva en el panel y cambia su estado: pendiente → confirmada → cancelada.

## Mesas y turnos

**17 posiciones**, con el layout fijo desde el seed (solo se edita su disponibilidad):

| Zona | Códigos | Cantidad |
|------|---------|----------|
| Interior | `INT-1` … `INT-8` | 8 |
| Exterior | `EXT-1` … `EXT-4` | 4 |
| Barra | `BAR-1` … `BAR-5` | 5 |

**Turnos** (bloques de 2 h, enum fijo). Los huecos entre bloques son limpieza y cambio de personal, y no se reservan:

`08:00-10:00` · `10:00-12:00` · `13:00-15:00` · `15:00-17:00` · `18:00-20:00` · `20:00-22:00` · `22:00-23:30`

La restricción única `(table_id, date, slot)` es la que impide la doble reserva: si dos personas eligen lo mismo a la vez, la segunda recibe un **409** con Problem Details. Una reserva cancelada libera el turno.

## WhatsApp

El disparo es por **deep-link `wa.me`**, sin cuenta ni API extra: el servidor arma las dos URLs con el mensaje precargado y el envío final lo confirma quien abre el link.

```
Reserva confirmada — {nombre} · {DD/MM/AAAA} · {turno} · Mesa {código} ({zona}). Cafetería {nombre_local}.
```

El número del local se edita desde el panel (`shop.whatsapp`). Toda la generación de links vive en `src/services/whatsapp.js`, aislada a propósito para poder pasar a la WhatsApp Cloud API más adelante sin tocar las rutas.

## Seguridad

- Sin credenciales por defecto; contraseñas con **hash scrypt** (mínimo 8 caracteres con letras y números).
- **JWT** (HS256, claims `iss`/`aud`/`exp`/`sub` validados); autorización por rol (`admin` / `customer`) siempre en el servidor.
- Los datos de la reserva **se validan en el servidor**: turno del enum, fecha no pasada, mesa habilitada y turno libre; nunca se confía en lo que manda el cliente.
- Las imágenes se suben con **multer** a `public/uploads/` con nombre generado por el servidor y filtro por tipo MIME; en la base se guarda **solo la ruta**.
- Rate limiting en login, registro y creación de reservas; headers con Helmet; errores con Problem Details (RFC 7807).

## Endpoints principales

| Método | Ruta | Acceso |
|--------|------|--------|
| POST | `/api/v1/auth/register-admin` | público (solo primer uso) |
| POST | `/api/v1/auth/register` | público (clientes) |
| POST | `/api/v1/auth/login` | público |
| GET | `/api/v1/auth/setup-status` | público |
| GET·PUT | `/api/v1/auth/me` | autenticado |
| GET | `/api/v1/shop` | público |
| PUT | `/api/v1/shop` | admin (datos del local, `welcomeText`, `whatsapp`) |
| GET | `/api/v1/landing-images` | público |
| POST·PATCH·DELETE | `/api/v1/landing-images/{id}` | admin (subir / ordenar / borrar) |
| GET | `/api/v1/menu?category=` | público (admin ve los no disponibles) |
| POST·PUT·PATCH·DELETE | `/api/v1/menu/{id}` | admin (incluye upload de imagen) |
| GET | `/api/v1/tables` | público |
| PATCH | `/api/v1/tables/{id}` | admin (solo disponibilidad) |
| GET | `/api/v1/reservations/availability?date=` | público (turnos ocupados) |
| POST | `/api/v1/reservations` | público/cliente (devuelve los deep-links `wa.me`) |
| GET | `/api/v1/reservations` | admin |
| PATCH | `/api/v1/reservations/{id}/status` | admin |

## HTTPS local

```bash
npm run gen-cert        # certs/key.pem y certs/cert.pem
# TLS_ENABLED=true en .env, luego npm start -> https://localhost:3200
```

## Fuera de alcance (v0)

Pagos o seña online de la reserva, envío automático real por WhatsApp Cloud API, notificaciones por email, recordatorios automáticos de turno y app móvil nativa.

> Datos por defecto de ejemplo (Café Alameda, WhatsApp y mail ficticios): editables desde el panel → "Landing".
