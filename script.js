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
  const targets = document.querySelectorAll(
    '.section-header, ' +
    '.art-intro, .art-masonry, .art-cta-row, ' +
    '.merch-intro-strip, .merch-grid, ' +
    '.merch-card, .art-item, ' +
    '.blog-grid, .blog-card, ' +
    '.music-teaser-inner, ' +
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
    { parent: '.merch-grid',  child: '.merch-card', delay: 100 },
    { parent: '.art-masonry', child: '.art-item',   delay: 90  },
    { parent: '.blog-grid',   child: '.blog-card',  delay: 120 },
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


/* ---- MERCH: notify me stub ---- */
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


/* ---- STREAM LINKS: hover feedback ---- */
(function initStreamLinks() {
  const links = document.querySelectorAll('.stream-link');
  links.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (!link.dataset.original) link.dataset.original = link.textContent;
    });
    // Only intercept placeholder # links — real URLs navigate normally
    link.addEventListener('click', (e) => {
      if (link.getAttribute('href') !== '#') return;
      e.preventDefault();
      const orig = link.textContent.replace(' ↗', '');
      link.textContent = orig + ' ↗';
      link.style.color = 'var(--red)';
      setTimeout(() => {
        link.textContent = orig;
        link.style.color = '';
      }, 1200);
    });
  });
})();


/* ---- SHOPIFY BUY BUTTON INTEGRATION ---- */
/*
 * SETUP (3 steps):
 *  1. Set SHOPIFY_DOMAIN to your store domain, e.g. 'your-store.myshopify.com'
 *  2. Set SHOPIFY_TOKEN to your Storefront API access token
 *     Shopify Admin → Settings → Apps → Develop apps → your app → API credentials
 *     Storefront API access scopes: unauthenticated_read_product_listings
 *  3. In index.html, replace data-product-id="REPLACE_WITH_PRODUCT_ID" on each
 *     .shopify-btn-mount div with the numeric product ID from your Shopify admin URL
 *     (e.g. admin.shopify.com/store/YOUR-STORE/products/7654321098765 → 7654321098765)
 */
(function initShopify() {
  var SHOPIFY_DOMAIN = 'YOUR-STORE.myshopify.com';
  var SHOPIFY_TOKEN  = 'YOUR_STOREFRONT_ACCESS_TOKEN';

  var mounts = document.querySelectorAll('.shopify-btn-mount');
  if (!mounts.length) return;

  // Don't initialize until credentials are filled in
  if (SHOPIFY_DOMAIN.includes('YOUR-STORE') || SHOPIFY_TOKEN.includes('YOUR_')) return;

  function buildUI() {
    var client = ShopifyBuy.buildClient({
      domain: SHOPIFY_DOMAIN,
      storefrontAccessToken: SHOPIFY_TOKEN,
    });

    ShopifyBuy.UI.onReady(client).then(function(ui) {
      mounts.forEach(function(node) {
        var productId = node.dataset.productId;
        if (!productId || productId === 'REPLACE_WITH_PRODUCT_ID') return;

        ui.createComponent('product', {
          id: productId,
          node: node,
          options: {
            product: {
              contents: {
                img: false,
                title: false,
                price: false,
                description: false,
              },
              text: { button: 'ADD' },
              styles: {
                button: {
                  'font-family': "'Space Mono', 'Courier New', monospace",
                  'font-size':   '10px',
                  'font-weight': '700',
                  'letter-spacing': '0.25em',
                  'text-transform': 'uppercase',
                  'color':            '#080808',
                  'background-color': '#f0ede6',
                  'padding': '9px 18px',
                  'border-radius': '0',
                  'border': 'none',
                  ':hover': {
                    'background-color': '#ff2d00',
                    'color': '#f0ede6',
                  },
                  ':focus': {
                    'background-color': '#ff2d00',
                    'color': '#f0ede6',
                  },
                },
              },
            },
          },
        });
      });
    });
  }

  if (window.ShopifyBuy && window.ShopifyBuy.UI) {
    buildUI();
  } else {
    var sdkScript = document.querySelector('script[src*="shopifycdn"]');
    if (sdkScript) {
      sdkScript.addEventListener('load', buildUI);
    }
  }
})();
