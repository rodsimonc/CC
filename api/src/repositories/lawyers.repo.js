import { ulid } from 'ulid';
import { db } from '../db/index.js';

const rowToDto = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    slug: row.slug,
    full_name: row.full_name,
    bar_number: row.bar_number,
    bar_status: row.bar_status,
    practice_areas: JSON.parse(row.practice_areas ?? '[]'),
    headline: row.headline,
    bio: row.bio,
    photo_url: row.photo_url,
    email: row.email,
    phone: row.phone,
    city: row.city,
    published: Boolean(row.published),
    consented: Boolean(row.consented),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

export const lawyersRepo = {
  listPublished({ area, limit = 20 } = {}) {
    let sql = 'SELECT * FROM lawyers WHERE published = 1';
    const params = [];
    if (area) {
      sql += " AND practice_areas LIKE ?";
      params.push(`%\"${area}\"%`);
    }
    sql += ' ORDER BY full_name ASC LIMIT ?';
    params.push(limit);
    return db.prepare(sql).all(...params);
  },

  findBySlug(slug) {
    return rowToDto(db.prepare('SELECT * FROM lawyers WHERE slug = ?').get(slug));
  },

  findById(id) {
    return rowToDto(db.prepare('SELECT * FROM lawyers WHERE id = ?').get(id));
  },

  create(input) {
    const id = ulid();
    db.prepare(`
      INSERT INTO lawyers (id, slug, full_name, bar_number, bar_status, practice_areas, headline, bio, photo_url, email, phone, published, consented)
      VALUES (@id, @slug, @full_name, @bar_number, @bar_status, @practice_areas, @headline, @bio, @photo_url, @email, @phone, @published, @consented)
    `).run({
      id,
      slug: input.slug,
      full_name: input.full_name,
      bar_number: input.bar_number,
      bar_status: input.bar_status ?? 'active',
      practice_areas: JSON.stringify(input.practice_areas ?? []),
      headline: input.headline ?? null,
      bio: input.bio ?? null,
      photo_url: input.photo_url ?? null,
      email: input.email ?? null,
      phone: input.phone ?? null,
      published: input.published ? 1 : 0,
      consented: input.consented ? 1 : 0,
    });
    return this.findById(id);
  },
};
