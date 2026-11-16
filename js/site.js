/* Shared bits: header, footer, basket, availability and delivery helpers. */
(function () {
  const C = window.CAKEARCHY;

  const CROWN = `<svg viewBox="0 0 132 108" aria-hidden="true"><path d="M22 100L14 34l24 28 6-40 16 34 6-44 6 44 16-34 6 40 24-28-8 66z" fill="#E34278" stroke="#1D1816" stroke-width="6" stroke-linejoin="round"/><path d="M19 80h94" stroke="#1D1816" stroke-width="6" stroke-linecap="round"/><g fill="#F7DD9E" stroke="#1D1816" stroke-width="4"><circle cx="14" cy="34" r="8"/><circle cx="44" cy="22" r="8"/><circle cx="66" cy="12" r="8"/><circle cx="88" cy="22" r="8"/><circle cx="118" cy="34" r="8"/></g></svg>`;
  const SPARKLE = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1.5 9 3 10.5 12 12-9 1.5-10.5 3-12 12-1.5-9-3-10.5-12-12 9-1.5 10.5-3 12-12z" fill="#1D1816"/></svg>`;
  const ICON = {
    bag: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8L5 8z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M9 10V7a3 3 0 0 1 6 0v3" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>',
    menu: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    close: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>',
    back: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    info: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2.2"/><path d="M12 11v6M12 7.5v.5" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    ok: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><circle cx="12" cy="12" r="9.5" stroke="currentColor" stroke-width="2.2"/><path d="M7.5 12.3l3 3 6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    warn: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 3.5l9.5 16.5h-19L12 3.5z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 10v4.5M12 17.2v.3" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>',
    tick: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  // ---------- Storage (safe) ----------
  const store = {
    get(k, d) { try { const v = localStorage.getItem('cakearchy:' + k); return v ? JSON.parse(v) : d; } catch (e) { return store._mem[k] ?? d; } },
    set(k, v) { try { localStorage.setItem('cakearchy:' + k, JSON.stringify(v)); } catch (e) { store._mem[k] = v; } },
    _mem: {}
  };

  // ---------- Basket ----------
  const basket = {
    items() { return store.get('basket', []); },
    save(items) { store.set('basket', items); renderCount(); },
    add(item) { const items = basket.items(); items.push({ ...item, key: Date.now() + Math.random() }); basket.save(items); },
    remove(key) { basket.save(basket.items().filter(i => i.key !== key)); },
    clear() { basket.save([]); },
    count() { return basket.items().reduce((n, i) => n + (i.qty || 1), 0); },
    total() { return basket.items().reduce((n, i) => n + i.price * (i.qty || 1), 0); }
  };

  // ---------- Dates & availability ----------
  const DAY = 864e5;
  const today = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d; };
  const iso = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const parse = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const daysUntil = s => Math.round((parse(s) - today()) / DAY);
  const pretty = (s, opts) => parse(s).toLocaleDateString('en-GB', opts || { weekday: 'long', day: 'numeric', month: 'long' });
  const short = s => parse(s).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });
  const addDays = (n) => { const d = today(); d.setDate(d.getDate() + n); return iso(d); };

  function availability(dateStr, type = 'celebration') {
    if (!dateStr) return { status: 'none' };
    const lead = C.leadTimes[type] ?? C.leadTimes.celebration;
    const days = daysUntil(dateStr);
    if (days < 0) return { status: 'past', title: 'That date has been and gone', body: 'Pick a date in the future.' };
    if (C.bookedDates.includes(dateStr)) return { status: 'full', title: `${short(dateStr)} is fully booked`, body: 'Sorry! Try another date, or message me in case something frees up.' };
    if (days < lead) {
      const quickOk = type !== 'quick' && days >= C.leadTimes.quick;
      return { status: 'tooSoon', title: `That's ${days === 0 ? 'today' : days === 1 ? 'tomorrow' : 'in ' + days + ' days'}`,
        body: quickOk ? `Custom cakes need ${lead} days, but Quick bakes are ready in ${C.leadTimes.quick}.` : `I need ${lead} days for this one. Message me and I'll see if I can squeeze you in.`, quickOk };
    }
    const cap = type === 'quick' ? C.capacity.quickPerWeekend : C.capacity.customPerWeekend;
    const taken = (C.demoTaken[dateStr] || 0) + (store.get('taken', {})[dateStr] || 0);
    const left = Math.max(0, cap - taken);
    if (left === 0) return { status: 'full', title: `${short(dateStr)} is fully booked`, body: 'Try a day either side.' };
    return { status: 'free', left, title: `${short(dateStr)} is free`, body: left <= 2 ? `Only ${left} slot${left > 1 ? 's' : ''} left that day.` : `${left} slots left that day.` };
  }

  // ---------- Delivery ----------
  function deliveryQuote(postcode) {
    const pc = (postcode || '').toUpperCase().replace(/\s+/g, '');
    const m = pc.match(/^([A-Z]{1,2}\d{1,2})/);
    if (!m) return { ok: false, msg: 'Enter a postcode to check the distance.' };
    let dist = C.delivery.districtMiles[m[1]];
    if (dist == null && m[1].length > 3) dist = C.delivery.districtMiles[m[1].slice(0, 3)];
    if (dist == null) return { ok: false, far: true, msg: 'That looks further than 5 miles. Collection only, or message me.' };
    const zone = C.delivery.zones.find(z => dist <= z.maxMiles);
    if (!zone) return { ok: false, far: true, dist, msg: `About ${dist} miles away. That's outside my 5 mile delivery area, so collection only, or message me.` };
    return { ok: true, dist, fee: zone.fee, msg: `About ${dist} miles away: £${zone.fee} delivery` };
  }

  // ---------- UI helpers ----------
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const money = n => '£' + (Number.isInteger(n) ? n : n.toFixed(2));
  const notice = (type, title, body) => `<div class="notice ${type}" role="status">${ICON[type === 'good' ? 'ok' : type === 'warn' ? 'warn' : 'info']}<div><strong>${title}</strong><p>${body}</p></div></div>`;
  function toast(msg) { const t = document.createElement('div'); t.className = 'toast'; t.textContent = msg; document.body.appendChild(t); setTimeout(() => t.remove(), 2400); }
  function renderCount() { $$('[data-basket-count]').forEach(el => { const n = basket.count(); el.textContent = n; el.hidden = n === 0; }); }

  function header() {
    const el = $('#site-header'); if (!el) return;
    el.outerHTML = `
    <div class="mock-banner">Preview site: orders and payments aren't live yet.</div>
    <header class="site-header">
      <div class="wrap">
        <a class="logo" href="index.html" aria-label="Cakearchy home">${CROWN}<span class="wordmark">CAKEARCHY</span></a>
        <nav class="nav" aria-label="Main">
          <a class="hot" href="quick-bakes.html">Quick bakes</a>
          <a href="index.html#cakes">Cakes</a>
          <a href="index.html#weddings">Weddings</a>
          <a href="index.html#how">How it works</a>
          <a href="allergens.html">Allergens</a>
        </nav>
        <div class="header-actions">
          <a class="icon-btn" href="basket.html" aria-label="Basket">${ICON.bag}<span class="count" data-basket-count hidden>0</span></a>
          <a class="btn btn-primary" href="order.html">Order a cake</a>
          <button class="icon-btn menu" aria-label="Open menu" aria-expanded="false" data-menu-open>${ICON.menu}</button>
        </div>
      </div>
    </header>
    <div class="mobile-menu" data-open="false" role="dialog" aria-label="Menu">
      <div class="top"><a class="logo" href="index.html">${CROWN}<span class="wordmark" style="color:#fff">CAKEARCHY</span></a>
        <button class="icon-btn" style="background:var(--bg-accent)" aria-label="Close menu" data-menu-close>${ICON.close}</button></div>
      <a class="big" href="quick-bakes.html">QUICK BAKES</a>
      <a class="big" href="index.html#cakes">CAKES</a>
      <a class="big" href="index.html#weddings">WEDDINGS</a>
      <a class="big" href="index.html#how">HOW IT WORKS</a>
      <a class="big" href="allergens.html">ALLERGENS</a>
      <a class="btn btn-secondary btn-lg btn-block" style="margin-top:32px" href="order.html">Order a cake</a>
      <p style="margin-top:16px;font-weight:700">${C.business.email} · @cakearchy</p>
    </div>`;
    const setH = () => { const h = $('.site-header'); if (h) document.documentElement.style.setProperty('--header-h', h.offsetHeight + 'px'); };
    setH(); addEventListener('resize', setH); document.fonts && document.fonts.ready.then(setH);
    const menu = $('.mobile-menu');
    $('[data-menu-open]').addEventListener('click', () => { menu.dataset.open = 'true'; document.body.style.overflow = 'hidden'; });
    $('[data-menu-close]').addEventListener('click', () => { menu.dataset.open = 'false'; document.body.style.overflow = ''; });
    $$('.mobile-menu a').forEach(a => a.addEventListener('click', () => { menu.dataset.open = 'false'; document.body.style.overflow = ''; }));
  }

  function footer() {
    const el = $('#site-footer'); if (!el) return;
    el.outerHTML = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-top">
          <div style="display:grid;gap:12px;align-content:start">
            <span class="logo" style="justify-self:start">${CROWN}<span class="wordmark" style="font-size:40px">CAKEARCHY</span></span>
            <span class="hand" style="color:var(--pink-200)">Thanks for being part of the Cakearchy!</span>
          </div>
          <div class="footer-cols">
            <div><h5>CAKES</h5><a href="quick-bakes.html">Quick bakes</a><a href="order.html?occasion=birthday">Birthday</a><a href="order.html?occasion=kids">Kids</a><a href="order.html?occasion=baby">Baby</a><a href="order.html?occasion=wedding">Wedding</a></div>
            <div><h5>INFO</h5><a href="index.html#how">How it works</a><a href="allergens.html">Allergens</a><a href="index.html#faq">FAQs</a><a href="track.html">Track an order</a></div>
            <div><h5>SAY HELLO</h5><a href="mailto:${C.business.email}">${C.business.email}</a><a href="${C.business.instagram}">Instagram</a><span>Harpenden, Herts</span></div>
          </div>
        </div>
        <p class="legal">© ${new Date().getFullYear()} Cakearchy · Baked in a home kitchen in Harpenden that also handles nuts, gluten, eggs and dairy.</p>
      </div>
    </footer>`;
  }

  document.addEventListener('DOMContentLoaded', () => { header(); footer(); renderCount(); });

  window.CA = { C, store, basket, availability, deliveryQuote, daysUntil, pretty, short, addDays, iso, parse, today, $, $$, money, notice, toast, ICON, CROWN, SPARKLE, renderCount };
})();
