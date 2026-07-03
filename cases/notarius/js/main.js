/* ============================================================
   NOTARIUS SOKOLOVA — Main JavaScript
   ============================================================ */

(function () {
  'use strict';

  // ──────────────────────────────────────────────────────────
  // Header scroll state
  // ──────────────────────────────────────────────────────────
  const header = document.querySelector('.site-header');

  function updateHeader() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }

  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  // ──────────────────────────────────────────────────────────
  // Mobile nav
  // ──────────────────────────────────────────────────────────
  const burger = document.querySelector('.nav-burger');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav.querySelectorAll('a');
  let menuOpen = false;

  function openMenu() {
    menuOpen = true;
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    mobileNav.classList.add('open');
    mobileNav.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    mobileLinks[0].focus();
  }

  function closeMenu() {
    menuOpen = false;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    mobileNav.classList.remove('open');
    mobileNav.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', () => menuOpen ? closeMenu() : openMenu());

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && menuOpen) closeMenu();
  });

  // ──────────────────────────────────────────────────────────
  // Scroll reveal (IntersectionObserver)
  // ──────────────────────────────────────────────────────────
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ──────────────────────────────────────────────────────────
  // Animated counters
  // ──────────────────────────────────────────────────────────
  const statItems = document.querySelectorAll('.stat-item');
  const statCounts = document.querySelectorAll('.stat-count');

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    const duration = target > 1000 ? 1800 : 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOutCubic(progress) * target);
      el.textContent = value.toLocaleString('ru-RU');
      if (progress < 1) requestAnimationFrame(update);
      else el.textContent = target.toLocaleString('ru-RU');
    }

    requestAnimationFrame(update);
  }

  if ('IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            const countEl = entry.target.querySelector('.stat-count');
            if (countEl) animateCounter(countEl);
            statsObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statItems.forEach(item => statsObserver.observe(item));
  } else {
    statCounts.forEach(el => {
      el.textContent = parseInt(el.dataset.target, 10).toLocaleString('ru-RU');
    });
  }

  // ──────────────────────────────────────────────────────────
  // FAQ accordion
  // ──────────────────────────────────────────────────────────
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      const answerId = btn.getAttribute('aria-controls');
      const answer = document.getElementById(answerId);

      // Close all others
      faqQuestions.forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          const otherId = other.getAttribute('aria-controls');
          const otherAnswer = document.getElementById(otherId);
          if (otherAnswer) otherAnswer.setAttribute('aria-hidden', 'true');
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.setAttribute('aria-hidden', String(expanded));
    });
  });

  // ──────────────────────────────────────────────────────────
  // Phone input mask
  // ──────────────────────────────────────────────────────────
  const phoneInput = document.getElementById('form-phone');

  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      let val = this.value.replace(/\D/g, '');

      if (val.startsWith('8')) val = '7' + val.slice(1);
      if (!val.startsWith('7') && val.length > 0) val = '7' + val;

      let formatted = '';
      if (val.length > 0) formatted = '+7';
      if (val.length > 1) formatted += ' (' + val.slice(1, 4);
      if (val.length >= 4) formatted += ') ' + val.slice(4, 7);
      if (val.length >= 7) formatted += '-' + val.slice(7, 9);
      if (val.length >= 9) formatted += '-' + val.slice(9, 11);

      this.value = formatted;
    });

    phoneInput.addEventListener('keydown', function (e) {
      if (e.key === 'Backspace' && this.value.length <= 3) {
        this.value = '';
      }
    });
  }

  // ──────────────────────────────────────────────────────────
  // Contact form submit
  // ──────────────────────────────────────────────────────────
  const form = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = form.querySelector('#form-name').value.trim();
      const phone = form.querySelector('#form-phone').value.trim();

      if (!name || phone.length < 10) {
        const missing = !name
          ? form.querySelector('#form-name')
          : form.querySelector('#form-phone');
        missing.focus();
        missing.style.borderColor = '#e05252';
        setTimeout(() => { missing.style.borderColor = ''; }, 2000);
        return;
      }

      // Simulate send
      const submitBtn = form.querySelector('.form-submit');
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.6';

      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('show');
      }, 600);
    });
  }

  // ──────────────────────────────────────────────────────────
  // Smooth scroll for anchor links (Safari fallback)
  // ──────────────────────────────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 16;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
