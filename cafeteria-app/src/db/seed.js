// Seed idempotente: admin opcional (por env), datos del local, las 17 mesas del salón
// y ítems de menú de ejemplo. El carrusel arranca vacío (placeholder hasta que el admin suba fotos).
import { config } from '../config.js';
import { usersRepo } from '../repositories/users.repo.js';
import { shopRepo } from '../repositories/shop.repo.js';
import { menuRepo } from '../repositories/menu.repo.js';
import { tablesRepo } from '../repositories/tables.repo.js';
import { hashPassword } from '../services/password.js';

// Layout fijo del salón: 8 interior + 4 exterior + 5 en la barra = 17 posiciones.
const TABLE_LAYOUT = [
  { prefix: 'INT', zone: 'interior', count: 8, seats: 4 },
  { prefix: 'EXT', zone: 'exterior', count: 4, seats: 4 },
  { prefix: 'BAR', zone: 'barra', count: 5, seats: 1 },
];

const MENU_SAMPLES = [
  // Desayuno
  { category: 'desayuno', side: 'left', sortOrder: 1, name: 'Café con leche', price: 2200, description: 'Espresso doble con leche texturada.' },
  { category: 'desayuno', side: 'left', sortOrder: 2, name: 'Medialunas caseras', price: 1800, description: 'Tres unidades, de manteca.' },
  { category: 'desayuno', side: 'left', sortOrder: 3, name: 'Tostado de jamón y queso', price: 3400, description: 'Pan de masa madre, jamón cocido natural.' },
  { category: 'desayuno', side: 'right', sortOrder: 1, name: 'Exprimido de naranja', price: 2400, description: 'Medio litro, recién exprimido.' },
  { category: 'desayuno', side: 'right', sortOrder: 2, name: 'Porridge de avena', price: 3600, description: 'Avena, leche, banana y canela.' },
  { category: 'desayuno', side: 'right', sortOrder: 3, name: 'Budín del día', price: 2100, description: 'Porción generosa, consultá el sabor.' },

  // Brunch
  { category: 'brunch', side: 'left', sortOrder: 1, name: 'Huevos revueltos con palta', price: 6200, description: 'Dos huevos, palta, tomate cherry y pan tostado.' },
  { category: 'brunch', side: 'left', sortOrder: 2, name: 'Bowl de yogur y granola', price: 4800, description: 'Yogur natural, granola casera y frutas de estación.' },
  { category: 'brunch', side: 'left', sortOrder: 3, name: 'Sándwich de pollo grillado', price: 7400, description: 'Pollo, rúcula, queso y alioli suave.' },
  { category: 'brunch', side: 'right', sortOrder: 1, name: 'Tabla para dos', price: 12800, description: 'Quesos, fiambres, panes y dips.' },
  { category: 'brunch', side: 'right', sortOrder: 2, name: 'Panqueques con dulce de leche', price: 5200, description: 'Tres panqueques, dulce de leche repostero.' },
  { category: 'brunch', side: 'right', sortOrder: 3, name: 'Limonada de jengibre', price: 3200, description: 'Jarra chica, con menta fresca.' },

  // Cena
  { category: 'cena', side: 'left', sortOrder: 1, name: 'Sopa del día', price: 5400, description: 'Preparada a la mañana, consultá la del día.' },
  { category: 'cena', side: 'left', sortOrder: 2, name: 'Risotto de hongos', price: 11800, description: 'Arroz carnaroli, portobellos y parmesano.' },
  { category: 'cena', side: 'left', sortOrder: 3, name: 'Milanesa de ternera con puré', price: 12600, description: 'Milanesa napolitana opcional.' },
  { category: 'cena', side: 'right', sortOrder: 1, name: 'Ensalada de estación', price: 7800, description: 'Verdes, semillas, queso de cabra y vinagreta.' },
  { category: 'cena', side: 'right', sortOrder: 2, name: 'Tarta de verduras', price: 8600, description: 'Masa casera, acompañada con ensalada.' },
  { category: 'cena', side: 'right', sortOrder: 3, name: 'Copa de vino tinto', price: 4200, description: 'Malbec de bodega seleccionada.' },
];

export function runSeed({ verbose = false } = {}) {
  const log = (...a) => verbose && console.log('[seed]', ...a);

  // Admin: NO se crea por defecto. Solo si se definieron ADMIN_EMAIL/ADMIN_PASSWORD.
  if (usersRepo.countAdmins() === 0) {
    if (config.admin.email && config.admin.password) {
      usersRepo.create({
        email: config.admin.email, passwordHash: hashPassword(config.admin.password),
        role: 'admin', name: 'Administrador',
      });
      log(`admin creado desde variables de entorno: ${config.admin.email}`);
    } else {
      log('sin admin todavía: creá la cuenta del dueño en /admin.html (primer uso).');
    }
  }

  // Datos del local y texto de bienvenida (solo si no existen).
  if (!shopRepo.exists()) {
    shopRepo.save({
      name: 'Café Alameda',
      address: 'Belgrano 2450, Mar del Plata, Buenos Aires',
      phone: '0223 495-6677',
      email: 'hola@cafealameda.example.com',
      whatsapp: '5492235556677',
      hours: 'Todos los días de 8 a 23:30 h',
      welcomeText: 'Café de especialidad, panadería propia y cocina simple desde la mañana '
        + 'hasta la noche. Reservá tu mesa y te esperamos con la mejor mesa del salón.',
      notes: 'Reservas por turnos de 2 horas. Entre turno y turno acomodamos el salón.',
    });
    log('datos del local cargados');
  }

  // Mesas del salón: layout fijo, se crean una sola vez.
  if (tablesRepo.count() === 0) {
    let order = 0;
    for (const { prefix, zone, count, seats } of TABLE_LAYOUT) {
      for (let i = 1; i <= count; i += 1) {
        order += 1;
        tablesRepo.create({ code: `${prefix}-${i}`, zone, seats, sortOrder: order, available: true });
      }
    }
    log(`${order} mesas creadas (8 interior, 4 exterior, 5 barra)`);
  }

  // Ítems de menú de ejemplo, repartidos left/right en las tres categorías.
  if (config.seedSampleData && menuRepo.count() === 0) {
    for (const item of MENU_SAMPLES) menuRepo.create({ ...item, imagePath: '', available: true });
    log(`${MENU_SAMPLES.length} ítems de menú de ejemplo creados`);
  }

  // Carrusel: sin imágenes a propósito. La landing muestra el placeholder
  // hasta que el dueño suba las fotos reales desde /admin.html.
}

if (import.meta.url === `file://${process.argv[1]}`) {
  runSeed({ verbose: true });
  console.log('Seed completado.');
}
