/* ============================================================
   RIVA — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---- NAV SCROLL EFFECT ---------------------------------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---- MOBILE MENU ---------------------------------------- */
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileClose = document.querySelector('.mobile-menu-close');

  const openMenu = () => {
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
    burger?.setAttribute('aria-expanded', 'true');
  };

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
    burger?.setAttribute('aria-expanded', 'false');
  };

  burger?.addEventListener('click', openMenu);
  mobileClose?.addEventListener('click', closeMenu);
  mobileMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
  });

  /* ---- SCROLL REVEAL -------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  reveals.forEach(el => revealObs.observe(el));

  /* ---- REVIEWS CAROUSEL ----------------------------------- */
  const track = document.querySelector('.reviews-track');
  const prevBtn = document.querySelector('.rev-btn-prev');
  const nextBtn = document.querySelector('.rev-btn-next');

  const getScrollAmount = () => {
    const card = track?.querySelector('.review-card');
    if (!card) return 0;
    return card.offsetWidth + 20; // card width + gap (1.25rem ≈ 20px)
  };

  nextBtn?.addEventListener('click', () => {
    track?.scrollBy({ left: getScrollAmount(), behavior: 'smooth' });
  });

  prevBtn?.addEventListener('click', () => {
    track?.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' });
  });

  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS -------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = nav ? nav.offsetHeight + 16 : 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---- HERO SCROLL HINT ----------------------------------- */
  const heroScroll = document.querySelector('.hero-scroll');
  heroScroll?.addEventListener('click', () => {
    const next = document.querySelector('#doctors');
    if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---- FORM SUBMIT ---------------------------------------- */
  const ctaForm = document.querySelector('.cta-form');
  ctaForm?.addEventListener('submit', e => {
    e.preventDefault();
    const btn = ctaForm.querySelector('button[type="submit"]');
    const origText = btn.textContent;
    btn.textContent = 'Отправлено!';
    btn.disabled = true;
    btn.style.background = '#5A8A60';
    setTimeout(() => {
      btn.textContent = origText;
      btn.disabled = false;
      btn.style.background = '';
      ctaForm.reset();
    }, 3500);
  });

  /* ---- COUNTER ANIMATION ---------------------------------- */
  const counters = document.querySelectorAll('[data-count]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.getAttribute('data-count'));
      const suffix = el.getAttribute('data-suffix') || '';
      const dur = 1800;
      const start = performance.now();
      const animate = (now) => {
        const progress = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
      countObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => countObs.observe(el));

});
