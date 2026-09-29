/* =========================================================
   青岛江鑫包装 — 内容渲染 + 交互
   内容来源：优先读取 content.json（CMS 修改后的版本），
   读取失败（如本地双击打开）则使用下方内置默认内容。
   ========================================================= */

// 内置默认内容（与 content.json 一致，仅作离线兜底）
const DEFAULT_CONTENT = {
  company: { name: "Qingdao Jiangxin Packaging Products Co., Ltd.", short: "Qingdao Jiangxin Packaging", logo: "" },
  branding: { logoColor: "", logoFont: "", logoSize: 16, logoBlockColor: "", logoBlockOpacity: 0, navColor: "" },
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
    font: "", headingColor: "", subColor: "",
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
    style: { font: "", fontSize: 100, headingColor: "", subColor: "", textColor: "", cardTitleColor: "", cardTextColor: "", panelColor: "", panelOpacity: 0 },
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
    style: { font: "", fontSize: 100, headingColor: "", subColor: "", textColor: "", panelColor: "", panelOpacity: 0 },
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
    email: "sales@jiangxinpack.com", phone: "+86 532 8888 8888", address: "Qingdao, Shandong Province, China",
    style: { font: "", fontSize: 100, headingColor: "", subColor: "", textColor: "", cardTitleColor: "", cardTextColor: "", panelColor: "", panelOpacity: 0 }
  },
  process: {
    eyebrow: "How We Work",
    title: "From inquiry to delivery in 6 steps",
    style: { font: "", fontSize: 100, headingColor: "", subColor: "", textColor: "", cardTitleColor: "", cardTextColor: "", panelColor: "", panelOpacity: 0 },
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
    style: { font: "", fontSize: 100, headingColor: "", subColor: "", textColor: "", cardTitleColor: "", cardTextColor: "", panelColor: "", panelOpacity: 0 },
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

// 区块独立文字样式：把该区块的字体/字号/颜色变量写到 <section> 上，
// 区块内所有用这些变量的文字自动跟随，其他区块不受影响（CSS 变量继承特性）
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

// 区块文字底色块：仅当设置了底色且不透明度>0 才注入（垫在该区块 .container 内容后面）
function secPanel(o) {
  o = o || {};
  const op = parseFloat(o.panelOpacity);
  if (o.panelColor && op > 0) {
    return `<div class="sec-panel" style="background:${esc(o.panelColor)};opacity:${Math.min(100, op) / 100}"></div>`;
  }
  return '';
}

// 把 #RRGGBB + 不透明度% 转成 rgba()，用于 Logo 底色块（rgba 才能让文字保持清晰）
function hexToRgba(hex, a) {
  hex = (hex || '').trim();
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return hex;
  let h = hex.slice(1);
  if (h.length === 3) h = h.split('').map(x => x + x).join('');
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r},${g},${b},${a})`;
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

  // 遮罩强度：0-100 后台可调（0=背景最清晰，100=遮罩最重文字最清楚），仅在有背景时渲染
  const maskOpacity = Math.min(100, Math.max(0, c.hero.bgMask != null ? Number(c.hero.bgMask) : 80)) / 100;
  const heroMask = heroBg ? `<div class="hero-bg-mask" style="opacity:${maskOpacity}"></div>` : '';

  // 文字底色块：在标题文字区域后面垫一块可调颜色/透明度的色板，背景视频再花哨也不影响文字清晰
  const panelOpacity = Math.min(100, Math.max(0, c.hero.panelOpacity != null ? Number(c.hero.panelOpacity) : 0));
  const heroPanel = panelOpacity > 0 && c.hero.panelColor
    ? `<div class="hero-panel" style="background:${esc(c.hero.panelColor)};opacity:${panelOpacity / 100}"></div>`
    : '';

  // 全屏自由图层：每张图可单独设置位置/尺寸/旋转角度（坐标相对整个首屏区域）
  // 宽度按百分比存（所见即所得，任何屏幕比例一致）；旧数据的 px 值（>50）自动按 1440px 基准换算成 %
  // z-index 从 3 起（背景=0，文字=2），每张图可盖在文字上方，层级与可视化编辑器一致
  const toPct = w => {
    const n = Number(w);
    if (w == null || isNaN(n)) return 20;
    return n <= 50 ? n : Math.round(n / 1440 * 100 * 10) / 10;
  };
  // 轮播模式：开启后多张图不再同时显示，而是逐张淡入淡出循环播放（每张保留各自位置/大小/旋转）
  const slideImgs = (c.hero.images || []).filter(im => im && im.src);
  const slideshowOn = !!c.hero.slideshow && slideImgs.length > 1;
  const slideSec = Math.min(15, Math.max(1, c.hero.slideSeconds != null ? Number(c.hero.slideSeconds) : 3));

  const heroFloats = slideImgs
    .map((im, i) => `
        <img class="hero-float${slideshowOn && i === 0 ? ' is-active' : ''}" src="${esc(im.src)}" alt=""
             style="z-index:${3 + i};left:${im.x != null ? im.x : 50}%;top:${im.y != null ? im.y : 50}%;width:${toPct(im.width)}%;transform:rotate(${(im.rotate != null ? im.rotate : 0)}deg)" />`)
    .join('');

  // 文字样式：整体位移、标题/正文颜色、字号缩放、字体（全部后台可调，留空/默认即原样）
  const fs = Math.min(140, Math.max(70, c.hero.fontSize != null ? Number(c.hero.fontSize) : 100)) / 100;
  const ff = c.hero.fontFamily ? `font-family:${c.hero.fontFamily};` : '';
  const tx = c.hero.textOffsetX != null ? Number(c.hero.textOffsetX) : 0;
  const ty = c.hero.textOffsetY != null ? Number(c.hero.textOffsetY) : 0;
  const copyStyle = `${ff}transform:translate(${tx}px,${ty}px);`;
  const titleStyle = `${c.hero.titleColor ? 'color:' + esc(c.hero.titleColor) + ';' : ''}font-size:calc(clamp(34px,5vw,54px)*${fs});`;
  const leadStyle = `${c.hero.textColor ? 'color:' + esc(c.hero.textColor) + ';' : ''}font-size:calc(18px*${fs});`;
  const eyebrowStyle = `${c.hero.titleColor ? 'color:' + esc(c.hero.titleColor) + ';' : ''}font-size:calc(13px*${fs});`;
  const trustStyle = `${c.hero.textColor ? 'color:' + esc(c.hero.textColor) + ';' : ''}font-size:calc(14px*${fs});`;

  const boxFallback = `<div class="box-illustration">
      <div class="box-top"></div>
      <div class="box-body"><span>JIANGXIN</span><small>Packaging</small></div>
    </div>`;

  let html = `
  <section class="hero" id="home">
    <div class="hero-bg" aria-hidden="true">${heroBg}${heroMask}</div>
    <div class="hero-stage${slideshowOn ? ' slideshow' : ''}" aria-hidden="true">${heroFloats}</div>
    <div class="container hero-inner${heroFloats ? ' has-floats' : ''}">
      <div class="hero-copy" style="${copyStyle}">
        ${heroPanel}
        <p class="eyebrow" style="${eyebrowStyle}">${esc(c.hero.eyebrow)}</p>
        <h1 style="${titleStyle}">${esc(c.hero.title1)}<br /><span class="accent">${esc(c.hero.titleAccent)}</span></h1>
        <p class="lead" style="${leadStyle}">${esc(c.hero.lead)}</p>
        <div class="hero-actions">
          <a href="#products" class="btn btn-primary">${esc(c.hero.cta1)}</a>
          <a href="#contact" class="btn btn-ghost">${esc(c.hero.cta2)}</a>
        </div>
        <div class="trust" style="${trustStyle}">${trust}</div>
      </div>
      ${heroFloats ? '' : `<div class="hero-art">${boxFallback}</div>`}
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
  const isVideo = src => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(src || '');
  const aboutImg = c.about.image
    ? (isVideo(c.about.image)
        ? `<video src="${esc(c.about.image)}" autoplay muted loop playsinline style="width:100%;border-radius:14px;margin-top:18px;display:block;"></video>`
        : `<img src="${esc(c.about.image)}" alt="Our factory" data-full="${esc(c.about.image)}" style="width:100%;border-radius:14px;margin-top:18px;" />`)
    : "";
  const gallery = (c.about.gallery || []).filter(g => g && g.image);
  const hasPos = gallery.some(g => g.x != null);
  const cols = Math.min(Math.max(c.about.galleryColumns || 3, 1), 4);
  const galleryStyle = hasPos ? '' : `grid-template-columns:repeat(${cols},1fr);`;
  const aboutGallery = gallery.length
    ? `<div class="about-gallery${hasPos ? ' about-gallery-free' : ''}" style="${galleryStyle}">${gallery.map(g => {
        const rot = g.rotate || 0, w = g.width || 260;
        const style = hasPos
          ? `position:absolute;left:${g.x!=null?g.x:50}%;top:${g.y!=null?g.y:20}%;width:${w}px;transform:rotate(${rot}deg);`
          : `transform:rotate(${rot}deg);`;
        return `<img src="${esc(g.image)}" alt="Our factory" loading="lazy" data-full="${esc(g.image)}" style="${style}" />`;
      }).join('')}</div>`
    : "";
  // 关于我们区外观：字体 / 标题色 / 小标题色 / 文字色 / 字号 / 文字底色块（后台可调，留空=默认样式）
  // 这些变量作用到整个 #about 区块，区内的标题、小标题、段落自动跟随，不影响其他区块
  const abFs = parseInt(c.about.fontSize, 10);
  const abOp = parseFloat(c.about.panelOpacity);
  const abSecVars = [];
  if (abFs > 0) abSecVars.push(`--about-fs:${Math.min(200, Math.max(60, abFs))}%`);
  if (c.about.textColor) abSecVars.push(`--about-p-color:${c.about.textColor}`, `--about-text-color:${c.about.textColor}`);
  if (c.about.font) abSecVars.push(`--font-base:${c.about.font}`);
  if (c.about.headingColor) abSecVars.push(`--heading-color:${c.about.headingColor}`);
  if (c.about.subColor) abSecVars.push(`--s-sub:${c.about.subColor}`);
  const abSecStyle = abSecVars.length ? ` style="${abSecVars.join(';')}"` : '';
  const aboutPanel = (c.about.panelColor && abOp > 0)
    ? `<div class="about-panel" style="background:${esc(c.about.panelColor)};opacity:${Math.min(100, abOp) / 100}"></div>` : '';
  html += `
  <section class="section" id="about"${abSecStyle}>
    <div class="container">
      <div class="section-head">
        <p class="eyebrow">${esc(c.about.eyebrow)}</p>
        <h2>${esc(c.about.title)}</h2>
      </div>
      <div class="about-grid">
        <div class="about-text">${aboutPanel}
          ${paras}
          <ul class="checklist">${checks}</ul>
          ${aboutImg}
        </div>
        <div class="stats">${stats}</div>
      </div>
      ${aboutGallery}
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
  <section class="section" id="process"${secStyle(c.process.style)}>
    <div class="container">
      ${secPanel(c.process.style)}
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
    // 产品相册：传了图片才显示「View Photos」按钮，点击进入该产品的图片二级页
    const hasPhotos = (it.photos || []).some(p => p && p.src);
    const photoBtn = hasPhotos
      ? `<a class="card-btn" href="gallery.html?product=${i}">View Photos <span class="arrow">→</span></a>` : '';
    return `
    <article class="card">
      <div class="card-img${ph}" data-full="${esc(it.image)}" style="${style}"></div>
      <h3>${esc(it.title)}</h3>
      <p>${esc(it.description)}</p>
      ${photoBtn}
    </article>`;
  }).join("");
  html += `
  <section class="section section-alt" id="products"${secStyle(c.products.style)}>
    <div class="container">
      ${secPanel(c.products.style)}
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
  // 「为什么选我们」下方的两张配图（后台可上传，留空不显示；点击可放大）
  const whyPhotos = (c.why.photos || []).filter(p => p && p.src)
    .map(p => {
      // 显示窗口自己定：height/width 留空=完整显示长图不裁剪；fit=contain 完整显示，cover 填满裁剪
      const h = parseInt(p.height, 10), w = parseInt(p.width, 10);
      const fit = p.fit === 'cover' ? 'cover' : 'contain';
      const vars = [];
      if (h > 0) vars.push(`--ph:${h}px`);
      if (w > 0) vars.push(`--pw:${w}px`);
      vars.push(`--pf:${fit}`);
      return `<img class="why-photo" src="${esc(p.src)}" alt="" data-full="${esc(p.src)}" style="${vars.join(';')}" />`;
    }).join('');
  const whyPhotosHtml = whyPhotos
    ? `<div class="why-photos">${whyPhotos}</div>` : '';
  html += `
  <section class="section" id="why"${secStyle(c.why.style)}>
    <div class="container">
      ${secPanel(c.why.style)}
      <div class="section-head">
        <p class="eyebrow">${esc(c.why.eyebrow)}</p>
        <h2>${esc(c.why.title)}</h2>
      </div>
      <div class="why-grid">${whys}</div>
      ${whyPhotosHtml}
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
  <section class="section section-alt" id="life"${secStyle(g.style)}>
    <div class="container">
      ${secPanel(g.style)}
      <div class="section-head">
        <p class="eyebrow">${esc(g.eyebrow)}</p>
        <h2>${esc(g.title)}</h2>
        <p class="lead">${esc(g.intro)}</p>
      </div>
      <div class="life-cards">${lifeCards}</div>
    </div>
  </section>`;
  }

  // Contact + 社媒图标：填了链接→白色圆钮可点击（新窗口打开）；没填→半透明灰图标不可点击
  const socSvg = {
    facebook: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21.9v-8h2.7l.4-3.1h-3.1V8.8c0-.9.25-1.5 1.55-1.5h1.65V4.5c-.3-.04-1.3-.13-2.4-.13-2.4 0-4 1.5-4 4.1v2.4H7.6v3.1h2.7v8h3.2z"/></svg>',
    tiktok: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 1 1-2.59-2.59c.27 0 .53.04.78.12V9.77a5.76 5.76 0 0 0-.78-.05 5.66 5.66 0 1 0 5.66 5.66V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3a4.28 4.28 0 0 1-3.22-1.48z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="2.5" y="2.5" width="19" height="19" rx="5"/><circle cx="12" cy="12" r="4.5"/><circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" stroke="none"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.6 7.2a2.8 2.8 0 0 0-2-2C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.6.4a2.8 2.8 0 0 0-2 2A29 29 0 0 0 2 12a29 29 0 0 0 .4 4.8 2.8 2.8 0 0 0 2 2c1.7.4 7.6.4 7.6.4s5.9 0 7.6-.4a2.8 2.8 0 0 0 2-2A29 29 0 0 0 22 12a29 29 0 0 0-.4-4.8zM9.8 15.3V8.7l6 3.3-6 3.3z"/></svg>'
  };
  const socialHtml = ['facebook', 'tiktok', 'instagram', 'youtube'].map(k => {
    const url = ((c.contact.social || {})[k] || '').trim();
    const svg = socSvg[k];
    return url
      ? `<a class="soc" href="${esc(url)}" target="_blank" rel="noopener" title="${k}">${svg}</a>`
      : `<span class="soc soc-off" title="${k}（未设置链接）">${svg}</span>`;
  }).join('');

  html += `
  <section class="section section-contact" id="contact"${secStyle(c.contact.style)}>
    <div class="container contact-grid">
      ${secPanel(c.contact.style)}
      <div class="contact-info">
        <p class="eyebrow">${esc(c.contact.eyebrow)}</p>
        <h2>${esc(c.contact.title)}</h2>
        <p class="lead">${esc(c.contact.lead)}</p>
        <ul class="contact-list">
          <li><span class="ci-label">Email</span><a href="mailto:${esc(c.contact.email)}">${esc(c.contact.email)}</a></li>
          <li><span class="ci-label">Phone / WhatsApp</span><a href="tel:${esc(c.contact.phone)}">${esc(c.contact.phone)}</a></li>
          <li><span class="ci-label">Address</span><span>${esc(c.contact.address)}</span></li>
        </ul>
        <div class="contact-social">${socialHtml}</div>
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
  afterRender(c);
  setupMusic(c);
  applyTheme(c);
  applyBranding(c);
}

// 外观 / 配色：仅页面背景、区块底色、导航栏背景为全站级（这些本来就适合统一调）
function applyTheme(c) {
  const root = document.documentElement;
  const t = c.theme || {};
  if (t.bgColor) root.style.setProperty('--bg', t.bgColor);
  if (t.bgAlt) root.style.setProperty('--bg-alt', t.bgAlt);
  if (t.headerColor) root.style.setProperty('--header-bg', t.headerColor);
}

// 顶部导航栏 / Logo（网站标题）：字体、字号、颜色、底色块、导航文字颜色，各自可调
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

// 点击图片放大查看（lightbox，支持同组左右切换）
let lbList = [], lbIdx = 0;
function ensureLightbox() {
  if (document.getElementById('lightbox')) return;
  const lb = document.createElement('div');
  lb.id = 'lightbox';
  lb.innerHTML = '<button class="lb-close" aria-label="Close">×</button>'
    + '<div class="lb-img"></div><p class="lb-cap"></p>'
    + '<button class="lb-prev" aria-label="上一张">‹</button>'
    + '<button class="lb-next" aria-label="下一张">›</button>'
    + '<div class="lb-count"></div>';
  document.body.appendChild(lb);
  lb.addEventListener('click', e => {
    if (e.target === lb || e.target.classList.contains('lb-close')) lb.classList.remove('open');
  });
  lb.querySelector('.lb-prev').addEventListener('click', e => { e.stopPropagation(); lbIdx = (lbIdx - 1 + lbList.length) % lbList.length; showLightbox(); });
  lb.querySelector('.lb-next').addEventListener('click', e => { e.stopPropagation(); lbIdx = (lbIdx + 1) % lbList.length; showLightbox(); });
}
function showLightbox() {
  const it = lbList[lbIdx]; if (!it) return;
  const box = document.querySelector('#lightbox .lb-img');
  if (it.url) { box.style.backgroundImage = `url('${it.url}')`; box.textContent = ''; }
  else { box.style.backgroundImage = 'none'; box.textContent = 'No image'; }
  document.querySelector('#lightbox .lb-cap').textContent = it.cap || '';
  document.querySelector('#lightbox .lb-count').textContent = lbList.length > 1 ? `${lbIdx + 1} / ${lbList.length}` : '';
}
function openLightbox(list, idx) {
  ensureLightbox(); lbList = list; lbIdx = idx || 0; showLightbox();
  document.getElementById('lightbox').classList.add('open');
}
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { const lb = document.getElementById('lightbox'); if (lb) lb.classList.remove('open'); }
});

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

  // 浏览器禁止自动播放有声内容：用户首次交互后尝试自动开始
  const tryAuto = () => audio.play().catch(() => {});
  window.addEventListener('pointerdown', tryAuto, { once: true });
  window.addEventListener('keydown', tryAuto, { once: true });
}

// 渲染后初始化交互
function afterRender(c) {
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

  // 图片点击放大：同一 section 内的图片成一组，可左右切换
  document.querySelectorAll('[data-full]').forEach(el => {
    if (!el.dataset.full) return;
    el.classList.add('zoomable');
    el.addEventListener('click', () => {
      const sec = el.closest('section');
      const all = sec ? [...sec.querySelectorAll('[data-full]')].filter(x => x.dataset.full) : [el];
      const list = all.map(x => ({ url: x.dataset.full, cap: x.dataset.cap || '' }));
      openLightbox(list, all.indexOf(el));
    });
  });

  // 首页自由图片轮播：多张图逐张淡入淡出循环播放（后台「轮播开关」开启时生效）
  const slideStage = document.querySelector('.hero-stage.slideshow');
  if (slideStage) {
    const slides = [...slideStage.querySelectorAll('.hero-float')];
    if (slides.length > 1) {
      const sec = Math.min(15, Math.max(1, c.hero.slideSeconds != null ? Number(c.hero.slideSeconds) : 3));
      let si = 0;
      setInterval(() => {
        slides[si].classList.remove('is-active');
        si = (si + 1) % slides.length;
        slides[si].classList.add('is-active');
      }, sec * 1000);
    }
  }
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
