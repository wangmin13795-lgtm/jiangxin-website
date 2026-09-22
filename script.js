// ===================== 移动端菜单 =====================
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ===================== 年份 =====================
document.getElementById('year').textContent = new Date().getFullYear();

// ===================== 滚动入场动画 =====================
const revealEls = document.querySelectorAll('.section, .card, .why-item, .stat');
revealEls.forEach(el => el.classList.add('reveal'));
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => io.observe(el));

// ===================== 数字滚动动画 =====================
const nums = document.querySelectorAll('.num');
const numIO = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    const target = +el.dataset.target;
    const dur = 1400;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const val = Math.floor((1 - Math.pow(1 - p, 3)) * target);
      el.textContent = val.toLocaleString();
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    numIO.unobserve(el);
  });
}, { threshold: 0.5 });
nums.forEach(n => numIO.observe(n));

// ===================== 联系表单（演示） =====================
// 部署说明：把 index.html 中 form 的 action 换成 Formspree 免费地址
// （https://formspree.io 注册后获得），表单即可真实发送到你们邮箱。
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
form.addEventListener('submit', (e) => {
  // 如果 action 仍是占位地址，则本地演示，不真正提交
  if (form.action.includes('your-form-id')) {
    e.preventDefault();
    note.hidden = false;
    form.reset();
  }
});
