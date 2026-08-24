import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { config } from '../config.js';

function resolvePath(url) {
  if (!url.startsWith('file:')) {
    throw new Error('En Fase 1 solo se soporta SQLite (file:). Ver ADR-002.');
  }
  return url.replace('file:', '');
}

const dbPath = resolvePath(config.databaseUrl);
mkdirSync(dirname(dbPath), { recursive: true });

export const db = new Database(dbPath);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

export function migrate() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS lawyers (
      id TEXT PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      full_name TEXT NOT NULL,
      bar_number TEXT NOT NULL,
      bar_status TEXT NOT NULL DEFAULT 'active',
      practice_areas TEXT NOT NULL,
      headline TEXT,
      bio TEXT,
      photo_url TEXT,
      email TEXT,
      phone TEXT,
      city TEXT DEFAULT 'Mar del Plata',
      published INTEGER NOT NULL DEFAULT 0,
      consented INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('admin', 'lawyer')),
      lawyer_id TEXT REFERENCES lawyers(id) ON DELETE SET NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS leads (
      id TEXT PRIMARY KEY,
      lawyer_id TEXT REFERENCES lawyers(id) ON DELETE SET NULL,
      area TEXT NOT NULL,
      urgency TEXT NOT NULL DEFAULT 'medium',
      summary TEXT,
      contact_name TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      session_id TEXT,
      source TEXT NOT NULL DEFAULT 'referido_por_moix',
      status TEXT NOT NULL DEFAULT 'new',
      consent_at TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id TEXT PRIMARY KEY,
      lawyer_id TEXT NOT NULL REFERENCES lawyers(id) ON DELETE CASCADE,
      lead_id TEXT REFERENCES leads(id) ON DELETE SET NULL,
      slot_at TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      contact_name TEXT,
      contact_phone TEXT,
      contact_email TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE (lawyer_id, slot_at)
    );

    CREATE TABLE IF NOT EXISTS public_data (
      id TEXT PRIMARY KEY,
      lawyer_id TEXT REFERENCES lawyers(id) ON DELETE CASCADE,
      source TEXT NOT NULL,
      payload TEXT NOT NULL,
      fetched_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_lawyers_published ON lawyers(published);
    CREATE INDEX IF NOT EXISTS idx_leads_lawyer ON leads(lawyer_id);
    CREATE INDEX IF NOT EXISTS idx_appointments_lawyer ON appointments(lawyer_id);
  `);
}

migrate();
