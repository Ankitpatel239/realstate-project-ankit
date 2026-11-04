/* =========================================================
   ExamFlow — script.js (v2)
   ========================================================= */
(() => {
  'use strict';

  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const esc = (str) => String(str).replace(/[&<>"']/g, (c) =>
    ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

  /* ---------- Theme ---------- */
  const root = document.documentElement;
  const stored = localStorage.getItem('ef-theme');
  if (stored === 'light' || stored === 'dark') root.dataset.theme = stored;
  const themeBtn = $('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', () => {
    const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
    root.dataset.theme = next;
    localStorage.setItem('ef-theme', next);
  });

  /* ---------- Year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Nav: shadow + progress + back-to-top ---------- */
  const nav = $('#nav');
  const progress = $('#progress');
  const backTop = $('#backTop');

  const onScroll = () => {
    const y = window.scrollY;
    if (nav) nav.classList.toggle('scrolled', y > 8);
    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (y / max) * 100 : 0) + '%';
    }
    if (backTop) backTop.classList.toggle('visible', y > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backTop) backTop.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile nav ---------- */
  const burger = $('#burger');
  const navLinks = $('#navLinks');
  const closeNav = () => {
    if (!navLinks || !burger) return;
    navLinks.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  };
  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      burger.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', String(open));
    });
    $$('a', navLinks).forEach((a) => a.addEventListener('click', closeNav));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeNav(); });
    window.addEventListener('resize', () => { if (window.innerWidth > 900) closeNav(); });
  }

  /* ---------- Reveal on scroll ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in'));
  }

  /* ---------- Animated counters ---------- */
  const animateCount = (el) => {
    const target = parseFloat(el.dataset.target || '0');
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1400;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(tick);
      else el.textContent = target.toFixed(decimals);
    };
    requestAnimationFrame(tick);
  };
  const counters = $$('.count');
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animateCount(entry.target); co.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach((el) => co.observe(el));
  } else {
    counters.forEach(animateCount);
  }

  /* =========================================================
     Participant outcome preview
     ========================================================= */
  const RESULTS = {
    'aarav sharma': { name:'Aarav Sharma',  assessment:'Computer Engineering', marks:88, total:100, date:'12 Mar 2026' },
    'riya iyer': { name:'Riya Iyer', assessment:'Cloud Foundations', marks:34, total:100, date:'12 Mar 2026' },
    'mohammed khan': { name:'Mohammed Khan', assessment:'Data Science', marks:76, total:100, date:'12 Mar 2026' },
    'sneha nair': { name:'Sneha Nair', assessment:'Computer Engineering', marks:45, total:100, date:'12 Mar 2026' }
  };
  const PASS_MARK = 40;
  const gradeFor = (pct) => {
    if (pct >= 90) return 'A+';
    if (pct >= 80) return 'A';
    if (pct >= 70) return 'B';
    if (pct >= 60) return 'C';
    if (pct >= 50) return 'D';
    return 'F';
  };

  const resultForm = $('#resultForm');
  const rollInput  = $('#roll');
  const resultSlot = $('#resultSlot');
  const emptyState = resultSlot ? resultSlot.innerHTML : '';

  const renderNotFound = (name) => {
    resultSlot.innerHTML = `
      <div class="result-empty">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/><path d="M8.5 11h5"/>
        </svg>
        <p><b>No sample outcome found</b> for “${esc(name)}”</p>
        <p class="muted-sm">Check the name or contact our team for help.</p>
      </div>`;
  };

  const renderResult = (name) => {
    const data = RESULTS[name.trim().toLocaleLowerCase()];
    if (!data) { renderNotFound(name); return; }
    const pct = Math.round((data.marks / data.total) * 100);
    const meetsCriteria = data.marks >= PASS_MARK;
    const grade = gradeFor(pct);
    resultSlot.innerHTML = `
      <div class="result-card ${meetsCriteria ? 'pass' : 'fail'}">
        <div class="result-top">
          <div>
            <div class="result-name">${esc(data.name)}</div>
            <div class="result-sub">${esc(data.assessment)} assessment</div>
          </div>
          <span class="verdict ${meetsCriteria ? 'pass' : 'fail'}">${meetsCriteria ? 'Meets criteria' : 'Further review'}</span>
        </div>
        <div class="result-grid">
          <div class="result-cell"><small>Marks</small><b>${data.marks} / ${data.total}</b></div>
          <div class="result-cell"><small>Percentage</small><b>${pct}%</b></div>
          <div class="result-cell"><small>Grade</small><b>${grade}</b></div>
        </div>
        <div class="result-foot">
          <span>Published ${esc(data.date)}</span>
          <span class="chip ${meetsCriteria ? 'ok' : 'warn'}">${meetsCriteria ? 'Complete' : 'Next steps available'}</span>
        </div>
      </div>`;
  };

  if (resultForm && rollInput && resultSlot) {
    resultForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = rollInput.value.trim();
      if (!name) { resultSlot.innerHTML = emptyState; rollInput.focus(); return; }
      renderResult(name);
    });
    $$('.try').forEach((btn) => {
      btn.addEventListener('click', () => {
        rollInput.value = btn.dataset.name;
        if (typeof resultForm.requestSubmit === 'function') resultForm.requestSubmit();
        else resultForm.dispatchEvent(new Event('submit', { cancelable: true }));
      });
    });
  }

  /* =========================================================
     Admin dashboard tabs
     ========================================================= */
  const tabs = $$('.tab');
  const panels = $$('.tab-panel');
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      panels.forEach((p) => p.classList.remove('active'));
      const target = document.getElementById('tab-' + tab.dataset.tab);
      if (target) target.classList.add('active');
    });
  });

  /* =========================================================
     Platform tour tabs
     ========================================================= */
  const tourTabs = $$('.tour-tab');
  const tourPanels = $$('.tour-panel');
  tourTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tourTabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      tourPanels.forEach((p) => p.classList.remove('active'));
      const target = document.querySelector(`[data-tour-panel="${tab.dataset.tourTab}"]`);
      if (target) target.classList.add('active');
    });
  });

  /* =========================================================
     Pricing billing toggle
     ========================================================= */
  const billingBtns = $$('[data-billing]');
  const priceEls = $$('[data-price-cycle]');
  const billingLabels = $$('[data-billing-label]');
  billingBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      billingBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const mode = btn.dataset.billing;
      priceEls.forEach((el) => {
        const raw = mode === 'annual' ? el.dataset.priceAnnual : el.dataset.priceCycle;
        const num = parseInt(raw, 10);
        el.textContent = '₹' + num.toLocaleString('en-IN');
      });
      billingLabels.forEach((l) => {
        l.textContent = mode === 'annual' ? '/ year' : '/ cycle';
      });
    });
  });

  /* =========================================================
     Contact form validation
     ========================================================= */
  const contactForm = $('#contactForm');
  const formNote = $('#formNote');
  if (contactForm) {
    const setError = (fieldId, message) => {
      const input = document.getElementById(fieldId);
      if (!input) return;
      const field = input.closest('.field');
      const err = field ? field.querySelector('.err') : null;
      if (field) field.classList.toggle('invalid', Boolean(message));
      if (err) err.textContent = message || '';
    };
    const clearErrors = () => {
      $$('.field', contactForm).forEach((f) => f.classList.remove('invalid'));
      $$('.err', contactForm).forEach((e) => (e.textContent = ''));
      if (formNote) { formNote.textContent = ''; formNote.classList.remove('ok'); }
    };
    $$('input, select, textarea', contactForm).forEach((input) => {
      input.addEventListener('input', () => setError(input.id, ''));
      input.addEventListener('change', () => setError(input.id, ''));
    });
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors();
      const name    = $('#cName').value.trim();
      const email   = $('#cEmail').value.trim();
      const org     = $('#cOrg').value.trim();
      const service = $('#cService').value;
      const msg     = $('#cMsg').value.trim();
      let valid = true;
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (name.length < 2) { setError('cName', 'Please enter your full name.'); valid = false; }
      if (!emailRe.test(email)) { setError('cEmail', 'Enter a valid work email address.'); valid = false; }
      if (org.length < 2) { setError('cOrg', 'Please enter your organisation name.'); valid = false; }
      if (!service) { setError('cService', 'Please choose a service.'); valid = false; }
      if (msg.length < 10) { setError('cMsg', 'Tell us a little more (at least 10 characters).'); valid = false; }
      if (!valid) {
        const firstInvalid = $('.field.invalid input, .field.invalid select, .field.invalid textarea', contactForm);
        if (firstInvalid) firstInvalid.focus();
        return;
      }
      // Demo only — wire to your API
      if (formNote) {
        formNote.textContent = `Thanks, ${name.split(' ')[0]}! Your request is in — we'll reply to ${email} within 2 working days.`;
        formNote.classList.add('ok');
      }
      contactForm.reset();
    });
  }

  /* =========================================================
     Newsletter form
     ========================================================= */
  const newsletterForm = $('#newsletterForm');
  const nlNote = $('#nlNote');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = $('#nlEmail').value.trim();
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (nlNote) { nlNote.textContent = ''; nlNote.classList.remove('ok'); }
      if (!emailRe.test(email)) {
        if (nlNote) nlNote.textContent = 'Please enter a valid email.';
        return;
      }
      if (nlNote) {
        nlNote.textContent = 'Subscribed! Check your inbox to confirm.';
        nlNote.classList.add('ok');
      }
      newsletterForm.reset();
    });
  }
})();