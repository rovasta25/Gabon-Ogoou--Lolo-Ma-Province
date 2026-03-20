/* ============================================================
   SCRIPT.JS — À la découverte de l'Ogooué-Lolo
   Projet Licence 2 Génie Logiciel — IST Gabon
   Auteur : MOUANDZA MIKOUMOU Rova Chrismi Richie
   ============================================================ */

/* ===== NAVIGATION ACTIVE ===== */
(function () {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (a) {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) {
      a.classList.add('active');
    }
  });
})();

/* ===== ACCORDÉON ===== */
function toggleAccordion(btn) {
  const item = btn.parentElement;
  const wasOpen = item.classList.contains('open');

  document.querySelectorAll('.accordion-item.open').forEach(function (i) {
    i.classList.remove('open');
  });

  if (!wasOpen) {
    item.classList.add('open');
  }
}

/* ===== VALIDATION EMAIL ===== */
function validateEmail(email) {
  var trimmed = email.trim();
  if (/^[A-Z]/.test(trimmed)) return false; // Ne pas commencer par une majuscule
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

/* ===== VALIDATION DATE jj/mm/aaaa ===== */
function validateDate(dateStr) {
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateStr)) return false;
  var parts = dateStr.split('/');
  var day = parseInt(parts[0], 10);
  var month = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);
  if (month < 1 || month > 12) return false;
  if (day < 1 || day > 31) return false;
  if (year < 1900 || year > new Date().getFullYear()) return false;
  var date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
}

/* ===== AUTO-FORMAT DATE ===== */
function initDateInput() {
  var ddnInput = document.getElementById('ddn');
  if (!ddnInput) return;

  ddnInput.addEventListener('input', function () {
    var v = this.value.replace(/\D/g, '');
    if (v.length >= 3) v = v.slice(0, 2) + '/' + v.slice(2);
    if (v.length >= 6) v = v.slice(0, 5) + '/' + v.slice(5, 9);
    this.value = v;
  });
}

/* ===== ÉTAT CHAMP ===== */
function setFieldState(fieldId, errId, isValid) {
  var field = document.getElementById(fieldId);
  var err = document.getElementById(errId);
  if (!field) return;
  field.classList.remove('err', 'ok');
  field.classList.add(isValid ? 'ok' : 'err');
  if (err) err.classList.toggle('show', !isValid);
}

/* ===== SOUMISSION FORMULAIRE ===== */
function handleSubmit(e) {
  e.preventDefault();
  var valid = true;
  var emailField = document.getElementById('email');
  var ddnField = document.getElementById('ddn');
  var navigationField = document.getElementById('navigation');
  var formContent = document.getElementById('formContent');
  var successMsg = document.getElementById('successMsg');

  if (!emailField || !ddnField || !navigationField || !formContent || !successMsg) {
    return;
  }

  var email = emailField.value;
  var emailOk = validateEmail(email);
  setFieldState('email', 'err-email', emailOk);
  if (!emailOk) valid = false;

  var ddn = ddnField.value;
  var ddnOk = validateDate(ddn);
  setFieldState('ddn', 'err-ddn', ddnOk);
  if (!ddnOk) valid = false;

  var nav = navigationField.value;
  var navOk = nav !== '';
  setFieldState('navigation', 'err-navigation', navOk);
  if (!navOk) valid = false;

  var connuVal = document.querySelector('input[name="connu"]:checked');
  var connuErr = document.getElementById('err-connu');
  if (!connuVal) {
    if (connuErr) connuErr.classList.add('show');
    valid = false;
  } else {
    if (connuErr) connuErr.classList.remove('show');
  }

  if (valid) {
    formContent.style.display = 'none';
    successMsg.classList.add('show');
  }
}

/* ===== RÉINITIALISATION ===== */
function resetForm() {
  var form = document.getElementById('contactForm');
  if (form) form.reset();
  document.querySelectorAll('.form-control').forEach(function (f) {
    f.classList.remove('err', 'ok');
  });
  document.querySelectorAll('.field-err').forEach(function (e) {
    e.classList.remove('show');
  });
  var formContent = document.getElementById('formContent');
  var successMsg = document.getElementById('successMsg');
  if (formContent) formContent.style.display = 'block';
  if (successMsg) successMsg.classList.remove('show');
}

