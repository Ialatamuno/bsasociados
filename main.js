/* ══════════════════════════════════════════════════════════════════════════
   BS Asociados — main.js
   ══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ──── NAVBAR: scroll opacity & active link ──── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Scroll opacity
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active link highlight
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 80;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  /* ──── MOBILE BURGER MENU ──── */
  const burger   = document.getElementById('navBurger');
  const navMenu  = document.getElementById('navLinks');

  burger.addEventListener('click', () => {
    const isOpen = navMenu.classList.toggle('open');
    burger.classList.toggle('open', isOpen);
    burger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on link click
  navMenu.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      burger.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ──── REVEAL ON SCROLL (Intersection Observer) ──── */
  const revealTargets = [
    '.section-header',
    '.section-intro',
    '.nosotros-img-container',
    '.nosotros-desc',
    '.pilar',
    '.area-card',
    '.logo-item',
    '.contact-form',
    '.contact-info',
    '.footer-col',
  ];

  const allReveal = document.querySelectorAll(revealTargets.join(', '));
  allReveal.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger delay based on sibling position
    const parent   = el.parentElement;
    const siblings = parent ? Array.from(parent.children).filter(c => c.classList.contains(el.classList[0])) : [];
    const idx      = siblings.indexOf(el);
    if (idx > 0 && idx <= 4) {
      el.classList.add(`reveal-delay-${idx}`);
    }
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  allReveal.forEach(el => revealObserver.observe(el));

  /* ──── CONTACT FORM ──── */
  const form       = document.getElementById('contactForm');
  const btnEnviar  = document.getElementById('btnEnviar');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!validateForm()) return;

      // Simulate async submission
      const btnText = btnEnviar.querySelector('.btn-text');
      btnEnviar.disabled = true;
      btnText.textContent = 'Enviando...';

      setTimeout(() => {
        // Show success state
        form.style.display = 'none';

        const success = document.createElement('div');
        success.className = 'form-success show reveal visible';
        success.innerHTML = `
          <div class="form-success-icon"><i class="ti ti-circle-check"></i></div>
          <p class="form-success-title">Mensaje recibido</p>
          <p class="form-success-text">Nos pondremos en contacto con usted en un plazo máximo de 24 horas hábiles. Gracias por su consulta.</p>
        `;
        form.parentNode.insertBefore(success, form);

        btnEnviar.disabled = false;
        btnText.textContent = 'Enviar Consulta';
      }, 1200);
    });
  }

  function validateForm() {
    let valid = true;
    const fields = form.querySelectorAll('[required]');

    fields.forEach(field => {
      field.classList.remove('error', 'success');
      if (!field.value.trim()) {
        field.classList.add('error');
        valid = false;
      } else if (field.type === 'email' && !isValidEmail(field.value.trim())) {
        field.classList.add('error');
        valid = false;
      } else {
        field.classList.add('success');
      }
    });

    return valid;
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Live input validation feedback
  form && form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => {
      if (!input.hasAttribute('required')) return;
      input.classList.remove('error', 'success');
      if (!input.value.trim()) {
        input.classList.add('error');
      } else if (input.type === 'email' && !isValidEmail(input.value.trim())) {
        input.classList.add('error');
      } else {
        input.classList.add('success');
      }
    });
    input.addEventListener('input', () => {
      if (input.classList.contains('error') && input.value.trim()) {
        input.classList.remove('error');
      }
    });
  });

  /* ──── WHATSAPP FAB — show after scroll ──── */
  const fab = document.getElementById('whatsappFab');
  if (fab) {
    fab.style.opacity  = '0';
    fab.style.transform = 'translateY(16px)';
    fab.style.transition = 'opacity 0.4s ease, transform 0.4s ease, background 0.2s ease, box-shadow 0.2s ease';

    const fabObserver = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) {
          // Page is scrolled enough — show FAB
          fab.style.opacity  = '1';
          fab.style.transform = 'translateY(0)';
        } else {
          fab.style.opacity  = '0';
          fab.style.transform = 'translateY(16px)';
        }
      },
      { threshold: 0.5 }
    );
    fabObserver.observe(document.getElementById('inicio'));
  }

})();
