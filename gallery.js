/* =========================================================
   二级页面：公司场景图库 (gallery.html)
   读取 content.json 的 galleries 数据，按分类展示大图墙。
   点击单张图片可放大查看（lightbox）。
   本地双击打开时若无 content.json 则用下方内置默认内容。
   ========================================================= */

const DEFAULT_GALLERIES = {
  eyebrow: "Company Life",
  title: "Inside Jiangxin — team, factory & beyond",
  intro: "More than products — meet the people and the place behind every order.",
  categories: [
    { slug: "team-building", title: "Team Building", subtitle: "Our annual outings and activities", cover: "", images: [ { src: "", caption: "Team building day" } ] },
    { slug: "factory", title: "Factory & Production", subtitle: "Workshop, machines and workflow", cover: "", images: [ { src: "", caption: "Production line" } ] },
    { slug: "office", title: "Office & Team", subtitle: "The people behind your orders", cover: "", images: [ { src: "", caption: "Our team" } ] },
    { slug: "certificates", title: "Certificates & Events", subtitle: "Awards, trade fairs and certifications", cover: "", images: [ { src: "", caption: "Certificate / event" } ] }
  ]
};

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// 与首页一致：把「外观 / 配色」主题（页面背景、区块底色、导航栏背景）应用到二级页面
function hexToRgba(hex, a) {
  hex = (hex || '').trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
}
function applyTheme(c) {
  const root = document.documentElement;
  const t = c.theme || {};
  if (t.bgColor) root.style.setProperty('--bg', t.bgColor);
  if (t.bgAlt) root.style.setProperty('--bg-alt', t.bgAlt);
  if (t.headerColor) root.style.setProperty('--header-bg', t.headerColor);
}
// 顶部 Logo / 导航 配色（与首页一致），让二级页导航栏和首页统一
function applyBranding(c) {
  const b = c.branding || {};
  const header = document.querySelector('.header');
  if (header && b.navColor) header.style.setProperty('--nav-color', b.navColor);
  const lt = document.getElementById('logoText');
  if (lt) {
    if (b.logoColor) lt.style.color = b.logoColor;
    if (b.logoFont) lt.style.fontFamily = b.logoFont;
    if (b.logoSize) lt.style.fontSize = b.logoSize + 'px';
  }
  const logo = document.querySelector('.logo');
  if (logo && b.logoBlockColor && Number(b.logoBlockOpacity) > 0) {
    logo.style.background = hexToRgba(b.logoBlockColor, Math.min(100, Math.max(0, Number(b.logoBlockOpacity))) / 100);
    logo.style.padding = '6px 12px';
    logo.style.borderRadius = '10px';
  }
}

// 区块独立文字样式（与首页同一套变量）：本页 <section> 上生效，不影响其他页面
function secStyle(o) {
  o = o || {};
  const v = [];
  if (o.font) v.push(`--font-base:${o.font}`);
  const fs = Number(o.fontSize);
  if (fs && fs !== 100) v.push(`--fs-scale:${Math.min(200, Math.max(50, fs)) / 100}`);
  if (o.headingColor) v.push(`--heading-color:${o.headingColor}`);
  if (o.subColor) v.push(`--s-sub:${o.subColor}`);
  if (o.textColor) v.push(`--muted:${o.textColor}`);
  if (o.cardTitleColor) v.push(`--card-ink:${o.cardTitleColor}`);
  if (o.cardTextColor) v.push(`--card-muted:${o.cardTextColor}`);
  return v.length ? ` style="${v.join(';')}"` : '';
}

