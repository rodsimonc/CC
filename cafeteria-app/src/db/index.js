// Conexión SQLite y esquema de la cafetería.
import Database from 'better-sqlite3';
import fs from 'node:fs';
import path from 'node:path';
import { config } from '../config.js';

fs.mkdirSync(path.dirname(config.databaseFile), { recursive: true });
fs.mkdirSync(config.uploads.dir, { recursive: true });

export const db = new Database(config.databaseFile);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role          TEXT NOT NULL DEFAULT 'customer',   -- 'admin' | 'customer'
    name          TEXT NOT NULL DEFAULT '',
    phone         TEXT NOT NULL DEFAULT '',
    created_at    TEXT NOT NULL
  );

  -- Datos del local (una sola fila, id = 1). welcome_text es el bloque editable de la landing.
  CREATE TABLE IF NOT EXISTS shop (
    id           INTEGER PRIMARY KEY CHECK (id = 1),
    name         TEXT NOT NULL DEFAULT '',
    address      TEXT NOT NULL DEFAULT '',
    phone        TEXT NOT NULL DEFAULT '',
    email        TEXT NOT NULL DEFAULT '',
    whatsapp     TEXT NOT NULL DEFAULT '',            -- solo dígitos, formato internacional (ej. 5491122334455)
    hours        TEXT NOT NULL DEFAULT '',
    welcome_text TEXT NOT NULL DEFAULT '',
    notes        TEXT NOT NULL DEFAULT ''
  );

  -- Imágenes del carrusel de la landing. image_path es la ruta pública (/uploads/xxx.jpg).
  CREATE TABLE IF NOT EXISTS landing_images (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    image_path TEXT NOT NULL,
    caption    TEXT NOT NULL DEFAULT '',
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL
  );

  -- Ítems del menú. Categorías fijas y lado (columna izquierda/derecha) como en un menú físico.
  CREATE TABLE IF NOT EXISTS menu_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    category    TEXT NOT NULL,                        -- 'desayuno' | 'brunch' | 'cena'
    side        TEXT NOT NULL DEFAULT 'left',         -- 'left' | 'right'
    sort_order  INTEGER NOT NULL DEFAULT 0,
    name        TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    price       REAL NOT NULL DEFAULT 0,
    image_path  TEXT NOT NULL DEFAULT '',             -- ruta pública de la foto, vacío = placeholder
    available   INTEGER NOT NULL DEFAULT 1,
    created_at  TEXT NOT NULL,
    updated_at  TEXT NOT NULL
  );

  -- Mesas del salón. El layout es fijo (viene del seed); solo se edita la disponibilidad.
  CREATE TABLE IF NOT EXISTS tables (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    code       TEXT NOT NULL UNIQUE,                  -- INT-1, EXT-1, BAR-1...
    zone       TEXT NOT NULL,                         -- 'interior' | 'exterior' | 'barra'
    seats      INTEGER NOT NULL DEFAULT 2,
    sort_order INTEGER NOT NULL DEFAULT 0,
    available  INTEGER NOT NULL DEFAULT 1
  );

  -- Reservas. La constraint única evita la doble reserva de una mesa en el mismo turno.
  CREATE TABLE IF NOT EXISTS reservations (
    id                INTEGER PRIMARY KEY AUTOINCREMENT,
    table_id          INTEGER NOT NULL REFERENCES tables(id),
    date              TEXT NOT NULL,                  -- YYYY-MM-DD
    slot              TEXT NOT NULL,                  -- turno fijo, ej. '08:00-10:00'
    customer_name     TEXT NOT NULL,
    customer_whatsapp TEXT NOT NULL DEFAULT '',       -- solo dígitos, formato internacional
    status            TEXT NOT NULL DEFAULT 'pendiente', -- pendiente|confirmada|cancelada
    created_at        TEXT NOT NULL,
    updated_at        TEXT NOT NULL,
    UNIQUE (table_id, date, slot)
  );

  CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items (category, side, sort_order);
  CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations (date);
`);

export default db;