/* ===== MENU DYNAMIQUE + INIT ===== */
document.addEventListener('DOMContentLoaded', function () {
  const navLinks = document.getElementById('navLinks');
  const navContainer = document.querySelector('.nav-container');
  const navToggle = document.getElementById('navToggle');
  const navSearchForm = document.getElementById('navSearchForm');
  const navSearchInput = document.getElementById('navSearchInput');
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const contentSelectors = [
    '.hero-title',
    '.hero-subtitle',
    '.page-hero-title',
    '.page-hero-desc',
    '.section-title',
    '.section-desc',
    '.card-title',
    '.card-text',
    '.text-col h2',
    '.text-col p',
    '.feature-list li',
    '.gallery-caption',
    '.media-caption',
    '.accordion-inner p',
    '.author-bio',
    '.author-meta-item span',
    '.form-label',
    '.contact-list span',
    '.stat-label',
    '.stat-number',
    'td',
    'th'
  ].join(', ');
  const pageCache = {};

  function normalizeText(value) {
    return (value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, ' ')
      .replace(/[^a-z0-9\s'-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function getRoutes() {
    const inPagesFolder = window.location.pathname.includes('/pages/');
    if (inPagesFolder) {
      return [
        { path: '../index.html', key: 'index.html' },
        { path: 'a-propos.html', key: 'a-propos.html' },
        { path: 'gabon.html', key: 'gabon.html' },
        { path: 'ogoue-lolo.html', key: 'ogoue-lolo.html' },
        { path: 'contact.html', key: 'contact.html' }
      ];
    }

    return [
      { path: 'index.html', key: 'index.html' },
      { path: 'pages/a-propos.html', key: 'a-propos.html' },
      { path: 'pages/gabon.html', key: 'gabon.html' },
      { path: 'pages/ogoue-lolo.html', key: 'ogoue-lolo.html' },
      { path: 'pages/contact.html', key: 'contact.html' }
    ];
  }

  function scoreText(text, queryTerms) {
    return queryTerms.reduce(function (total, term) {
      const regex = new RegExp(escapeRegExp(term), 'g');
      const matches = text.match(regex);
      return total + (matches ? matches.length : 0);
    }, 0);
  }

  function clearSearchHits() {
    document.querySelectorAll('.search-hit').forEach(function (element) {
      element.classList.remove('search-hit');
    });
  }

  function searchInCurrentPage(query) {
    clearSearchHits();
    if (navSearchInput) {
      navSearchInput.classList.remove('no-result');
    }

    if (!query) {
      return null;
    }

    const normalizedQuery = normalizeText(query);
    const candidates = document.querySelectorAll(contentSelectors);

    let firstMatch = null;

    candidates.forEach(function (element) {
      const content = normalizeText(element.textContent);
      if (content.includes(normalizedQuery)) {
        element.classList.add('search-hit');
        if (!firstMatch) {
          firstMatch = element;
        }
      }
    });

    if (firstMatch) {
      firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    return firstMatch;
  }

  async function getPageText(route) {
    if (pageCache[route.key]) {
      return pageCache[route.key];
    }

    if (route.key === currentPath) {
      const localText = normalizeText(
        Array.from(document.querySelectorAll(contentSelectors))
          .map(function (element) { return element.textContent; })
          .join(' ')
      );
      pageCache[route.key] = localText;
      return localText;
    }

    const response = await fetch(route.path, { cache: 'no-cache' });
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    doc.querySelectorAll('nav, footer, script').forEach(function (element) {
      element.remove();
    });

    const text = normalizeText(
      Array.from(doc.querySelectorAll(contentSelectors))
        .map(function (element) { return element.textContent; })
        .join(' ')
    );

    pageCache[route.key] = text;
    return text;
  }

  async function searchSite(query) {
    const normalizedQuery = normalizeText(query);
    const queryTerms = normalizedQuery.split(' ').filter(Boolean);

    if (!queryTerms.length) {
      clearSearchHits();
      return;
    }

    const localMatch = searchInCurrentPage(query);
    if (localMatch) {
      return;
    }

    try {
      const routes = getRoutes();
      const otherRoutes = routes.filter(function (route) {
        return route.key !== currentPath;
      });

      const results = await Promise.all(
        otherRoutes.map(async function (route) {
          const text = await getPageText(route);
          return {
            route: route.path,
            score: scoreText(text, queryTerms)
          };
        })
      );

      const bestMatch = results
        .filter(function (result) { return result.score > 0; })
        .sort(function (a, b) { return b.score - a.score; })[0];

      if (bestMatch) {
        const targetUrl = new URL(bestMatch.route, window.location.href);
        targetUrl.searchParams.set('search', query);
        window.location.href = targetUrl.toString();
        return;
      }
    } catch (error) {
      console.warn('Recherche inter-pages indisponible :', error);
    }

    if (navSearchInput) {
      navSearchInput.classList.add('no-result');
    }
  }

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (!navLinks || !navToggle) return;
    const opened = navLinks.classList.toggle('is-open');
    navToggle.classList.toggle('is-open', opened);
    navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
  }

  if (navSearchForm && navSearchInput) {
    navSearchForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      await searchSite(navSearchInput.value.trim());
    });

    navSearchInput.addEventListener('input', function () {
      navSearchInput.classList.remove('no-result');
      if (!navSearchInput.value.trim()) {
        clearSearchHits();
      }
    });

    navSearchInput.addEventListener('search', function () {
      if (!navSearchInput.value.trim()) {
        clearSearchHits();
      }
    });
  }

  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });
  }

  document.addEventListener('click', function (event) {
    if (!navContainer || !navLinks.classList.contains('is-open')) return;
    if (!navContainer.contains(event.target)) {
      closeMenu();
    }
  });

  window.addEventListener('resize', function () {
    if (window.innerWidth > 768) {
      closeMenu();
    }
  });

  initDateInput();

  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', handleSubmit);
  }

  document.querySelectorAll('[data-reset-form]').forEach(function (button) {
    button.addEventListener('click', resetForm);
  });

  document.querySelectorAll('.accordion-btn').forEach(function (button) {
    button.addEventListener('click', function () {
      toggleAccordion(button);
    });
  });

  var emailInput = document.getElementById('email');
  if (emailInput) {
    emailInput.addEventListener('blur', function () {
      setFieldState('email', 'err-email', validateEmail(this.value));
    });
  }

  var ddnEl = document.getElementById('ddn');
  if (ddnEl) {
    ddnEl.addEventListener('blur', function () {
      setFieldState('ddn', 'err-ddn', validateDate(this.value));
    });
  }

  var navEl = document.getElementById('navigation');
  if (navEl) {
    navEl.addEventListener('change', function () {
      setFieldState('navigation', 'err-navigation', this.value !== '');
    });
  }

  const initialSearch = new URLSearchParams(window.location.search).get('search');
  if (initialSearch && navSearchInput) {
    navSearchInput.value = initialSearch;
    searchInCurrentPage(initialSearch);
  }
});
