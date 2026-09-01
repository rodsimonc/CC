// Helpers compartidos por todas las páginas del front.
const API = '/api/v1';

// Escapa antes de meter texto en innerHTML.
function esc(s){ return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function money(n){ return '$' + Number(n || 0).toLocaleString('es-AR'); }
function el(id){ return document.getElementById(id); }
function val(id){ const e = el(id); return e ? e.value.trim() : ''; }
function setText(id, text){ const e = el(id); if(e) e.textContent = text || ''; }
function showErr(field, message){ const e = document.querySelector(`.field-err[data-for="${field}"]`); if(e) e.textContent = message; }
function clearErrors(){ document.querySelectorAll('.field-err').forEach(e => { e.textContent = ''; }); }
function setMsg(id, text, kind){ const e = el(id); if(!e) return; e.className = 'msg' + (kind ? ' ' + kind : ''); e.textContent = text || ''; }

// Lectura de la API con manejo uniforme de Problem Details (RFC 7807).
async function apiGet(path, token){
  const res = await fetch(`${API}${path}`, { headers: token ? { Authorization: 'Bearer ' + token } : {} });
  const body = await res.json().catch(() => ({}));
  if(!res.ok) throw Object.assign(new Error(body.detail || 'Error de la API'), { status: res.status, body });
  return body;
}
async function apiSend(path, { method = 'POST', token, json, form } = {}){
  const headers = {};
  if(token) headers.Authorization = 'Bearer ' + token;
  if(json) headers['Content-Type'] = 'application/json';
  const res = await fetch(`${API}${path}`, { method, headers, body: form || (json ? JSON.stringify(json) : undefined) });
  if(res.status === 204) return {};
  const body = await res.json().catch(() => ({}));
  if(!res.ok) throw Object.assign(new Error(body.detail || 'Error de la API'), { status: res.status, body });
  return body;
}

// Pinta los errores de campo que devuelve un 422 y avisa el motivo general.
function paintApiErrors(err, msgId){
  const errors = err.body && Array.isArray(err.body.errors) ? err.body.errors : [];
  errors.forEach(fe => showErr(fe.field, fe.message));
  setMsg(msgId, errors.length ? 'Revisá los campos marcados.' : (err.message || 'No se pudo completar.'), 'err');
}

// Datos del local: cabecera, contacto y pie, iguales en todas las páginas públicas.
async function loadShopChrome(){
  let shop = null;
  try { ({ data: shop } = await apiGet('/shop')); } catch { return null; }
  if(!shop) return null;
  document.querySelectorAll('[data-shop-name]').forEach(e => { e.textContent = shop.name || 'Cafetería'; });
  setText('shopAddress', shop.address);
  setText('shopHours', shop.hours);
  setText('shopNotes', shop.notes);
  setText('shopPhone', shop.phone);
  const wpp = el('wppBtn');
  if(wpp){
    if(shop.whatsapp) wpp.href = `https://wa.me/${shop.whatsapp}?text=${encodeURIComponent('¡Hola! Quería consultar por una reserva.')}`;
    else wpp.style.display = 'none';
  }
  const mail = el('mailBtn');
  if(mail){
    if(shop.email) mail.href = `mailto:${shop.email}`;
    else mail.style.display = 'none';
  }
  return shop;
}

// Marca el link de la página actual en la navegación.
function markActiveNav(){
  const here = location.pathname.replace(/\/$/, '') || '/index.html';
  document.querySelectorAll('nav.links a').forEach(a => {
    const target = a.getAttribute('href').replace(/\/$/, '') || '/index.html';
    if(target === here || (here === '/index.html' && target === '/')) a.classList.add('active');
  });
}
document.addEventListener('DOMContentLoaded', markActiveNav);
