import { db } from '../db/index.js';

function toDomain(r) {
  if (!r) return null;
  return {
    id: r.id, category: r.category, side: r.side, sortOrder: r.sort_order,
    name: r.name, description: r.description, price: r.price,
    imagePath: r.image_path || '', available: !!r.available,
    createdAt: r.created_at, updatedAt: r.updated_at,
  };
}

const ORDER_BY = 'ORDER BY category, side, sort_order, id';
const all = db.prepare(`SELECT * FROM menu_items ${ORDER_BY}`);
const byCategory = db.prepare(`SELECT * FROM menu_items WHERE category = ? ${ORDER_BY}`);
const byId = db.prepare('SELECT * FROM menu_items WHERE id = ?');
const insert = db.prepare(`
  INSERT INTO menu_items (category, side, sort_order, name, description, price, image_path, available, created_at, updated_at)
  VALUES (@category, @side, @sortOrder, @name, @description, @price, @imagePath, @available, @createdAt, @updatedAt)
`);
const update = db.prepare(`
  UPDATE menu_items SET category=@category, side=@side, sort_order=@sortOrder, name=@name,
    description=@description, price=@price, image_path=@imagePath, available=@available,
    updated_at=@updatedAt WHERE id=@id
`);
const del = db.prepare('DELETE FROM menu_items WHERE id = ?');
const count = db.prepare('SELECT COUNT(*) AS n FROM menu_items');
const nextOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM menu_items WHERE category = ? AND side = ?');

function fields(m) {
  return {
    category: m.category, side: m.side || 'left', sortOrder: Number(m.sortOrder) || 0,
    name: m.name, description: m.description || '', price: Number(m.price) || 0,
    imagePath: m.imagePath || '', available: m.available ? 1 : 0,
  };
}

export const menuRepo = {
  findAll({ category } = {}) {
    const rows = category ? byCategory.all(category) : all.all();
    return rows.map(toDomain);
  },
  findById(id) { return toDomain(byId.get(Number(id))); },
  create(m) {
    const now = new Date().toISOString();
    const info = insert.run({ ...fields(m), createdAt: now, updatedAt: now });
    return this.findById(info.lastInsertRowid);
  },
  update(id, m) {
    update.run({ ...fields(m), id: Number(id), updatedAt: new Date().toISOString() });
    return this.findById(id);
  },
  remove(id) { return del.run(Number(id)).changes > 0; },
  count() { return count.get().n; },
  nextSortOrder(category, side) { return nextOrder.get(category, side || 'left').n; },
};
