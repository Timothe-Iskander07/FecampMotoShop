document.addEventListener('DOMContentLoaded', () => {

  // Header scroll effect
  const header = document.getElementById('header');
  const handleScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 50);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile navigation
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = navMenu.querySelectorAll('.nav__link');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('nav__toggle--open');
    navMenu.classList.toggle('nav__menu--open');
    document.body.style.overflow = navMenu.classList.contains('nav__menu--open') ? 'hidden' : '';
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('nav__toggle--open');
      navMenu.classList.remove('nav__menu--open');
      document.body.style.overflow = '';
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('nav__link--active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('nav__link--active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav, { passive: true });

  // Scroll reveal animations
  const revealElements = document.querySelectorAll(
    '.service-card, .moto-card, .process__step'
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add(
              entry.target.classList.contains('service-card') ? 'service-card--visible' :
              entry.target.classList.contains('moto-card') ? 'moto-card--visible' :
              'process__step--visible'
            );
          }, index * 100);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // Copy email to clipboard
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  const contactEmail = document.getElementById('contactEmail');
  const copyFeedback = document.getElementById('copyFeedback');

  if (copyEmailBtn && contactEmail) {
    copyEmailBtn.addEventListener('click', async () => {
      const email = contactEmail.textContent.trim();

      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const textarea = document.createElement('textarea');
        textarea.value = email;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      copyEmailBtn.classList.add('contact__copy-btn--copied');
      copyFeedback.classList.add('contact__copy-feedback--visible');

      setTimeout(() => {
        copyEmailBtn.classList.remove('contact__copy-btn--copied');
        copyFeedback.classList.remove('contact__copy-feedback--visible');
      }, 2500);
    });
  }

  // Smooth counter animation for hero stats
  const statNumbers = document.querySelectorAll('.hero__stat-number');

  const animateCounter = (el) => {
    const text = el.textContent;
    const hasPlus = text.includes('+');
    const target = parseInt(text.replace(/\D/g, ''), 10);
    if (isNaN(target)) return;

    const duration = 1500;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = hasPlus ? `${current}+` : String(current);

      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(animateCounter);
          statsObserver.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  const heroStats = document.querySelector('.hero__stats');
  if (heroStats) statsObserver.observe(heroStats);

});
