import { ulid } from 'ulid';
import { db } from '../db/index.js';

export const usersRepo = {
  findByEmail(email) {
    return db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  },
  create({ email, passwordHash, role, lawyerId = null }) {
    const id = ulid();
    db.prepare('INSERT INTO users (id, email, password_hash, role, lawyer_id) VALUES (?, ?, ?, ?, ?)')
      .run(id, email, passwordHash, role, lawyerId);
    return { id, email, role, lawyer_id: lawyerId };
  },
};