function renderGallery(g) {
  const app = document.getElementById('gallery-app');
  if (!g || !g.categories || !g.categories.length) {
    app.innerHTML = '<div class="container" style="padding:80px 22px;text-align:center;">'
      + '<h2>No albums yet</h2><p class="lead">Add categories in the CMS backend, then they will appear here.</p>'
      + '<a class="btn btn-primary" href="index.html">Back to home</a></div>';
    return;
  }

  const params = new URLSearchParams(location.search);
  const catSlug = params.get('cat');
  const cat = catSlug ? g.categories.find(c => c.slug === catSlug) : null;

  const secAtts = secStyle(g.style);
  if (cat) {
    // 单个相册：大图墙
    const imgs = (cat.images && cat.images.length) ? cat.images : [];
    const grid = imgs.length
      ? imgs.map((im, i) => {
          const ph = im.src ? "" : ` ph-${(i % 6) + 1}`;
          const style = im.src ? `style="background-image:url('${esc(im.src)}');background-size:cover;background-position:center;"` : "";
          return `<figure class="g-item" data-i="${i}"><div class="g-thumb${ph}" ${style}></div>`
            + `<figcaption>${esc(im.caption || '')}</figcaption></figure>`;
        }).join("")
      : '<p class="lead">No photos in this album yet. Add some in the CMS backend.</p>';
    app.innerHTML = `
      <section class="section"${secAtts}>
        <div class="container">
          <a class="back-link" href="gallery.html">← All albums</a>
          <div class="section-head" style="text-align:left;margin:18px 0 30px;">
            <p class="eyebrow">${esc(g.eyebrow)}</p>
            <h2>${esc(cat.title)}</h2>
            <p class="lead">${esc(cat.subtitle)}</p>
          </div>
          <div class="g-grid">${grid}</div>
        </div>
      </section>`;
    app.querySelectorAll('.g-item').forEach(el =>
      el.addEventListener('click', () => openLightbox(cat.images.filter(i => i && i.src), +el.dataset.i)));
  } else {
    // 概览：所有相册卡片，点击进入
    const cards = g.categories.map((c, i) => {
      const ph = c.cover ? "" : ` ph-${(i % 6) + 1}`;
      const style = c.cover ? `style="background-image:url('${esc(c.cover)}');background-size:cover;background-position:center;"` : "";
      return `<a class="life-card" href="gallery.html?cat=${encodeURIComponent(c.slug)}">`
        + `<div class="life-cover${ph}" ${style}></div>`
        + `<div class="life-meta"><h3>${esc(c.title)}</h3><p>${esc(c.subtitle)}</p>`
        + `<span class="life-cta">View gallery →</span></div></a>`;
    }).join("");
    app.innerHTML = `
      <section class="section section-alt"${secAtts}>
        <div class="container">
          <div class="section-head">
            <p class="eyebrow">${esc(g.eyebrow)}</p>
            <h2>${esc(g.title)}</h2>
            <p class="lead">${esc(g.intro)}</p>
          </div>
          <div class="life-cards">${cards}</div>
        </div>
      </section>`;
  }
  bindReveal();
}

// 产品相册二级页：gallery.html?product=序号 → 渲染该产品的图片墙（复用相册样式与放大查看）
function renderProductAlbum(c, idx) {
  const app = document.getElementById('gallery-app');
  const p = c.products.items[idx];
  const imgs = (p.photos || []).filter(im => im && im.src);
  document.title = p.title + ' | ' + (c.company ? c.company.short || 'Qingdao Jiangxin Packaging' : 'Qingdao Jiangxin Packaging');
  const grid = imgs.map((im, i) => {
    const ph = im.src ? "" : ` ph-${(i % 6) + 1}`;
    const style = im.src ? `style="background-image:url('${esc(im.src)}');background-size:cover;background-position:center;"` : "";
    return `<figure class="g-item" data-i="${i}"><div class="g-thumb${ph}" ${style}></div>`
      + `<figcaption>${esc(im.caption || '')}</figcaption></figure>`;
  }).join("");
  app.innerHTML = `
    <section class="section"${secStyle(c.products.style)}>
      <div class="container">
        <a class="back-link" href="index.html#products">← Back to Products</a>
        <div class="section-head" style="text-align:left;margin:18px 0 30px;">
          <p class="eyebrow">${esc(c.products.eyebrow)}</p>
          <h2>${esc(p.title)}</h2>
          <p class="lead">${esc(p.description)}</p>
        </div>
        <div class="g-grid">${grid}</div>
      </div>
    </section>`;
  app.querySelectorAll('.g-item').forEach(el =>
    el.addEventListener('click', () => openLightbox(imgs, +el.dataset.i)));
  bindReveal();
}

