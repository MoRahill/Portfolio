/* ============================================================
   PORTFOLIO JS — Enhanced interactions
   ============================================================ */
 
// ─── CUSTOM CURSOR ───────────────────────────────────────
// Inject cursor elements so no HTML change is needed
const cursorDot  = document.createElement('div');
const cursorRing = document.createElement('div');
cursorDot.className  = 'cursor-dot';
cursorRing.className = 'cursor-ring';
document.body.appendChild(cursorDot);
document.body.appendChild(cursorRing);
 
// Start off-screen so it doesn't flash at (0,0)
let dotX = -200, dotY = -200;
let ringX = -200, ringY = -200;
let isHovering = false;
 
document.addEventListener('mousemove', (e) => {
  dotX = e.clientX;
  dotY = e.clientY;
  cursorDot.style.transform = `translate(calc(${dotX}px - 50%), calc(${dotY}px - 50%))`;
});
 
// Smooth lagging ring
function animateRing() {
  const speed = isHovering ? 0.08 : 0.13;
  ringX += (dotX - ringX) * speed;
  ringY += (dotY - ringY) * speed;
  cursorRing.style.transform = `translate(calc(${ringX}px - 50%), calc(${ringY}px - 50%))`;
  requestAnimationFrame(animateRing);
}
animateRing();
 
// Hover expansion on interactive elements
document.querySelectorAll('a, button, .btn, .skill-tag, .project-card, .stat-card, .social-link, .project-link').forEach(el => {
  el.addEventListener('mouseenter', () => {
    isHovering = true;
    document.body.classList.add('cursor-hover');
  });
  el.addEventListener('mouseleave', () => {
    isHovering = false;
    document.body.classList.remove('cursor-hover');
  });
});
 
// Click burst effect
document.addEventListener('mousedown', () => cursorRing.classList.add('cursor-click'));
document.addEventListener('mouseup',   () => cursorRing.classList.remove('cursor-click'));
 
// Hide when leaving window
document.addEventListener('mouseleave', () => {
  cursorDot.style.opacity  = '0';
  cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  cursorDot.style.opacity  = '1';
  cursorRing.style.opacity = '1';
});
 
// ─── NAVBAR ON SCROLL ────────────────────────────────────
const navbar = document.querySelector('.navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
      navbar.style.background = '';
    }
  }, { passive: true });
}
 
// ─── SMOOTH SCROLL ───────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
 
// ─── SCROLL REVEAL ───────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
 
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
 
// ─── SKILL CARD MOUSE GLOW ───────────────────────────────
document.querySelectorAll('.skill-category').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top)  / rect.height) * 100;
    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});
 
// ─── STAT NUMBER COUNT-UP ────────────────────────────────
function countUp(el, target, suffix = '') {
  const duration = 1800;
  const start = performance.now();
  const isDecimal = String(target).includes('.');
  
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isDecimal
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}
 
const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.dataset.count;
      if (!raw) return;
      const suffix = raw.replace(/[0-9.]/g, '');
      const num    = parseFloat(raw);
      countUp(el, num, suffix);
      statObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
 
document.querySelectorAll('[data-count]').forEach(el => statObserver.observe(el));
 
// ─── HERO PARALLAX ───────────────────────────────────────
const hero = document.querySelector('.hero');
const heroImg = document.querySelector('.hero-image');
 
if (hero && heroImg) {
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    if (scrolled < window.innerHeight) {
      heroImg.style.transform = `translateY(${scrolled * 0.12}px)`;
    }
  }, { passive: true });
}
 
// ─── ACTIVE NAV LINK ─────────────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');
 
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle(
          'active',
          link.getAttribute('href') === `#${entry.target.id}`
        );
      });
    }
  });
}, { threshold: 0.4 });
 
sections.forEach(s => sectionObserver.observe(s));
 
console.log('Portfolio loaded — dark editorial luxury ✦');
 