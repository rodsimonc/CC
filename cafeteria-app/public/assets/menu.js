// Menú público: tres categorías fijas, cada una en dos columnas como una carta física.
const TITLES = { desayuno: 'Desayuno', brunch: 'Brunch', cena: 'Cena' };
let category = 'desayuno';

async function initMenu(){
  await loadShopChrome();
  el('tabs').addEventListener('click', (e) => {
    const tab = e.target.closest('.tab');
    if(!tab) return;
    category = tab.dataset.cat;
    document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', t === tab));
    loadCategory();
  });
  await loadCategory();
}

async function loadCategory(){
  setText('sheetTitle', TITLES[category] || '');
  el('colLeft').innerHTML = '<p class="col-empty">Cargando…</p>';
  el('colRight').innerHTML = '';
  let items = [];
  try { ({ data: items } = await apiGet(`/menu?category=${encodeURIComponent(category)}`)); }
  catch {
    el('colLeft').innerHTML = '<p class="col-empty">No se pudo cargar el menú.</p>';
    return;
  }
  renderColumn('colLeft', items.filter(i => i.side === 'left'));
  renderColumn('colRight', items.filter(i => i.side === 'right'));
  if(!items.length) el('colLeft').innerHTML = '<p class="col-empty">Todavía no hay platos cargados en esta sección.</p>';
}

function renderColumn(id, items){
  el(id).innerHTML = items.length ? items.map(itemHTML).join('') : '<p class="col-empty">—</p>';
}

// Sin foto cargada se muestra el placeholder; la carga la hace el dueño desde el panel.
function itemHTML(i){
  const thumb = i.imagePath
    ? `<div class="thumb" style="background-image:url('${encodeURI(i.imagePath)}')"></div>`
    : '<div class="thumb">🍽️</div>';
  return `<article class="item">
    ${thumb}
    <div class="body">
      <div class="head">
        <span class="name">${esc(i.name)}</span>
        <span class="dots"></span>
        <span class="price">${money(i.price)}</span>
      </div>
      ${i.description ? `<div class="desc">${esc(i.description)}</div>` : ''}
    </div>
  </article>`;
}

initMenu();