// 点击图片放大查看（支持同相册左右切换）
let lbList = [], lbIdx = 0;
function openLightbox(list, idx) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Close">×</button>'
      + '<div class="lb-img"></div><p class="lb-cap"></p>'
      + '<button class="lb-prev" aria-label="上一张">‹</button>'
      + '<button class="lb-next" aria-label="下一张">›</button>'
      + '<div class="lb-count"></div>';
    document.body.appendChild(lb);
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb-close')) lb.classList.remove('open');
    });
    lb.querySelector('.lb-prev').addEventListener('click', (e) => { e.stopPropagation(); lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; showLb(); });
    lb.querySelector('.lb-next').addEventListener('click', (e) => { e.stopPropagation(); lbIdx = (lbIdx + 1) % lbList.length; showLb(); });
  }
  lbList = (Array.isArray(list) ? list : [list]).map(im => ({ url: im && im.src, cap: im && im.caption }));
  lbIdx = idx || 0;
  showLb();
  lb.classList.add('open');
}
function showLb() {
  const it = lbList[lbIdx]; if (!it) return;
  const box = document.querySelector('#lightbox .lb-img');
  if (it.url) { box.style.backgroundImage = `url('${esc(it.url)}')`; box.textContent = ''; }
  else { box.style.backgroundImage = 'none'; box.textContent = 'No image'; }
  document.querySelector('#lightbox .lb-cap').textContent = it.cap || '';
  document.querySelector('#lightbox .lb-count').textContent = lbList.length > 1 ? `${lbIdx + 1} / ${lbList.length}` : '';
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { const lb = document.getElementById('lightbox'); if (lb) lb.classList.remove('open'); }
});

// 滚动入场动画
function bindReveal() {
  const els = document.querySelectorAll('.section, .life-card, .g-item, .step');
  els.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  els.forEach(el => io.observe(el));
}

// 移动端菜单
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle) navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
if (navLinks) navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// 年份
const y = document.getElementById('year');
if (y) y.textContent = new Date().getFullYear();

// Logo 图片（后台可上传，留空显示默认 JX）
// 尺寸由 styles.css 中 .logo-mark.has-img 控制，固定为原 JX 方块大小
function applyLogo(logo) {
  if (!logo) return;
  document.querySelectorAll('.logo-mark').forEach(el => {
    el.classList.add('has-img');
    el.innerHTML = '<img src="' + esc(logo) + '" alt="logo" />';
  });
}

// 加载数据：优先 content.json，失败用内置默认
// 带 ?product=序号 参数时进入产品相册二级页，否则按公司场景图库渲染
fetch('content.json', { cache: 'no-cache' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(c => {
    applyLogo(c.company && c.company.logo);
    applyTheme(c);       // 二级页背景色跟随「外观 / 配色」
    applyBranding(c);    // 二级页导航栏 / Logo 配色与首页统一
    const pParam = new URLSearchParams(location.search).get('product');
    if (pParam != null && c.products && c.products.items && c.products.items[+pParam]) {
      renderProductAlbum(c, +pParam);
    } else {
      renderGallery(c.galleries);
    }
    setupMusic(c);
  })
  .catch(() => renderGallery(DEFAULT_GALLERIES));

// 背景音乐：后台填了音频路径才会出现；右下角按钮可随时开关
function setupMusic(c) {
  const src = c.music;
  if (!src) return;
  if (document.getElementById('bgm')) return;

  const audio = document.createElement('audio');
  audio.id = 'bgm';
  audio.src = esc(src);
  audio.loop = true;
  audio.preload = 'auto';
  audio.volume = 0.4;
  document.body.appendChild(audio);

  const btn = document.createElement('button');
  btn.id = 'musicToggle';
  btn.type = 'button';
  btn.className = 'music-toggle';
  btn.setAttribute('aria-label', '背景音乐 开/关');
  btn.innerHTML = '<span class="mt-ico">♪</span><span class="mt-off">✕</span>';
  document.body.appendChild(btn);

  btn.addEventListener('click', () => {
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  });
  audio.addEventListener('play', () => btn.classList.add('on'));
  audio.addEventListener('pause', () => btn.classList.remove('on'));

  const tryAuto = () => audio.play().catch(() => {});
  window.addEventListener('pointerdown', tryAuto, { once: true });
  window.addEventListener('keydown', tryAuto, { once: true });
}
