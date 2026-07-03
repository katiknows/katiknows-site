(() => {
  'use strict';

  /* Header background on scroll */
  const header = document.getElementById('header');
  const toggleHeaderState = () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
  };
  toggleHeaderState();
  window.addEventListener('scroll', toggleHeaderState, { passive: true });

  /* Mobile nav toggle */
  const navToggle = document.getElementById('navToggle');
  const mainNav = document.getElementById('main-nav');

  /* Move the nav panel to be a direct child of <body>. This keeps it out of
     .site-header, whose .scrolled state applies backdrop-filter — and any
     element with backdrop-filter becomes a containing block for its fixed-
     position descendants, which would shrink the fullscreen overlay down to
     the header's own height and leave it without an opaque background. */
  document.body.appendChild(mainNav);

  const closeMenu = () => {
    mainNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  };

  const openMenu = () => {
    mainNav.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  };

  navToggle.addEventListener('click', () => {
    if (mainNav.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  mainNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && mainNav.classList.contains('open')) {
      closeMenu();
      navToggle.focus();
    }
  });

  /* Reveal-on-scroll */
  const revealTargets = document.querySelectorAll(
    '.concern-card, .timeline-step, .guarantees-text, .guarantees-media, ' +
    '.team-text, .team-media, .project-card, .control-text, .control-media, .faq-item'
  );
  revealTargets.forEach((el) => el.setAttribute('data-reveal', ''));

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* Contact form (demo submit, no backend) */
  const form = document.getElementById('contactForm');
  const successMessage = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      form.querySelectorAll('input, select, button').forEach((el) => (el.disabled = true));
      successMessage.hidden = false;
      successMessage.textContent = 'Заявка отправлена. Мы свяжемся с вами в течение рабочего дня.';
    });
  }
})();
