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
      <section class="section">
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
      el.addEventListener('click', () => openLightbox(cat.images[+el.dataset.i])));
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
      <section class="section section-alt">
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

// 点击图片放大查看
function openLightbox(im) {
  let lb = document.getElementById('lightbox');
  if (!lb) {
    lb = document.createElement('div');
    lb.id = 'lightbox';
    lb.innerHTML = '<button class="lb-close" aria-label="Close">×</button>'
      + '<div class="lb-img"></div><p class="lb-cap"></p>';
    document.body.appendChild(lb);
    lb.addEventListener('click', (e) => {
      if (e.target === lb || e.target.classList.contains('lb-close')) lb.classList.remove('open');
    });
  }
  const img = lb.querySelector('.lb-img');
  if (im && im.src) { img.style.backgroundImage = `url('${esc(im.src)}')`; img.textContent = ''; }
  else { img.style.backgroundImage = 'none'; img.textContent = 'No image'; }
  lb.querySelector('.lb-cap').textContent = (im && im.caption) ? im.caption : '';
  lb.classList.add('open');
}

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
fetch('content.json', { cache: 'no-cache' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(c => { applyLogo(c.company && c.company.logo); renderGallery(c.galleries); })
  .catch(() => renderGallery(DEFAULT_GALLERIES));
