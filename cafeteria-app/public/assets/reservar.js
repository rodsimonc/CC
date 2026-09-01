// Reservas: mapa de mesas agrupado por zona + turnos fijos. Al confirmar, el servidor
// devuelve los dos deep-links wa.me (aviso al local y confirmación al cliente).
const ZONE_LABELS = { interior: 'Salón interior', exterior: 'Vereda / exterior', barra: 'Barra' };

let tables = [];
let slots = [];
let taken = [];                 // [{ tableId, slot }] ya reservados esa fecha
let unavailableTables = [];     // mesas dadas de baja por el local
let selectedSlot = null;
let selectedTableId = null;

async function initReservar(){
  await loadShopChrome();
  const input = el('date');
  input.value = todayISO();
  input.min = todayISO();
  input.addEventListener('change', onDateChange);
  el('reserveBtn').addEventListener('click', submitReservation);
  el('slots').addEventListener('click', onSlotClick);
  el('zones').addEventListener('click', onTableClick);
  await loadTables();
  await refreshAvailability();
}

function todayISO(){
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}
function formatDate(iso){
  const [y, m, d] = String(iso || '').split('-');
  return y ? `${d}/${m}/${y}` : '—';
}

async function loadTables(){
  try { ({ data: tables } = await apiGet('/tables')); }
  catch { el('zones').innerHTML = '<p class="empty">No se pudo cargar el salón.</p>'; }
}

async function onDateChange(){
  selectedSlot = null;
  selectedTableId = null;
  clearErrors();
  setMsg('reserveMsg', '');
  el('okBox').style.display = 'none';
  await refreshAvailability();
}

async function refreshAvailability(){
  const date = val('date');
  if(!date) return;
  try {
    const { data } = await apiGet(`/reservations/availability?date=${encodeURIComponent(date)}`);
    slots = data.slots;
    taken = data.taken;
    unavailableTables = data.unavailableTables;
  } catch (e) {
    setMsg('reserveMsg', e.message || 'No se pudo consultar la disponibilidad.', 'err');
    return;
  }
  renderSlots();
  renderZones();
  renderSummary();
}

// Un turno queda deshabilitado cuando ya no hay ninguna mesa libre en él.
function renderSlots(){
  const usable = tables.filter(t => t.available && !unavailableTables.includes(t.id));
  el('slots').innerHTML = slots.map(slot => {
    const busy = taken.filter(x => x.slot === slot).length;
    const full = usable.length > 0 && busy >= usable.length;
    return `<button class="slot${slot === selectedSlot ? ' active' : ''}" data-slot="${esc(slot)}"
      ${full ? 'disabled title="Sin mesas libres en este turno"' : ''}>${esc(slot)}</button>`;
  }).join('');
}

function renderZones(){
  if(!tables.length){ el('zones').innerHTML = '<p class="empty">Todavía no hay mesas cargadas.</p>'; return; }
  const zones = [...new Set(tables.map(t => t.zone))];
  el('zones').innerHTML = zones.map(zone => `
    <div class="zone">
      <h4>${esc(ZONE_LABELS[zone] || zone)}</h4>
      <div class="tables">
        ${tables.filter(t => t.zone === zone).map(tableHTML).join('')}
      </div>
    </div>`).join('');
}

function tableHTML(t){
  const offline = !t.available || unavailableTables.includes(t.id);
  // Sin turno elegido todavía no sabemos si está tomada: solo se bloquean las dadas de baja.
  const busy = selectedSlot && taken.some(x => x.tableId === t.id && x.slot === selectedSlot);
  const disabled = offline || busy;
  const title = offline ? 'Mesa no disponible' : (busy ? 'Ya reservada en este turno' : '');
  return `<button class="table-btn${t.id === selectedTableId ? ' active' : ''}" data-table="${t.id}"
    ${disabled ? `disabled title="${title}"` : ''}>${esc(t.code)}<small>${t.seats} ${t.seats === 1 ? 'lugar' : 'lugares'}</small></button>`;
}

