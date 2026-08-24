import { ulid } from 'ulid';
import { db } from '../db/index.js';

export const publicDataRepo = {
  add({ lawyerId = null, source, payload }) {
    const id = ulid();
    db.prepare('INSERT INTO public_data (id, lawyer_id, source, payload) VALUES (?, ?, ?, ?)')
      .run(id, lawyerId, source, JSON.stringify(payload));
    return id;
  },
  listBySource(source, { limit = 100 } = {}) {
    return db.prepare('SELECT * FROM public_data WHERE source = ? ORDER BY fetched_at DESC LIMIT ?')
      .all(source, limit)
      .map((r) => ({ ...r, payload: JSON.parse(r.payload) }));
  },
};
