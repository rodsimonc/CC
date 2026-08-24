import { ulid } from 'ulid';
import { db, migrate } from './index.js';
import { hashPassword } from '../services/password.js';

migrate();

const now = new Date().toISOString();

const lawyers = [
  {
    id: ulid(),
    slug: 'cristian-moix',
    full_name: 'Dr. Cristian Moix',
    bar_number: 'CAMDP T° I F° 245',
    bar_status: 'active',
    practice_areas: JSON.stringify(['penal', 'academico']),
    headline: 'Abogado penalista. Ex rector universitario. Docente.',
    bio: 'Especialista en derecho penal con más de 25 años de trayectoria en Mar del Plata. Ex rector universitario y docente titular de Derecho Penal. Referente en la orientación de casos de complejidad y en la formación de generaciones de abogados de la ciudad.',
    photo_url: null,
    email: 'contacto@moixlegal.com.ar',
    phone: null,
    published: 1,
    consented: 1,
  },
  {
    id: ulid(),
    slug: 'ana-benitez',
    full_name: 'Dra. Ana Benítez',
    bar_number: 'CAMDP T° VII F° 812',
    bar_status: 'active',
    practice_areas: JSON.stringify(['familia', 'sucesiones']),
    headline: 'Familia, divorcios y sucesiones. Enfoque colaborativo.',
    bio: 'Doce años ejerciendo en el fuero de familia de Mar del Plata. Especializada en mediación y procesos colaborativos.',
    published: 1,
    consented: 1,
  },
  {
    id: ulid(),
    slug: 'martin-losada',
    full_name: 'Dr. Martín Losada',
    bar_number: 'CAMDP T° V F° 431',
    bar_status: 'active',
    practice_areas: JSON.stringify(['laboral']),
    headline: 'Derecho laboral. Representación de trabajadores.',
    bio: 'Representación de trabajadores en despidos, accidentes y reclamos individuales. Trayectoria en juicios ante los tribunales del trabajo de MdP.',
    published: 1,
    consented: 1,
  },
  {
    id: ulid(),
    slug: 'lucia-ferrari',
    full_name: 'Dra. Lucía Ferrari',
    bar_number: 'CAMDP T° IX F° 1024',
    bar_status: 'active',
    practice_areas: JSON.stringify(['civil', 'comercial', 'consumidor']),
    headline: 'Civil y comercial. Defensa del consumidor.',
    bio: 'Contratos, defensa del consumidor, daños y perjuicios. Enfoque práctico y directo.',
    published: 1,
    consented: 1,
  },
];

const insertLawyer = db.prepare(`
  INSERT OR REPLACE INTO lawyers
    (id, slug, full_name, bar_number, bar_status, practice_areas, headline, bio, photo_url, email, phone, published, consented, created_at, updated_at)
  VALUES
    (@id, @slug, @full_name, @bar_number, @bar_status, @practice_areas, @headline, @bio, @photo_url, @email, @phone, @published, @consented, @created_at, @updated_at)
`);

const seed = db.transaction((rows) => {
  for (const row of rows) {
    insertLawyer.run({
      photo_url: null,
      email: null,
      phone: null,
      created_at: now,
      updated_at: now,
      ...row,
    });
  }
});

seed(lawyers);

const insertUser = db.prepare(`
  INSERT OR IGNORE INTO users (id, email, password_hash, role, lawyer_id)
  VALUES (?, ?, ?, ?, ?)
`);

const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'cambiar-en-primer-uso-1234';
const adminHash = await hashPassword(adminPassword);

insertUser.run(ulid(), 'admin@moixlegal.com.ar', adminHash, 'admin', null);

console.log(`Seed OK. ${lawyers.length} abogados cargados.`);
console.log('Admin: admin@moixlegal.com.ar — cambiar la contraseña en el primer login.');