function onSlotClick(e){
  const btn = e.target.closest('.slot');
  if(!btn || btn.disabled) return;
  selectedSlot = btn.dataset.slot;
  // Si la mesa elegida quedó ocupada en el turno nuevo, se deselecciona.
  if(selectedTableId && taken.some(x => x.tableId === selectedTableId && x.slot === selectedSlot)) selectedTableId = null;
  showErr('slot', '');
  renderSlots();
  renderZones();
  renderSummary();
}

function onTableClick(e){
  const btn = e.target.closest('.table-btn');
  if(!btn || btn.disabled) return;
  selectedTableId = Number(btn.dataset.table);
  showErr('tableId', '');
  renderZones();
  renderSummary();
}

function renderSummary(){
  const table = tables.find(t => t.id === selectedTableId);
  setText('sumDate', formatDate(val('date')));
  setText('sumSlot', selectedSlot || '—');
  setText('sumTable', table ? `${table.code} (${ZONE_LABELS[table.zone] || table.zone})` : '—');
}

async function submitReservation(){
  clearErrors();
  setMsg('reserveMsg', '');
  el('okBox').style.display = 'none';

  // Chequeo previo en el navegador; el servidor vuelve a validar todo igual.
  let ok = true;
  if(!selectedSlot){ showErr('slot', 'elegí un turno'); ok = false; }
  if(!selectedTableId){ showErr('tableId', 'elegí una mesa'); ok = false; }
  const name = val('customerName');
  if(name.length < 2){ showErr('customerName', 'ingresá tu nombre y apellido'); ok = false; }
  const whatsapp = val('customerWhatsapp').replace(/[^0-9]/g, '');
  if(whatsapp.length < 8 || whatsapp.length > 15){
    showErr('customerWhatsapp', 'ingresá tu WhatsApp con código de país (ej: 5492235551234)'); ok = false;
  }
  if(!ok){ setMsg('reserveMsg', 'Revisá los campos marcados.', 'err'); return; }

  const btn = el('reserveBtn');
  btn.disabled = true;
  setMsg('reserveMsg', 'Enviando la reserva…');
  try {
    const res = await apiSend('/reservations', {
      json: { tableId: selectedTableId, date: val('date'), slot: selectedSlot, customerName: name, customerWhatsapp: whatsapp },
    });
    showConfirmation(res);
  } catch (e) {
    if(e.status === 409){
      setMsg('reserveMsg', e.message, 'err');
      await refreshAvailability();   // otra persona tomó el turno: repintamos la grilla
    } else {
      paintApiErrors(e, 'reserveMsg');
    }
  } finally {
    btn.disabled = false;
  }
}

function showConfirmation({ data, whatsapp }){
  const table = tables.find(t => t.id === data.tableId);
  setMsg('reserveMsg', '');
  setText('okText', `${data.customerName} · ${formatDate(data.date)} · ${data.slot} · `
    + `Mesa ${data.tableCode || (table && table.code) || ''}. Abrí los dos avisos de WhatsApp para dejar todo confirmado.`);

  const shopLink = el('okShopLink');
  const customerLink = el('okCustomerLink');
  shopLink.style.display = whatsapp.shopLink ? 'inline-block' : 'none';
  if(whatsapp.shopLink) shopLink.href = whatsapp.shopLink;
  customerLink.style.display = whatsapp.customerLink ? 'inline-block' : 'none';
  if(whatsapp.customerLink) customerLink.href = whatsapp.customerLink;
  el('okBox').style.display = 'block';

  // Ofrecemos el aviso al local en una pestaña nueva; el envío final lo confirma la persona.
  if(whatsapp.shopLink) window.open(whatsapp.shopLink, '_blank', 'noopener');

  selectedTableId = null;
  el('customerName').value = '';
  el('customerWhatsapp').value = '';
  refreshAvailability();
}

initReservar();
