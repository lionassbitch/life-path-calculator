/* ============================================
   LION ASS BITCH — INTERACTIONS
============================================ */

/* ---- CUSTOM CURSOR ---- */
(function initCursor() {
  const dot   = document.getElementById('cursor');
  const trail = document.getElementById('cursor-trail');
  if (!dot || !trail) return;

  let mouseX = 0, mouseY = 0;
  let trailX = 0, trailY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function animateTrail() {
    trailX += (mouseX - trailX) * 0.12;
    trailY += (mouseY - trailY) * 0.12;
    trail.style.left = trailX + 'px';
    trail.style.top  = trailY + 'px';
    requestAnimationFrame(animateTrail);
  }
  animateTrail();

  // grow cursor on interactive elements
  const interactives = document.querySelectorAll('a, button, [tabindex]');
  interactives.forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width  = '18px';
      dot.style.height = '18px';
      trail.style.width  = '52px';
      trail.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width  = '10px';
      dot.style.height = '10px';
      trail.style.width  = '32px';
      trail.style.height = '32px';
    });
  });
})();


/* ---- SCROLL REVEAL ---- */
(function initReveal() {
  // Add reveal class to all major content blocks
  const targets = document.querySelectorAll(
    '.section-header, .music-grid, .streaming-bar, ' +
    '.art-intro, .art-masonry, .art-cta-row, ' +
    '.merch-intro-strip, .merch-grid, ' +
    '.track-row, .merch-card, .art-item, ' +
    '.hero-content, .hero-ticker'
  );

  targets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
})();


/* ---- STAGGER CHILDREN ON REVEAL ---- */
(function initStagger() {
  const staggerGroups = [
    { parent: '.track-list',  child: '.track-row', delay: 80 },
    { parent: '.merch-grid',  child: '.merch-card', delay: 100 },
    { parent: '.art-masonry', child: '.art-item',   delay: 90 },
  ];

  staggerGroups.forEach(({ parent, child, delay }) => {
    const parents = document.querySelectorAll(parent);
    parents.forEach(p => {
      const children = p.querySelectorAll(child);
      children.forEach((el, i) => {
        el.style.transitionDelay = (i * delay) + 'ms';
      });
    });
  });
})();


/* ---- GLITCH ON SCROLL (hero title) ---- */
(function initScrollGlitch() {
  const lines = document.querySelectorAll('.title-line');
  let lastScrollY = window.scrollY;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const delta = Math.abs(window.scrollY - lastScrollY);
      if (delta > 20) {
        lines.forEach(line => {
          line.style.animation = 'none';
          void line.offsetWidth; // reflow
          line.style.animation = '';
        });
      }
      lastScrollY = window.scrollY;
      ticking = false;
    });
  });
})();


/* ---- NAV: background on scroll ---- */
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      nav.style.background = 'rgba(8,8,8,0.92)';
      nav.style.backdropFilter = 'blur(12px)';
      nav.style.borderBottom = '1px solid rgba(255,255,255,0.04)';
    } else {
      nav.style.background = 'transparent';
      nav.style.backdropFilter = 'none';
      nav.style.borderBottom = 'none';
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();


/* ---- TRACK ROW: keyboard & click feedback ---- */
(function initTrackRows() {
  const rows = document.querySelectorAll('.track-row');

  rows.forEach(row => {
    const activate = () => {
      // toggle a playing state
      const wasActive = row.classList.contains('playing');
      rows.forEach(r => r.classList.remove('playing'));
      if (!wasActive) {
        row.classList.add('playing');
        const play = row.querySelector('.tr-play');
        if (play) {
          play.textContent = '⏸';
          play.style.opacity = '1';
          play.style.color = 'var(--red)';
        }
        const name = row.querySelector('.tr-name');
        if (name) name.style.color = 'var(--red)';
      }
    };

    row.addEventListener('click', activate);
    row.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        activate();
      }
    });
  });
})();


/* ---- MERCH: cart feedback ---- */
(function initMerchButtons() {
  const addBtns = document.querySelectorAll('.merch-card .btn-raw');

  addBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const original = btn.textContent;
      btn.textContent = 'ADDED ✓';
      btn.style.background = '#1a9a00';
      btn.style.color = 'var(--cream)';
      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        btn.style.color = '';
      }, 1800);
    });
  });
})();


/* ---- ART ITEMS: subtle parallax on mousemove ---- */
(function initArtParallax() {
  const items = document.querySelectorAll('.art-item');

  items.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      const placeholder = item.querySelector('.art-placeholder');
      if (placeholder) {
        placeholder.style.transform = `scale(1.04) translate(${x * 8}px, ${y * 8}px)`;
      }
    });

    item.addEventListener('mouseleave', () => {
      const placeholder = item.querySelector('.art-placeholder');
      if (placeholder) {
        placeholder.style.transform = '';
      }
    });
  });
})();


/* ---- NOTIFY ME: email capture stub ---- */
(function initNotify() {
  const notifiers = document.querySelectorAll('.merch-notify');
  notifiers.forEach(el => {
    el.addEventListener('click', () => {
      const email = prompt('Drop your email and we\'ll hit you when it restocks:');
      if (email && email.includes('@')) {
        el.textContent = 'you\'re on the list';
        el.style.color = 'var(--red)';
        el.style.textDecoration = 'none';
        el.style.cursor = 'default';
      }
    });
  });
})();


/* ---- STREAM LINKS: external feedback ---- */
(function initStreamLinks() {
  const links = document.querySelectorAll('.stream-link');
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      link.style.color = 'var(--red)';
      link.textContent = link.textContent + ' ↗';
      setTimeout(() => {
        link.style.color = '';
        link.textContent = link.textContent.replace(' ↗', '');
      }, 1200);
    });
  });
})();


/* ---- WAVEFORM: pause animation on section out of view ---- */
(function initWaveformVisibility() {
  const waveform = document.querySelector('.waveform');
  if (!waveform) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      const bars = waveform.querySelectorAll('span');
      bars.forEach(bar => {
        bar.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      });
    },
    { threshold: 0 }
  );

  observer.observe(waveform);
})();
