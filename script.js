/* =========================================================
   青岛江鑫包装 — 内容渲染 + 交互
   内容来源：优先读取 content.json（CMS 修改后的版本），
   读取失败（如本地双击打开）则使用下方内置默认内容。
   ========================================================= */

// 内置默认内容（与 content.json 一致，仅作离线兜底）
const DEFAULT_CONTENT = {
  company: { name: "Qingdao Jiangxin Packaging Products Co., Ltd.", short: "Qingdao Jiangxin Packaging", logo: "" },
  hero: {
    eyebrow: "Custom Packaging Manufacturer · Qingdao, China",
    title1: "Your Trusted Partner for",
    titleAccent: "Premium Packaging",
    lead: "From corrugated boxes to luxury gift packaging, we help global brands protect, present and ship their products — factory-direct from one of China's leading packaging hubs.",
    cta1: "Explore Products", cta2: "Get a Quote",
    trust: ["ISO 9001", "FSC® Available", "Export to 30+ Countries"]
  },
  about: {
    eyebrow: "About Us", title: "Decades of packaging expertise, built for export",
    paragraphs: [
      "Qingdao Jiangxin Packaging Products Co., Ltd. is a professional packaging manufacturer based in Qingdao, Shandong — a major port city that makes worldwide shipping fast and cost-effective.",
      "We specialize in custom paper-based packaging: corrugated boxes, mailer cartons, color boxes, gift boxes and sustainable packaging. With integrated production from design to delivery, we serve retailers, e-commerce brands and distributors across Europe, North America, Australia and beyond."
    ],
    checklist: [
      "Factory-direct pricing with no middlemen",
      "Flexible OEM & ODM, low MOQ options",
      "Strict QC and on-time export delivery",
      "Eco-friendly materials and recyclable solutions"
    ],
    stats: [
      { value: 15, suffix: "+", label: "Years Experience" },
      { value: 30, suffix: "+", label: "Export Countries" },
      { value: 20000, suffix: "m²", label: "Factory Area" },
      { value: 500, suffix: "+", label: "Customers Served" }
    ],
    image: ""
  },
  products: {
    eyebrow: "Our Products", title: "Packaging solutions for every need",
    items: [
      { title: "Corrugated Boxes", description: "Single & double-wall shipping boxes in any size — strong, lightweight and export-ready.", image: "" },
      { title: "Mailer & Carton Boxes", description: "Self-locking mailer boxes and retail cartons with clean, print-friendly surfaces.", image: "" },
      { title: "Custom Printed Packaging", description: "CMYK & Pantone printing, embossing, foil and lamination to match your brand.", image: "" },
      { title: "Gift & Luxury Boxes", description: "Magnetic, drawer and rigid boxes for premium gifting and high-end retail.", image: "" },
      { title: "Eco-Friendly Packaging", description: "Recycled kraft, FSC®-certified and biodegradable options for sustainable brands.", image: "" },
      { title: "OEM & Export Service", description: "Full support from sampling to sea freight, with documentation for global trade.", image: "" }
    ]
  },
  why: {
    eyebrow: "Why Choose Us", title: "What makes Jiangxin different",
    items: [
      { num: "01", title: "Port Advantage", description: "Qingdao port access means lower logistics cost and faster global delivery." },
      { num: "02", title: "One-Stop Production", description: "Design, printing, die-cutting and packing under one roof for consistent quality." },
      { num: "03", title: "Custom Flexibility", description: "Small or large runs, fully tailored specs, materials and finishing." },
      { num: "04", title: "Quality Assurance", description: "Incoming material checks, in-line QC and pre-shipment inspection." }
    ]
  },
  contact: {
    eyebrow: "Contact Us", title: "Let's build your packaging together",
    lead: "Send us your requirements — size, material, quantity and artwork — and we'll reply with a quote within 24 hours.",
    email: "sales@jiangxinpack.com", phone: "+86 532 8888 8888", address: "Qingdao, Shandong Province, China"
  },
  process: {
    eyebrow: "How We Work",
    title: "From inquiry to delivery in 6 steps",
    steps: [
      { num: "01", title: "Consultation", desc: "Tell us your size, material, quantity and artwork. We reply within 24 hours." },
      { num: "02", title: "Design & Quote", desc: "We provide dieline, 3D mockup and a competitive factory-direct quote." },
      { num: "03", title: "Sampling", desc: "Physical samples are made and approved before mass production starts." },
      { num: "04", title: "Production", desc: "Printing, die-cutting, gluing and assembly on our in-house production lines." },
      { num: "05", title: "Quality Check", desc: "In-line QC and pre-shipment inspection ensure every carton meets spec." },
      { num: "06", title: "Shipping", desc: "Qingdao port consolidation and reliable global freight to your door." }
    ]
  },
  galleries: {
    eyebrow: "Company Life",
    title: "Inside Jiangxin — team, factory & beyond",
    intro: "More than products — meet the people and the place behind every order.",
    categories: [
      { slug: "team-building", title: "Team Building", subtitle: "Our annual outings and activities", cover: "", images: [ { src: "", caption: "Team building day" } ] },
      { slug: "factory", title: "Factory & Production", subtitle: "Workshop, machines and workflow", cover: "", images: [ { src: "", caption: "Production line" } ] },
      { slug: "office", title: "Office & Team", subtitle: "The people behind your orders", cover: "", images: [ { src: "", caption: "Our team" } ] },
      { slug: "certificates", title: "Certificates & Events", subtitle: "Awards, trade fairs and certifications", cover: "", images: [ { src: "", caption: "Certificate / event" } ] }
    ]
  }
};

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;");

