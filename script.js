/* ═══════════════════════════════════════════════════════
   CYBERSECURITY PORTFOLIO — JAVASCRIPT
   Features: Matrix Rain, Typed Text, Scroll Animations,
             Counter, Nav Active State, Form, Skill Bars
   ═══════════════════════════════════════════════════════ */

'use strict';

/* ─── DOM READY ──────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initMatrix();
  initTyped();
  initNavbar();
  initHamburger();
  initReveal();
  initSkillBars();
  initCounters();
  initForm();
  initActiveNav();
});

/* ─────────────────────────────────────────────────────
   1. MATRIX RAIN CANVAS
   ─────────────────────────────────────────────────── */
function initMatrix() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Characters — mix of katakana, latin, digits
  const chars =
    'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ' +
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&<>/\\|{}[]';

  const fontSize = 14;
  let columns, drops;

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops   = new Array(columns).fill(1);
  }

  function draw() {
    // Slightly transparent fill to create fade-trail effect
    ctx.fillStyle = 'rgba(5, 11, 18, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.font = `${fontSize}px "Share Tech Mono", monospace`;

    for (let i = 0; i < drops.length; i++) {
      // Alternate between green (matrix) and cyan
      const isAccent = Math.random() < 0.02;
      ctx.fillStyle = isAccent ? '#00e5ff' : '#00ff41';

      const char = chars[Math.floor(Math.random() * chars.length)];
      ctx.fillText(char, i * fontSize, drops[i] * fontSize);

      // Reset drop to top with randomness
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }
  }

  resize();
  window.addEventListener('resize', resize);

  // Run at 20 FPS to keep subtle
  setInterval(draw, 50);
}

/* ─────────────────────────────────────────────────────
   2. TERMINAL TYPED TEXT ANIMATION
   ─────────────────────────────────────────────────── */
function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const phrases = [
    'Network Security',
    'Penetration Testing',
    'Cryptography',
    'Web Security',
    'Digital Forensics',
    'OSINT',
    'Malware Analysis',
  ];

  let phraseIdx  = 0;
  let charIdx    = 0;
  let isDeleting = false;
  let pauseTimer = null;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (!isDeleting) {
      // Typing forward
      el.textContent = currentPhrase.slice(0, charIdx + 1);
      charIdx++;

      if (charIdx === currentPhrase.length) {
        // Pause at end before deleting
        isDeleting = true;
        pauseTimer = setTimeout(type, 2000);
        return;
      }
    } else {
      // Deleting
      el.textContent = currentPhrase.slice(0, charIdx - 1);
      charIdx--;

      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx  = (phraseIdx + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 40 : 80;
    setTimeout(type, speed);
  }

  // Small initial delay
  setTimeout(type, 1200);
}

/* ─────────────────────────────────────────────────────
   3. NAVBAR SCROLL BEHAVIOUR
   ─────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  function onScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load
}

/* ─────────────────────────────────────────────────────
   4. HAMBURGER MENU (MOBILE)
   ─────────────────────────────────────────────────── */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close menu when a link is clicked
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  });
}

/* ─────────────────────────────────────────────────────
   5. SCROLL REVEAL ANIMATIONS
   ─────────────────────────────────────────────────── */
function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  // Add stagger delays within the same section
  document.querySelectorAll('.about-grid, .skills-grid, .projects-grid, .certs-grid').forEach(grid => {
    grid.querySelectorAll('.reveal').forEach((el, i) => {
      el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ─────────────────────────────────────────────────────
   6. SKILL BARS ANIMATION
   ─────────────────────────────────────────────────── */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0%';
          // Small delay for visual delight
          setTimeout(() => {
            bar.style.width = targetWidth;
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.5 }
  );

  bars.forEach(bar => observer.observe(bar));
}

/* ─────────────────────────────────────────────────────
   7. ANIMATED COUNTERS (HERO STATS)
   ─────────────────────────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(el) {
  const target   = parseInt(el.getAttribute('data-count'), 10);
  const duration = 1200;
  const start    = performance.now();

  function update(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);

    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

/* ─────────────────────────────────────────────────────
   8. CONTACT FORM
   ─────────────────────────────────────────────────── */
function initForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Basic validation
    const name    = form.querySelector('#name').value.trim();
    const email   = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();

    if (!name || !email || !message) {
      shakeForm(form);
      return;
    }

    if (!isValidEmail(email)) {
      shakeForm(form);
      return;
    }

    // Simulate sending (replace with real backend/email service)
    const btn = form.querySelector('.btn-send');
    btn.disabled = true;
    btn.querySelector('.btn-send-text').textContent = 'Envoi en cours...';

    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.querySelector('.btn-send-text').textContent = 'Envoyer le message';

      if (success) {
        success.style.display = 'flex';
        setTimeout(() => {
          success.style.display = 'none';
        }, 4000);
      }
    }, 1500);
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeForm(form) {
  form.style.animation = 'none';
  // Trigger reflow
  void form.offsetHeight;
  form.style.animation = 'shake 0.4s ease';
}

// Add shake keyframe via JS
const shakeStyle = document.createElement('style');
shakeStyle.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
`;
document.head.appendChild(shakeStyle);

/* ─────────────────────────────────────────────────────
   9. ACTIVE NAV LINK ON SCROLL (INTERSECTION OBSERVER)
   ─────────────────────────────────────────────────── */
function initActiveNav() {
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(section => observer.observe(section));
}

/* ─────────────────────────────────────────────────────
   10. SMOOTH CURSOR GLOW (OPTIONAL VISUAL TOUCH)
   ─────────────────────────────────────────────────── */
(function initCursorGlow() {
  // Only on non-touch, large screens
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.innerWidth < 1024) return;

  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed;
    width: 320px;
    height: 320px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 1;
    transform: translate(-50%, -50%);
    transition: left 0.12s ease, top 0.12s ease;
  `;
  document.body.appendChild(glow);

  document.addEventListener('mousemove', (e) => {
    glow.style.left = `${e.clientX}px`;
    glow.style.top  = `${e.clientY}px`;
  });
})();

/* ─────────────────────────────────────────────────────
   11. GLITCH EFFECT TRIGGER ON HERO NAME HOVER
   ─────────────────────────────────────────────────── */
(function initGlitch() {
  const heroName = document.querySelector('.hero-name');
  if (!heroName) return;

  setInterval(() => {
    heroName.classList.add('glitching');
    setTimeout(() => heroName.classList.remove('glitching'), 300);
  }, 6000);
})();

/* ─────────────────────────────────────────────────────
   12. SMOOTH ANCHOR SCROLLING WITH OFFSET
       (accounts for fixed navbar height)
   ─────────────────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const targetId = anchor.getAttribute('href');
    if (targetId === '#') return;

    const target = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();

    const navbarHeight = document.getElementById('navbar')?.offsetHeight ?? 70;
    const top = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

    window.scrollTo({ top, behavior: 'smooth' });
    const contactForm = document.getElementById("contact-form");
const formSuccess = document.getElementById("form-success");

contactForm.addEventListener("submit", function (event) {

    // Empêche le rechargement de la page
    event.preventDefault();

    // Envoie le formulaire avec EmailJS
    emailjs.sendForm(
          "service_3qu8yb7",
        
          "template_4aav39q",
      
        this
    )
    .then(function () {

        // Message de succès
        formSuccess.style.display = "block";

        // Réinitialiser le formulaire
        contactForm.reset();

    })
    .catch(function (error) {

        console.error("Erreur EmailJS :", error);

        alert("Une erreur est survenue. Le message n'a pas été envoyé.");
    });

});
  });
});
