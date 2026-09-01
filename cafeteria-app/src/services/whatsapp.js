// Generación de los deep-links wa.me para avisar una reserva.
// Aislado a propósito: si mañana se pasa a WhatsApp Cloud API, se cambia solo este
// archivo y las rutas siguen igual.

// Deja el número en formato internacional, solo dígitos (wa.me no acepta + ni espacios).
export function normalizeWhatsapp(value) {
  return String(value || '').replace(/[^0-9]/g, '');
}

// YYYY-MM-DD -> DD/MM/AAAA (sin pasar por Date, para no arrastrar zonas horarias).
export function formatDate(isoDate) {
  const [y, m, d] = String(isoDate || '').split('-');
  return y && m && d ? `${d}/${m}/${y}` : String(isoDate || '');
}

// Mensaje único que se precarga en ambos links.
export function reservationMessage({ reservation, table, shop }) {
  const zona = table?.zone || '';
  const local = shop?.name || 'Cafetería';
  return `Reserva confirmada — ${reservation.customerName} · ${formatDate(reservation.date)} · `
    + `${reservation.slot} · Mesa ${table?.code || ''} (${zona}). Cafetería ${local}.`;
}

function link(number, text) {
  const digits = normalizeWhatsapp(number);
  return digits ? `https://wa.me/${digits}?text=${encodeURIComponent(text)}` : null;
}

// Dos destinos: el local (aviso) y el cliente (su confirmación).
// El envío final lo confirma quien abre el link; acá solo se arma la URL.
export function buildReservationLinks({ reservation, table, shop }) {
  const message = reservationMessage({ reservation, table, shop });
  return {
    message,
    shopLink: link(shop?.whatsapp, message),
    customerLink: link(reservation.customerWhatsapp, message),
  };
}
