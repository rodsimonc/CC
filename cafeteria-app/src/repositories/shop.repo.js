import { db } from '../db/index.js';

const get = db.prepare('SELECT * FROM shop WHERE id = 1');
const upsert = db.prepare(`
  INSERT INTO shop (id, name, address, phone, email, whatsapp, hours, welcome_text, notes)
  VALUES (1, @name, @address, @phone, @email, @whatsapp, @hours, @welcomeText, @notes)
  ON CONFLICT(id) DO UPDATE SET
    name=@name, address=@address, phone=@phone, email=@email,
    whatsapp=@whatsapp, hours=@hours, welcome_text=@welcomeText, notes=@notes
`);

function toDomain(r) {
  if (!r) return null;
  return {
    name: r.name, address: r.address, phone: r.phone, email: r.email,
    whatsapp: r.whatsapp, hours: r.hours, welcomeText: r.welcome_text, notes: r.notes,
  };
}

export const shopRepo = {
  get() { return toDomain(get.get()); },
  save(s) {
    upsert.run({
      name: s.name || '', address: s.address || '', phone: s.phone || '',
      email: s.email || '', whatsapp: s.whatsapp || '', hours: s.hours || '',
      welcomeText: s.welcomeText || '', notes: s.notes || '',
    });
    return this.get();
  },
  exists() { return !!get.get(); },
};

// --- Imágenes del carrusel de la landing ---
// Viven acá (y no en un repo propio) porque son contenido del local, igual que welcome_text.

function imageToDomain(r) {
  if (!r) return null;
  return { id: r.id, imagePath: r.image_path, caption: r.caption || '', sortOrder: r.sort_order, createdAt: r.created_at };
}

const imagesAll = db.prepare('SELECT * FROM landing_images ORDER BY sort_order, id');
const imageById = db.prepare('SELECT * FROM landing_images WHERE id = ?');
const imageInsert = db.prepare(`
  INSERT INTO landing_images (image_path, caption, sort_order, created_at)
  VALUES (@imagePath, @caption, @sortOrder, @createdAt)
`);
const imageUpdate = db.prepare('UPDATE landing_images SET caption=@caption, sort_order=@sortOrder WHERE id=@id');
const imageDelete = db.prepare('DELETE FROM landing_images WHERE id = ?');
const imageNextOrder = db.prepare('SELECT COALESCE(MAX(sort_order), 0) + 1 AS n FROM landing_images');

export const landingImagesRepo = {
  findAll() { return imagesAll.all().map(imageToDomain); },
  findById(id) { return imageToDomain(imageById.get(Number(id))); },
  create({ imagePath, caption = '', sortOrder }) {
    const info = imageInsert.run({
      imagePath,
      caption,
      sortOrder: Number.isFinite(Number(sortOrder)) ? Number(sortOrder) : imageNextOrder.get().n,
      createdAt: new Date().toISOString(),
    });
    return this.findById(info.lastInsertRowid);
  },
  update(id, { caption, sortOrder }) {
    const current = this.findById(id);
    if (!current) return null;
    imageUpdate.run({
      id: Number(id),
      caption: caption === undefined ? current.caption : String(caption),
      sortOrder: sortOrder === undefined ? current.sortOrder : Number(sortOrder) || 0,
    });
    return this.findById(id);
  },
  remove(id) { return imageDelete.run(Number(id)).changes > 0; },
};
