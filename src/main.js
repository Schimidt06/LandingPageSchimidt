// =====================
// PARTICLE CANVAS
// =====================
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let W = canvas.width = window.innerWidth;
let H = canvas.height = window.innerHeight;
const mouse = { x: null, y: null };
let particles = [];

function rand(min, max) { return Math.random() * (max - min) + min; }

function createParticles() {
  const COUNT = Math.min(Math.floor((W * H) / 15000), 100);
  particles = [];
  for (let i = 0; i < COUNT; i++) {
    particles.push({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
      size: rand(0.5, 2),
    });
  }
}

function drawParticles() {
  ctx.clearRect(0, 0, W, H);
  const CONNECT = 150;
  const REPEL = 110;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    // Mouse repel
    if (mouse.x !== null) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.hypot(dx, dy);
      if (dist < REPEL) {
        const force = (REPEL - dist) / REPEL;
        p.vx -= (dx / dist) * force * 0.25;
        p.vy -= (dy / dist) * force * 0.25;
      }
    }

    p.vx *= 0.98;
    p.vy *= 0.98;
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = W;
    if (p.x > W) p.x = 0;
    if (p.y < 0) p.y = H;
    if (p.y > H) p.y = 0;

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0,217,255,0.55)';
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d = Math.hypot(dx, dy);
      if (d < CONNECT) {
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(0,217,255,${(1 - d / CONNECT) * 0.2})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
}

window.addEventListener('resize', () => {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
  createParticles();
});
window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

createParticles();
drawParticles();

// =====================
// CUSTOM CURSOR
// =====================
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

function animateCursor() {
  dot.style.left = mx + 'px';
  dot.style.top = my + 'px';
  rx += (mx - rx) * 0.1;
  ry += (my - ry) * 0.1;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();

// =====================
// SCROLL PROGRESS
// =====================
const progressBar = document.getElementById('scroll-progress');
window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  progressBar.style.width = (pct * 100) + '%';
}, { passive: true });

// =====================
// NAV SCROLL STATE
// =====================
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// Active nav link
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id));
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => io.observe(s));

// =====================
// MOBILE MENU
// =====================
const menuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});
mobileMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    menuBtn.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// =====================
// SCROLL REVEAL
// =====================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('revealed'), i * 80);
    }
  });
}, { threshold: 0.08 });
document.querySelectorAll('[data-reveal]').forEach(el => revealObserver.observe(el));

// =====================
// TYPING ANIMATION
// =====================
const words = [
  'sistemas distribuídos.',
  'experiências imersivas.',
  'arquiteturas cloud-native.',
  'soluções de alto impacto.',
];
let wIdx = 0, cIdx = 0, deleting = false;
const typingEl = document.getElementById('typing-text');

function type() {
  const word = words[wIdx];
  if (!deleting) {
    typingEl.textContent = word.slice(0, ++cIdx);
    if (cIdx === word.length) {
      setTimeout(() => { deleting = true; type(); }, 2200);
      return;
    }
  } else {
    typingEl.textContent = word.slice(0, --cIdx);
    if (cIdx === 0) {
      deleting = false;
      wIdx = (wIdx + 1) % words.length;
    }
  }
  setTimeout(type, deleting ? 45 : 75);
}
type();

// =====================
// 3D TILT CARDS
// =====================
document.querySelectorAll('.tilt-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    const rx = ((y - r.height / 2) / r.height) * -10;
    const ry = ((x - r.width / 2) / r.width) * 10;
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1)';
  });
});

// =====================
// SMOOTH SCROLL
// =====================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

// =====================
// EMAILJS CONTACT FORM
// =====================
const EMAILJS_SERVICE = 'service_c7b3vkm';
const EMAILJS_TEMPLATE = 'template_6gxqnxy';
const EMAILJS_KEY = 'ftLxRMiw-H5VpXOrE';

// Init SDK (loaded via CDN before this module)
window.emailjs?.init({ publicKey: EMAILJS_KEY });

document.getElementById('contact-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('button[type=submit]');
  const originalHTML = btn.innerHTML;

  // Loading state
  btn.disabled = true;
  btn.innerHTML = 'Enviando... <span style="animation: blink 1s infinite; display:inline-block">_</span>';

  const params = {
    from_name: form.querySelector('#name').value,
    from_email: form.querySelector('#email').value,
    message: form.querySelector('#message').value,
    to_name: 'João Schimidt',
  };

  try {
    await window.emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, params);

    btn.innerHTML = 'Mensagem enviada! ✓';
    btn.style.background = '#22c55e';
    btn.style.color = '#000';
    form.reset();
    showFormMsg(form, '', false);

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 4000);
  } catch (err) {
    console.error('EmailJS error:', err);

    // Extract a human-readable reason from the EmailJS error object
    const reason = err?.text || err?.message || JSON.stringify(err) || 'Erro desconhecido';
    showFormMsg(form, `Erro: ${reason}`, true);

    btn.innerHTML = 'Erro ao enviar ↓';
    btn.style.background = '#ef4444';
    btn.style.color = '#fff';

    setTimeout(() => {
      btn.innerHTML = originalHTML;
      btn.style.background = '';
      btn.style.color = '';
      btn.disabled = false;
    }, 5000);
  }
});

function showFormMsg(form, msg, isError) {
  let el = form.querySelector('.form-feedback');
  if (!el) {
    el = document.createElement('p');
    el.className = 'form-feedback';
    el.style.cssText = 'font-size:.8rem;margin-top:.5rem;padding:.6rem 1rem;font-family:var(--mono);';
    form.appendChild(el);
  }
  el.textContent = msg;
  el.style.color = isError ? '#f87171' : '#4ade80';
  el.style.border = `1px solid ${isError ? 'rgba(248,113,113,.3)' : 'rgba(74,222,128,.3)'}`;
  el.style.display = msg ? 'block' : 'none';
}


