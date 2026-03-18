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
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
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

  function closeMenu() {
    if (!navLinks || !navToggle) return;
    navLinks.classList.remove('is-open');
    if (navContainer) {
      navContainer.classList.remove('is-open');
    }
    navToggle.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  function toggleMenu() {
    if (!navLinks || !navToggle) return;
    const opened = navLinks.classList.toggle('is-open');
    if (navContainer) {
      navContainer.classList.toggle('is-open', opened);
    }
    navToggle.classList.toggle('is-open', opened);
    navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  }

  if (navToggle) {
    navToggle.addEventListener('click', toggleMenu);
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
});
