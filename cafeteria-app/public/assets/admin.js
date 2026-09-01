// Panel del dueño: alta de la cuenta en el primer uso, ABM del menú con fotos,
// carrusel y datos de la landing, disponibilidad de mesas y gestión de reservas.
let token = null;
let menuItems = [];
let tables = [];

// ---------- Acceso ----------
async function initAdmin(){
  await loadShopChrome();
  el('setupBtn').addEventListener('click', registerAdmin);
  el('loginBtn').addEventListener('click', login);
  el('logoutBtn').addEventListener('click', logout);
  el('liPassword').addEventListener('keydown', e => { if(e.key === 'Enter') login(); });
  document.querySelector('.admin-tabs').addEventListener('click', onTabClick);
  await checkSetup();
}

async function checkSetup(){
  try {
    const { needsSetup } = await apiGet('/auth/setup-status');
    el('setupCard').style.display = needsSetup ? 'block' : 'none';
    el('loginCard').style.display = needsSetup ? 'none' : 'block';
  } catch {
    el('loginCard').style.display = 'block';
  }
}

async function registerAdmin(){
  clearErrors();
  const password = val('suPassword');
  if(password !== val('suPassword2')){ showErr('password2', 'las contraseñas no coinciden'); return; }
  setMsg('setupMsg', 'Creando la cuenta…');
  try {
    const res = await apiSend('/auth/register-admin', { json: { email: val('suEmail'), password, name: val('suName') } });
    token = res.accessToken;
    enterApp();
  } catch (e) { paintApiErrors(e, 'setupMsg'); }
}

async function login(){
  clearErrors();
  setMsg('loginMsg', 'Ingresando…');
  try {
    const res = await apiSend('/auth/login', { json: { email: val('liEmail'), password: val('liPassword') } });
    if(res.user.role !== 'admin'){ setMsg('loginMsg', 'Esta cuenta no es de administrador.', 'err'); return; }
    token = res.accessToken;
    enterApp();
  } catch (e) {
    setMsg('loginMsg', e.status === 401 ? 'Email o contraseña incorrectos.' : (e.message || 'No se pudo ingresar.'), 'err');
  }
}

function logout(){
  token = null;
  el('appView').style.display = 'none';
  el('loginView').style.display = 'block';
  el('logoutBtn').style.display = 'none';
  el('liPassword').value = '';
  setMsg('loginMsg', '');
  checkSetup();
}

function enterApp(){
  el('loginView').style.display = 'none';
  el('appView').style.display = 'block';
  el('logoutBtn').style.display = 'inline-block';
  bindMenuView();
  bindLandingView();
  bindReservationsView();
  loadMenu();
  loadCarousel();
  loadShopForm();
  loadTables();
  el('resDate').value = todayISO();
  loadReservations();
}

function onTabClick(e){
  const tab = e.target.closest('.atab');
  if(!tab) return;
  document.querySelectorAll('.atab').forEach(t => t.classList.toggle('active', t === tab));
  document.querySelectorAll('.view').forEach(v => v.classList.toggle('on', v.id === 'view-' + tab.dataset.view));
}