function productImageStyle(img, i) {
  if (img) return `background-image:url('${esc(img)}');background-size:cover;background-position:center;`;
  return ""; // 无图时回退到 CSS 渐变占位（ph 类）
}

function render(c) {
  const app = document.getElementById('app');

  // 顶部/底部公司名
  document.getElementById('logoText').textContent = c.company.short;
  document.getElementById('footerName').textContent = c.company.name;

  // Logo 图片（后台可上传，留空显示默认 JX 方块）
  // 尺寸由 styles.css 中 .logo-mark.has-img 控制，固定为原 JX 方块大小
  if (c.company.logo) {
    document.querySelectorAll('.logo-mark').forEach(el => {
      el.classList.add('has-img');
      el.innerHTML = `<img src="${esc(c.company.logo)}" alt="logo" />`;
    });
  }

  // Hero
  const trust = c.hero.trust.map(t => `<span>${esc(t)}</span>`).join('<span>·</span>');

  // 背景层：视频优先 → 图片 → 都没填则保留淡绿色渐变
  const heroBg = c.hero.bgVideo
    ? `<video class="hero-bg-media" autoplay muted loop playsinline><source src="${esc(c.hero.bgVideo)}" type="video/mp4"></video>`
    : c.hero.bgImage
      ? `<img class="hero-bg-media" src="${esc(c.hero.bgImage)}" alt="" />`
      : '';

  // 右侧多图：每张可单独设置位置/尺寸/旋转角度
  const heroFloats = (c.hero.images || [])
    .filter(im => im && im.src)
    .map(im => `
        <img class="hero-float" src="${esc(im.src)}" alt=""
             style="left:${im.x != null ? im.x : 50}%;top:${im.y != null ? im.y : 50}%;width:${im.width != null ? im.width : 300}px;transform:rotate(${(im.rotate != null ? im.rotate : 0)}deg)" />`)
    .join('');

  const boxFallback = `<div class="box-illustration">
      <div class="box-top"></div>
      <div class="box-body"><span>JIANGXIN</span><small>Packaging</small></div>
    </div>`;

  let html = `
  <section class="hero" id="home">
    <div class="hero-bg" aria-hidden="true">${heroBg}</div>
    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">${esc(c.hero.eyebrow)}</p>
        <h1>${esc(c.hero.title1)}<br /><span class="accent">${esc(c.hero.titleAccent)}</span></h1>
        <p class="lead">${esc(c.hero.lead)}</p>
        <div class="hero-actions">
          <a href="#products" class="btn btn-primary">${esc(c.hero.cta1)}</a>
          <a href="#contact" class="btn btn-ghost">${esc(c.hero.cta2)}</a>
        </div>
        <div class="trust">${trust}</div>
      </div>
      <div class="hero-art">
        ${heroFloats || boxFallback}
      </div>
    </div>
  </section>`;

  // About
  const paras = c.about.paragraphs.map(p => `<p>${esc(p)}</p>`).join("");
  const checks = c.about.checklist.map(li => `<li>${esc(li)}</li>`).join("");
  const stats = c.about.stats.map(s => `
    <div class="stat">
      <span class="num" data-target="${esc(s.value)}">0</span><span class="suffix">${esc(s.suffix)}</span>
      <p>${esc(s.label)}</p>
    </div>`).join("");
  const aboutImg = c.about.image
    ? `<img src="${esc(c.about.image)}" alt="Our factory" style="width:100%;border-radius:14px;margin-top:18px;" />`
    : "";
  html += `
  <section class="section" id="about">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">${esc(c.about.eyebrow)}</p>
        <h2>${esc(c.about.title)}</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">
          ${paras}
          <ul class="checklist">${checks}</ul>
          ${aboutImg}
        </div>
        <div class="stats">${stats}</div>
      </div>
    </div>
  </section>`;

  // Process
  if (c.process && c.process.steps && c.process.steps.length) {
    const steps = c.process.steps.map(s => `
      <div class="step">
        <span class="step-num">${esc(s.num)}</span>
        <div class="step-body">
          <h3>${esc(s.title)}</h3>
          <p>${esc(s.desc)}</p>
        </div>
      </div>`).join("");
    html += `
  <section class="section" id="process">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">${esc(c.process.eyebrow)}</p>
        <h2>${esc(c.process.title)}</h2>
      </div>
      <div class="process-steps">${steps}</div>
    </div>
  </section>`;
  }

  // Products
  const cards = c.products.items.map((it, i) => {
    const ph = it.image ? "" : ` ph-${(i % 6) + 1}`;
    const style = it.image ? productImageStyle(it.image) : "";
    return `
    <article class="card">
      <div class="card-img${ph}" style="${style}"></div>
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.description)}</p>
    </article>`;
  }).join("");
  html += `
  <section class="section section-alt" id="products">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">${esc(c.products.eyebrow)}</p>
        <h2>${esc(c.products.title)}</h2>
      </div>
      <div class="cards">${cards}</div>
    </div>
  </section>`;

  // Why Us
  const whys = c.why.items.map(it => `
    <div class="why-item">
      <span class="why-num">${esc(it.num)}</span>
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.description)}</p>
    </div>`).join("");
  html += `
  <section class="section" id="why">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">${esc(c.why.eyebrow)}</p>
        <h2>${esc(c.why.title)}</h2>
      </div>
      <div class="why-grid">${whys}</div>
    </div>
  </section>`;

  // Company Life (links to gallery.html)
  if (c.galleries && c.galleries.categories && c.galleries.categories.length) {
    const g = c.galleries;
    const lifeCards = g.categories.map((cat, i) => {
      const ph = cat.cover ? "" : ` ph-${(i % 6) + 1}`;
      const style = cat.cover ? `background-image:url('${esc(cat.cover)}');background-size:cover;background-position:center;` : "";
      return `
      <a class="life-card" href="gallery.html?cat=${encodeURIComponent(cat.slug)}">
        <div class="life-cover${ph}" style="${style}"></div>
        <div class="life-meta">
          <h3>${esc(cat.title)}</h3>
          <p>${esc(cat.subtitle)}</p>
          <span class="life-cta">View gallery →</span>
        </div>
      </a>`;
    }).join("");
    html += `
  <section class="section section-alt" id="life">
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">${esc(g.eyebrow)}</p>
        <h2>${esc(g.title)}</h2>
        <p class="lead">${esc(g.intro)}</p>
      </div>
      <div class="life-cards">${lifeCards}</div>
    </div>
  </section>`;
  }

  // Contact
  html += `
  <section class="section section-contact" id="contact">
    <div class="container contact-grid">
      <div class="contact-info">
        <p class="eyebrow">${esc(c.contact.eyebrow)}</p>
        <h2>${esc(c.contact.title)}</h2>
        <p class="lead">${esc(c.contact.lead)}</p>
        <ul class="contact-list">
          <li><span class="ci-label">Email</span><a href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a></li>
          <li><span class="ci-label">Phone / WhatsApp</span><a href="tel:${esc(c.contact.phone)}">${esc(c.contact.phone)}</a></li>
          <li><span class="ci-label">Address</span><span>${esc(c.contact.address)}</span></li>
        </ul>
      </div>
      <form class="contact-form" id="contactForm" action="https://formspree.io/f/your-form-id" method="POST">
        <div class="field"><label for="name">Name *</label><input type="text" id="name" name="name" required /></div>
        <div class="field"><label for="email">Email *</label><input type="email" id="email" name="email" required /></div>
        <div class="field"><label for="company">Company</label><input type="text" id="company" name="company" /></div>
        <div class="field"><label for="message">Message *</label><textarea id="message" name="message" rows="4" required placeholder="Tell us about your packaging needs (size, material, quantity)…"></textarea></div>
        <button type="submit" class="btn btn-primary btn-block">Send Inquiry</button>
        <p class="form-note" id="formNote" hidden>Thanks! Your message has been recorded. We'll reply shortly.</p>
      </form>
    </div>
  </section>`;

  app.innerHTML = html;
  afterRender();
}

// 渲染后初始化交互
function afterRender() {
  // 年份
  document.getElementById('year').textContent = new Date().getFullYear();

  // 滚动入场动画
  const revealEls = document.querySelectorAll('.section, .card, .why-item, .stat, .step, .life-card');
  revealEls.forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => io.observe(el));

  // 数字滚动
  const nums = document.querySelectorAll('.num');
  const numIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      const dur = 1400, start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor((1 - Math.pow(1 - p, 3)) * target).toLocaleString();
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      numIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  nums.forEach(n => numIO.observe(n));

  // 表单（演示）
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  form.addEventListener('submit', (e) => {
    if (form.action.includes('your-form-id')) {
      e.preventDefault();
      note.hidden = false;
      form.reset();
    }
  });
}

// 移动端菜单
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// 加载内容：优先 content.json，失败用内置默认
fetch('content.json', { cache: 'no-cache' })
  .then(r => r.ok ? r.json() : Promise.reject())
  .then(render)
  .catch(() => render(DEFAULT_CONTENT));
