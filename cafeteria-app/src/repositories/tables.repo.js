import { db } from '../db/index.js';

function toDomain(r) {
  if (!r) return null;
  return { id: r.id, code: r.code, zone: r.zone, seats: r.seats, sortOrder: r.sort_order, available: !!r.available };
}

const all = db.prepare('SELECT * FROM tables ORDER BY sort_order, id');
const byId = db.prepare('SELECT * FROM tables WHERE id = ?');
const byCode = db.prepare('SELECT * FROM tables WHERE code = ?');
const insert = db.prepare(`
  INSERT INTO tables (code, zone, seats, sort_order, available)
  VALUES (@code, @zone, @seats, @sortOrder, @available)
`);
const setAvailable = db.prepare('UPDATE tables SET available = @available WHERE id = @id');
const count = db.prepare('SELECT COUNT(*) AS n FROM tables');

export const tablesRepo = {
  findAll() { return all.all().map(toDomain); },
  findById(id) { return toDomain(byId.get(Number(id))); },
  findByCode(code) { return toDomain(byCode.get(String(code))); },
  // El layout es fijo: las mesas solo se crean desde el seed.
  create(t) {
    const info = insert.run({
      code: t.code, zone: t.zone, seats: Number(t.seats) || 2,
      sortOrder: Number(t.sortOrder) || 0, available: t.available === false ? 0 : 1,
    });
    return this.findById(info.lastInsertRowid);
  },
  // Lo único editable de una mesa es su disponibilidad.
  setAvailable(id, available) {
    setAvailable.run({ id: Number(id), available: available ? 1 : 0 });
    return this.findById(id);
  },
  count() { return count.get().n; },
};
