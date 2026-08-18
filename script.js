// ===== Nav scroll state =====
const nav = document.querySelector('.nav');
const onScroll = () => {
  if (window.scrollY > 40) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ===== Mobile menu =====
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => io.observe(el));

// stagger index for children of .reveal-stagger
document.querySelectorAll('.reveal-stagger').forEach(group => {
  Array.from(group.children).forEach((child, i) => {
    child.style.setProperty('--i', i);
    child.classList.add('reveal');
    io.observe(child);
  });
});

// ===== Hero particles =====
document.querySelectorAll('.hero-particles').forEach(container => {
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('span');
    p.className = 'hero-particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.bottom = '-10px';
    p.style.animationDuration = (10 + Math.random() * 14) + 's';
    p.style.animationDelay = (Math.random() * 14) + 's';
    p.style.opacity = (0.25 + Math.random() * 0.4).toFixed(2);
    container.appendChild(p);
  }
});

// ===== Contact form validation =====
const form = document.getElementById('quote-form');
if (form) {
  const status = document.getElementById('form-status');
  const required = ['fullName', 'email', 'phone', 'service', 'message'];

  const showError = (field, msg) => {
    const group = form.querySelector(`[data-group="${field}"]`);
    if (!group) return;
    group.classList.add('invalid');
    const err = group.querySelector('.form-error');
    if (err) err.textContent = msg;
  };
  const clearError = (field) => {
    const group = form.querySelector(`[data-group="${field}"]`);
    if (!group) return;
    group.classList.remove('invalid');
    const err = group.querySelector('.form-error');
    if (err) err.textContent = '';
  };

  form.querySelectorAll('input, select, textarea').forEach(el => {
    el.addEventListener('input', () => clearError(el.name));
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;
    required.forEach(clearError);

    const data = Object.fromEntries(new FormData(form).entries());

    if (!data.fullName || data.fullName.trim().length < 2) {
      showError('fullName', 'Please enter your full name.'); valid = false;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '');
    if (!emailOk) { showError('email', 'Please enter a valid email address.'); valid = false; }

    const phoneOk = /^[0-9+()\s-]{7,}$/.test(data.phone || '');
    if (!phoneOk) { showError('phone', 'Please enter a valid telephone number.'); valid = false; }

    if (!data.service) { showError('service', 'Please select a service.'); valid = false; }

    if (!data.message || data.message.trim().length < 10) {
      showError('message', 'Please tell us a little more (10+ characters).'); valid = false;
    }

    status.classList.remove('show', 'success', 'error');

    if (!valid) {
      status.textContent = 'Please check the highlighted fields and try again.';
      status.classList.add('show', 'error');
      return;
    }

    // ---------------------------------------------------------------
    // BACKEND NOT YET CONNECTED.
    // Wire this up to Formspree, EmailJS, or your own API endpoint.
    // Destination inbox: uniquesecurity28@gmail.com
    //
    // Example (Formspree):
    // fetch('https://formspree.io/f/YOUR_FORM_ID', {
    //   method: 'POST',
    //   headers: { 'Accept': 'application/json' },
    //   body: new FormData(form)
    // }).then(...)
    // ---------------------------------------------------------------

    status.textContent = 'Thanks — your request has been received. We\'ll be in touch shortly.';
    status.classList.add('show', 'success');
    form.reset();
  });
}
