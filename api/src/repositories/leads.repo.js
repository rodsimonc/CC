import { ulid } from 'ulid';
import { db } from '../db/index.js';

export const leadsRepo = {
  create(input) {
    const id = ulid();
    db.prepare(`
      INSERT INTO leads (id, lawyer_id, area, urgency, summary, contact_name, contact_phone, contact_email, session_id, source, consent_at)
      VALUES (@id, @lawyer_id, @area, @urgency, @summary, @contact_name, @contact_phone, @contact_email, @session_id, @source, @consent_at)
    `).run({
      id,
      lawyer_id: input.lawyer_id ?? null,
      area: input.area,
      urgency: input.urgency ?? 'medium',
      summary: input.summary ?? null,
      contact_name: input.contact_name ?? null,
      contact_phone: input.contact_phone ?? null,
      contact_email: input.contact_email ?? null,
      session_id: input.session_id ?? null,
      source: input.source ?? 'referido_por_moix',
      consent_at: input.consent_at ?? new Date().toISOString(),
    });
    return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  },

  listByLawyer(lawyerId, { limit = 50 } = {}) {
    return db.prepare('SELECT * FROM leads WHERE lawyer_id = ? ORDER BY created_at DESC LIMIT ?')
      .all(lawyerId, limit);
  },

  updateStatus(id, status) {
    db.prepare('UPDATE leads SET status = ? WHERE id = ?').run(status, id);
    return db.prepare('SELECT * FROM leads WHERE id = ?').get(id);
  },
};
