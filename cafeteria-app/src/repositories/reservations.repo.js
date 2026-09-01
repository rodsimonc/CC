import { db } from '../db/index.js';

function toDomain(r) {
  if (!r) return null;
  return {
    id: r.id, tableId: r.table_id, tableCode: r.table_code, tableZone: r.table_zone,
    date: r.date, slot: r.slot, customerName: r.customer_name, customerWhatsapp: r.customer_whatsapp,
    status: r.status, createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

const SELECT = `
  SELECT r.*, t.code AS table_code, t.zone AS table_zone
  FROM reservations r JOIN tables t ON t.id = r.table_id
`;

const byId = db.prepare(`${SELECT} WHERE r.id = ?`);
const byDate = db.prepare(`${SELECT} WHERE r.date = ? ORDER BY r.slot, t.sort_order`);
const allPaged = db.prepare(`${SELECT} ORDER BY r.date DESC, r.slot, t.sort_order LIMIT ? OFFSET ?`);
const countAll = db.prepare('SELECT COUNT(*) AS n FROM reservations');
const countByDate = db.prepare('SELECT COUNT(*) AS n FROM reservations WHERE date = ?');
// Los turnos cancelados liberan la mesa, por eso no cuentan como ocupados.
const takenByDate = db.prepare(`
  SELECT table_id, slot FROM reservations WHERE date = ? AND status != 'cancelada'
`);
const insert = db.prepare(`
  INSERT INTO reservations (table_id, date, slot, customer_name, customer_whatsapp, status, created_at, updated_at)
  VALUES (@tableId, @date, @slot, @customerName, @customerWhatsapp, @status, @createdAt, @updatedAt)
`);
const updateStatus = db.prepare('UPDATE reservations SET status=@status, updated_at=@updatedAt WHERE id=@id');
const bySlot = db.prepare('SELECT * FROM reservations WHERE table_id = ? AND date = ? AND slot = ?');
const rebook = db.prepare(`
  UPDATE reservations SET customer_name=@customerName, customer_whatsapp=@customerWhatsapp,
    status='pendiente', updated_at=@updatedAt WHERE id=@id
`);

// Error de dominio: ese turno ya está tomado por una reserva viva.
export class SlotTakenError extends Error {
  constructor(reservation) {
    super('slot ocupado');
    this.reservation = reservation;
  }
}

export const reservationsRepo = {
  findById(id) { return toDomain(byId.get(Number(id))); },
  findByDate(date) { return byDate.all(String(date)).map(toDomain); },
  findAll({ limit = 20, offset = 0 } = {}) { return allPaged.all(limit, offset).map(toDomain); },
  countAll() { return countAll.get().n; },
  countByDate(date) { return countByDate.get(String(date)).n; },
  // Pares mesa/turno ya tomados en una fecha, para pintar la grilla del cliente.
  takenOn(date) { return takenByDate.all(String(date)).map((r) => ({ tableId: r.table_id, slot: r.slot })); },
  // Reserva atómica. La constraint única (table_id, date, slot) impide la doble reserva;
  // una reserva cancelada libera el turno, así que su fila se reutiliza.
  book: db.transaction(function book(r) {
    const tableId = Number(r.tableId);
    const date = String(r.date);
    const slot = String(r.slot);
    const now = new Date().toISOString();
    const existing = bySlot.get(tableId, date, slot);
    if (existing && existing.status !== 'cancelada') {
      throw new SlotTakenError(toDomain(byId.get(existing.id)));
    }
    if (existing) {
      rebook.run({ id: existing.id, customerName: r.customerName, customerWhatsapp: r.customerWhatsapp || '', updatedAt: now });
      return toDomain(byId.get(existing.id));
    }
    const info = insert.run({
      tableId, date, slot,
      customerName: r.customerName, customerWhatsapp: r.customerWhatsapp || '',
      status: r.status || 'pendiente', createdAt: now, updatedAt: now,
    });
    return toDomain(byId.get(info.lastInsertRowid));
  }),
  updateStatus(id, status) {
    updateStatus.run({ id: Number(id), status, updatedAt: new Date().toISOString() });
    return this.findById(id);
  },
};