function todayISO(){
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

// ---------- Menú ----------
function bindMenuView(){
  el('miCreateBtn').addEventListener('click', createMenuItem);
  el('menuFilter').addEventListener('change', loadMenu);
  el('menuTable').addEventListener('click', onMenuTableClick);
  el('menuTable').addEventListener('change', onMenuTableChange);
}

async function loadMenu(){
  const category = el('menuFilter').value;
  try {
    ({ data: menuItems } = await apiGet(`/menu${category ? `?category=${encodeURIComponent(category)}` : ''}`, token));
  } catch (e) {
    el('menuTable').innerHTML = `<tbody><tr><td class="empty">${esc(e.message)}</td></tr></tbody>`;
    return;
  }
  if(!menuItems.length){
    el('menuTable').innerHTML = '<tbody><tr><td class="empty">Todavía no hay ítems cargados.</td></tr></tbody>';
    return;
  }
  el('menuTable').innerHTML = `
    <thead><tr><th>Foto</th><th>Ítem</th><th>Categoría</th><th>Col.</th><th>Orden</th><th>Precio</th><th>Disp.</th><th></th></tr></thead>
    <tbody>${menuItems.map(menuRowHTML).join('')}</tbody>`;
}

function menuRowHTML(i){
  const thumb = i.imagePath
    ? `<div class="thumb-sm" style="background-image:url('${encodeURI(i.imagePath)}')" data-pick="${i.id}" title="Cambiar foto"></div>`
    : `<div class="thumb-sm" data-pick="${i.id}" title="Subir foto">📷</div>`;
  const opt = (v, label, sel) => `<option value="${v}"${v === sel ? ' selected' : ''}>${label}</option>`;
  return `<tr class="${i.available ? '' : 'off'}" data-id="${i.id}">
    <td>${thumb}</td>
    <td style="min-width:210px">
      <input data-f="name" value="${esc(i.name)}">
      <input data-f="description" value="${esc(i.description)}" placeholder="Descripción" style="margin-top:5px">
    </td>
    <td><select data-f="category">${['desayuno','brunch','cena'].map(c => opt(c, c[0].toUpperCase()+c.slice(1), i.category)).join('')}</select></td>
    <td><select data-f="side">${opt('left','Izq.',i.side)}${opt('right','Der.',i.side)}</select></td>
    <td style="width:80px"><input data-f="sortOrder" type="number" min="0" value="${i.sortOrder}"></td>
    <td style="width:110px"><input data-f="price" type="number" min="0" step="1" value="${i.price}"></td>
    <td><input data-f="available" type="checkbox" style="width:auto"${i.available ? ' checked' : ''}></td>
    <td class="actions">
      <button class="btn sm" data-act="save" data-id="${i.id}">Guardar</button>
      <button class="btn ghost sm" data-act="del" data-id="${i.id}">Borrar</button>
    </td>
  </tr>`;
}

async function createMenuItem(){
  clearErrors();
  setMsg('menuMsg', 'Guardando…');
  const form = new FormData();
  form.append('category', el('miCategory').value);
  form.append('side', el('miSide').value);
  form.append('name', val('miName'));
  form.append('description', val('miDescription'));
  form.append('price', val('miPrice') || '0');
  form.append('available', 'true');
  if(val('miSort')) form.append('sortOrder', val('miSort'));
  const file = el('miImage').files[0];
  if(file) form.append('image', file);
  try {
    await apiSend('/menu', { token, form });
    setMsg('menuMsg', 'Ítem agregado al menú.', 'ok');
    ['miName','miDescription','miSort'].forEach(id => { el(id).value = ''; });
    el('miPrice').value = '0';
    el('miImage').value = '';
    loadMenu();
  } catch (e) { paintApiErrors(e, 'menuMsg'); }
}

function onMenuTableClick(e){
  const pick = e.target.closest('[data-pick]');
  if(pick) return pickImageFor(pick.dataset.pick);
  const btn = e.target.closest('[data-act]');
  if(!btn) return;
  if(btn.dataset.act === 'save') saveMenuItem(btn.dataset.id);
  if(btn.dataset.act === 'del') deleteMenuItem(btn.dataset.id);
}

// El check de disponibilidad se guarda solo, sin apretar "Guardar".
function onMenuTableChange(e){
  const box = e.target.closest('input[type="checkbox"][data-f="available"]');
  if(!box) return;
  const id = box.closest('tr').dataset.id;
  patchMenuItem(id, { available: box.checked });
}

function rowValues(id){
  const row = el('menuTable').querySelector(`tr[data-id="${id}"]`);
  const get = f => row.querySelector(`[data-f="${f}"]`);
  return {
    name: get('name').value.trim(),
    description: get('description').value.trim(),
    category: get('category').value,
    side: get('side').value,
    sortOrder: get('sortOrder').value,
    price: get('price').value,
    available: get('available').checked,
  };
}

async function saveMenuItem(id){
  clearErrors();
  const v = rowValues(id);
  const form = new FormData();
  Object.entries(v).forEach(([k, value]) => form.append(k, String(value)));
  try {
    await apiSend(`/menu/${id}`, { method: 'PUT', token, form });
    setMsg('menuMsg', 'Cambios guardados.', 'ok');
    loadMenu();
  } catch (e) { paintApiErrors(e, 'menuMsg'); }
}

async function patchMenuItem(id, fields){
  try {
    await apiSend(`/menu/${id}`, { method: 'PATCH', token, json: fields });
    setMsg('menuMsg', 'Cambios guardados.', 'ok');
    loadMenu();
  } catch (e) { paintApiErrors(e, 'menuMsg'); }
}

async function deleteMenuItem(id){
  const item = menuItems.find(i => String(i.id) === String(id));
  if(!confirm(`¿Borrar "${item ? item.name : 'este ítem'}" del menú?`)) return;
  try {
    await apiSend(`/menu/${id}`, { method: 'DELETE', token });
    setMsg('menuMsg', 'Ítem borrado.', 'ok');
    loadMenu();
  } catch (e) { setMsg('menuMsg', e.message, 'err'); }
}

// Selector de archivo reutilizable para cambiar la foto desde la tabla.
function pickImageFor(id){
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.addEventListener('change', async () => {
    const file = input.files[0];
    if(!file) return;
    const form = new FormData();
    form.append('image', file);
    try {
      await apiSend(`/menu/${id}`, { method: 'PATCH', token, form });
      setMsg('menuMsg', 'Foto actualizada.', 'ok');
      loadMenu();
    } catch (e) { setMsg('menuMsg', e.message, 'err'); }
  });
  input.click();
}

// ---------- Landing: carrusel, datos del local y mesas ----------
function bindLandingView(){
  el('liUploadBtn').addEventListener('click', uploadCarouselImage);
  el('carouselAdmin').addEventListener('click', onCarouselClick);
  el('carouselAdmin').addEventListener('change', onCarouselChange);
  el('shSaveBtn').addEventListener('click', saveShop);
  el('tablesAdmin').addEventListener('click', onTableToggle);
}

async function loadCarousel(){
  let images = [];
  try { ({ data: images } = await apiGet('/landing-images')); } catch { images = []; }
  el('carouselAdmin').innerHTML = images.length
    ? images.map(img => `
      <div class="carousel-card" data-id="${img.id}">
        <div class="pic" style="background-image:url('${encodeURI(img.imagePath)}')"></div>
        <div class="meta">
          <input type="number" min="0" value="${img.sortOrder}" data-f="sortOrder" title="Orden">
          <button class="btn ghost sm" data-act="order">Ordenar</button>
          <button class="btn danger sm" data-act="del">Borrar</button>
        </div>
      </div>`).join('')
    : '<p class="empty">Sin fotos todavía: la portada muestra el placeholder.</p>';
}

async function uploadCarouselImage(){
  const file = el('liImage').files[0];
  if(!file){ setMsg('landingMsg', 'Elegí una imagen primero.', 'err'); return; }
  const form = new FormData();
  form.append('image', file);
  form.append('caption', val('liCaption'));
  setMsg('landingMsg', 'Subiendo…');
  try {
    await apiSend('/landing-images', { token, form });
    setMsg('landingMsg', 'Foto agregada al carrusel.', 'ok');
    el('liImage').value = '';
    el('liCaption').value = '';
    loadCarousel();
  } catch (e) { setMsg('landingMsg', e.message, 'err'); }
}

function onCarouselClick(e){
  const btn = e.target.closest('[data-act]');
  if(!btn) return;
  const card = btn.closest('.carousel-card');
  const id = card.dataset.id;
  if(btn.dataset.act === 'del') return deleteCarouselImage(id);
  if(btn.dataset.act === 'order') return reorderCarouselImage(id, card.querySelector('[data-f="sortOrder"]').value);
}
function onCarouselChange(){ /* el orden se aplica con el botón, para no pegarle a la API en cada tecla */ }

async function reorderCarouselImage(id, sortOrder){
  try {
    await apiSend(`/landing-images/${id}`, { method: 'PATCH', token, json: { sortOrder: Number(sortOrder) } });
    setMsg('landingMsg', 'Orden actualizado.', 'ok');
    loadCarousel();
  } catch (e) { setMsg('landingMsg', e.message, 'err'); }
}

async function deleteCarouselImage(id){
  if(!confirm('¿Borrar esta foto del carrusel?')) return;
  try {
    await apiSend(`/landing-images/${id}`, { method: 'DELETE', token });
    setMsg('landingMsg', 'Foto borrada.', 'ok');
    loadCarousel();
  } catch (e) { setMsg('landingMsg', e.message, 'err'); }
}

async function loadShopForm(){
  try {
    const { data: s } = await apiGet('/shop');
    if(!s) return;
    el('shName').value = s.name || '';
    el('shWelcome').value = s.welcomeText || '';
    el('shAddress').value = s.address || '';
    el('shHours').value = s.hours || '';
    el('shPhone').value = s.phone || '';
    el('shEmail').value = s.email || '';
    el('shWhatsapp').value = s.whatsapp || '';
    el('shNotes').value = s.notes || '';
  } catch { /* la landing igual funciona con los datos del seed */ }
}

async function saveShop(){
  setMsg('shopMsg', 'Guardando…');
  try {
    await apiSend('/shop', { method: 'PUT', token, json: {
      name: val('shName'), welcomeText: val('shWelcome'), address: val('shAddress'), hours: val('shHours'),
      phone: val('shPhone'), email: val('shEmail'), whatsapp: val('shWhatsapp'), notes: val('shNotes'),
    } });
    setMsg('shopMsg', 'Datos del local actualizados.', 'ok');
    loadShopChrome();
  } catch (e) { setMsg('shopMsg', e.message, 'err'); }
}

async function loadTables(){
  try { ({ data: tables } = await apiGet('/tables')); } catch { return; }
  el('tablesAdmin').innerHTML = tables.map(t => `
    <div class="tcell${t.available ? '' : ' off'}" data-id="${t.id}">
      <span><strong>${esc(t.code)}</strong><br><span class="muted" style="font-size:.75rem">${esc(t.zone)}</span></span>
      <button data-act="toggle">${t.available ? 'Dar de baja' : 'Habilitar'}</button>
    </div>`).join('');
}

async function onTableToggle(e){
  const btn = e.target.closest('[data-act="toggle"]');
  if(!btn) return;
  const id = Number(btn.closest('.tcell').dataset.id);
  const table = tables.find(t => t.id === id);
  try {
    await apiSend(`/tables/${id}`, { method: 'PATCH', token, json: { available: !table.available } });
    setMsg('tablesMsg', `Mesa ${table.code} ${table.available ? 'dada de baja' : 'habilitada'}.`, 'ok');
    loadTables();
  } catch (e2) { setMsg('tablesMsg', e2.message, 'err'); }
}

// ---------- Reservas ----------
function bindReservationsView(){
  el('resDate').addEventListener('change', loadReservations);
  el('resAllBtn').addEventListener('click', () => { el('resDate').value = ''; loadReservations(); });
  el('resTable').addEventListener('click', onReservationClick);
}

async function loadReservations(){
  const date = val('resDate');
  let list = [];
  try { ({ data: list } = await apiGet(`/reservations${date ? `?date=${encodeURIComponent(date)}` : '?pageSize=100'}`, token)); }
  catch (e) {
    el('resTable').innerHTML = `<tbody><tr><td class="empty">${esc(e.message)}</td></tr></tbody>`;
    return;
  }
  if(!list.length){
    el('resTable').innerHTML = `<tbody><tr><td class="empty">${date ? 'Sin reservas para esa fecha.' : 'Todavía no hay reservas.'}</td></tr></tbody>`;
    return;
  }
  el('resTable').innerHTML = `
    <thead><tr><th>Fecha</th><th>Turno</th><th>Mesa</th><th>Cliente</th><th>WhatsApp</th><th>Estado</th><th></th></tr></thead>
    <tbody>${list.map(reservationRowHTML).join('')}</tbody>`;
}

function reservationRowHTML(r){
  const [y, m, d] = r.date.split('-');
  return `<tr data-id="${r.id}">
    <td>${d}/${m}/${y}</td>
    <td>${esc(r.slot)}</td>
    <td><strong>${esc(r.tableCode)}</strong> <span class="muted">${esc(r.tableZone)}</span></td>
    <td>${esc(r.customerName)}</td>
    <td>${r.customerWhatsapp ? `<a href="https://wa.me/${esc(r.customerWhatsapp)}" target="_blank" rel="noopener">${esc(r.customerWhatsapp)}</a>` : '—'}</td>
    <td><span class="chip ${r.status}">${esc(r.status)}</span></td>
    <td class="actions">
      ${r.status !== 'confirmada' ? `<button class="btn sm" data-status="confirmada" data-id="${r.id}">Confirmar</button>` : ''}
      ${r.status !== 'cancelada' ? `<button class="btn ghost sm" data-status="cancelada" data-id="${r.id}">Cancelar</button>` : ''}
      ${r.status !== 'pendiente' ? `<button class="btn ghost sm" data-status="pendiente" data-id="${r.id}">Pendiente</button>` : ''}
    </td>
  </tr>`;
}

async function onReservationClick(e){
  const btn = e.target.closest('[data-status]');
  if(!btn) return;
  try {
    await apiSend(`/reservations/${btn.dataset.id}/status`, { method: 'PATCH', token, json: { status: btn.dataset.status } });
    setMsg('resMsg', `Reserva #${btn.dataset.id} marcada como ${btn.dataset.status}.`, 'ok');
    loadReservations();
  } catch (err) { setMsg('resMsg', err.message, 'err'); }
}

initAdmin();
