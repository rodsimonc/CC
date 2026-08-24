import { ulid } from 'ulid';
import { db } from '../db/index.js';

export const appointmentsRepo = {
  existsForLawyerAtSlot(lawyerId, slotAt) {
    const row = db.prepare('SELECT 1 FROM appointments WHERE lawyer_id = ? AND slot_at = ?')
      .get(lawyerId, slotAt);
    return Boolean(row);
  },

  create(input) {
    const id = ulid();
    db.prepare(`
      INSERT INTO appointments (id, lawyer_id, lead_id, slot_at, status, contact_name, contact_phone, contact_email)
      VALUES (@id, @lawyer_id, @lead_id, @slot_at, @status, @contact_name, @contact_phone, @contact_email)
    `).run({
      id,
      lawyer_id: input.lawyer_id,
      lead_id: input.lead_id ?? null,
      slot_at: input.slot_at,
      status: input.status ?? 'pending',
      contact_name: input.contact_name ?? null,
      contact_phone: input.contact_phone ?? null,
      contact_email: input.contact_email ?? null,
    });
    return db.prepare('SELECT * FROM appointments WHERE id = ?').get(id);
  },

  listByLawyer(lawyerId) {
    return db.prepare('SELECT * FROM appointments WHERE lawyer_id = ? ORDER BY slot_at ASC').all(lawyerId);
  },
};
