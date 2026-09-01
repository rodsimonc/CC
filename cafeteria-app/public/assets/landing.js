// Landing: carrusel de fotos del local (rota cada 15 s) + texto de bienvenida editable.
const ROTATE_MS = 15000;
let slides = [];
let current = 0;
let timer = null;

async function initLanding(){
  const shop = await loadShopChrome();
  const mail2 = el('mailBtn2');
  if(mail2){
    if(shop && shop.email) mail2.href = `mailto:${shop.email}`;
    else mail2.style.display = 'none';
  }
  setText('welcomeText', shop ? shop.welcomeText : '');
  await loadCarousel();
}

async function loadCarousel(){
  let images = [];
  try { ({ data: images } = await apiGet('/landing-images')); } catch { images = []; }
  const box = el('carousel');
  const ph = el('carouselPh');
  if(!images.length){ ph.style.display = 'flex'; return; }  // placeholder neutro
  ph.style.display = 'none';

  box.insertAdjacentHTML('beforeend', images.map((img, i) => `
    <div class="slide${i === 0 ? ' on' : ''}" style="background-image:url('${encodeURI(img.imagePath)}')"
         role="img" aria-label="${esc(img.caption || 'Foto de la cafetería')}"></div>`).join(''));
  if(images.some(i => i.caption)) box.insertAdjacentHTML('beforeend', '<div class="caption" id="carouselCaption"></div>');
  if(images.length > 1){
    box.insertAdjacentHTML('beforeend',
      `<div class="dots" id="carouselDots">${images.map((_, i) => `<span class="${i === 0 ? 'on' : ''}"></span>`).join('')}</div>`);
  }

  slides = images;
  current = 0;
  paint();
  if(images.length > 1) timer = setInterval(next, ROTATE_MS);
}

function next(){
  current = (current + 1) % slides.length;
  paint();
}

function paint(){
  document.querySelectorAll('#carousel .slide').forEach((s, i) => s.classList.toggle('on', i === current));
  const dots = el('carouselDots');
  if(dots) [...dots.children].forEach((d, i) => d.classList.toggle('on', i === current));
  const cap = el('carouselCaption');
  if(cap) cap.textContent = slides[current].caption || '';
}

// Si la pestaña queda en segundo plano, no gastamos ciclos rotando.
document.addEventListener('visibilitychange', () => {
  if(document.hidden){ clearInterval(timer); timer = null; }
  else if(!timer && slides.length > 1){ timer = setInterval(next, ROTATE_MS); }
});

initLanding();
