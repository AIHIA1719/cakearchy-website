document.addEventListener('DOMContentLoaded', () => {
  const { C, $, $$, availability, addDays, notice, money, SPARKLE } = window.CA;

  $$('[data-sparkle]').forEach(s => s.innerHTML = SPARKLE);

  // Finder
  const occ = $('#f-occ');
  occ.innerHTML = C.occasions.map(o => `<option value="${o.id}" ${o.id === 'kids' ? 'selected' : ''}>${o.name}</option>`).join('') + '<option value="quick">Quick bake</option>';
  const date = $('#f-date');
  date.min = addDays(0);
  date.value = addDays(21);
  const leadFor = id => id === 'quick' ? 'quick' : (C.occasions.find(o => o.id === id) || {}).lead || 'celebration';

  $('#finder').addEventListener('submit', e => {
    e.preventDefault();
    const a = availability(date.value, leadFor(occ.value));
    const res = $('#finder-result');
    const params = new URLSearchParams({ occasion: occ.value, date: date.value, guests: $('#f-guests').value });
    if (a.status === 'free') {
      const href = occ.value === 'quick' ? 'quick-bakes.html' : `order.html?${params}`;
      res.innerHTML = `<span class="pill good">✓ ${a.title}. ${a.body}</span><a class="btn btn-primary" href="${href}">Start my order</a>`;
    } else if (a.status === 'tooSoon' && a.quickOk) {
      res.innerHTML = `<span class="pill warn">${a.title}. ${a.body}</span><a class="btn btn-secondary" href="quick-bakes.html">See quick bakes</a>`;
    } else {
      res.innerHTML = `<span class="pill warn">${a.title}. ${a.body}</span><a class="btn btn-outline" href="mailto:${C.business.email}">Message me</a>`;
    }
  });

  // Tiles
  $('#tiles').innerHTML = C.occasions.map(o => `
    <a class="tile" href="${o.id === 'cupcakes' ? 'quick-bakes.html' : 'order.html?occasion=' + o.id}">
      <img src="${o.img}" alt="" loading="lazy"><div><strong>${o.name.toUpperCase()}</strong><span>From ${money(o.from)}</span></div>
    </a>`).join('') + `
    <a class="tile tile-naughty" href="naughty-step.html" aria-label="The Naughty Step, 18 plus">
      <div class="tile-18"><span class="pill18">18+</span><span class="tile-hush">Ruder words.<br>Same cake.</span></div>
      <div><strong>NAUGHTY STEP</strong><span>From ${money(((C.naughty || [])[0] || { from: 45 }).from)}</span></div>
    </a>`;

  // Quick bakes
  const sat = (() => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7)); return window.CA.iso(d); })();
  $('#quick-grid').innerHTML = C.quickBakes.map(q => {
    const a = availability(sat, 'quick');
    const from = Math.min(...q.sizes.map(s => s.price));
    return `<article class="card qb">
      <img src="${q.img}" alt="${q.name}" loading="lazy"><span class="tag butter">Ready in 3 days</span>
      <div class="card-body"><h4>${q.name}</h4><p class="small muted">${q.sub}</p></div>
      <div class="card-foot"><span class="price">${q.sizes.length > 1 ? 'From ' : ''}${money(from)}</span><span class="slots">${a.left ?? 0} left Sat</span></div>
      <div style="padding:0 20px 20px"><a class="btn btn-primary btn-block" href="quick-bakes.html?item=${q.id}">Choose</a></div>
    </article>`;
  }).join('');

  // Lead cards
  const lc = [
    ['Quick bakes', `${C.leadTimes.quick} days`, 'Mini cakes, 6 inch favourites and cupcakes. Buy straight away.', 'var(--bg-accent)'],
    ['Celebration cakes', `${C.leadTimes.celebration} days+`, 'Birthday, kids, baby and Him/Her cakes with your colours and message.', 'var(--bg-brand-soft)'],
    ['Bespoke and 3D', '3 to 4 weeks', 'Totally custom designs, sculpted toppers and big parties.', 'var(--bg-brand-subtle)'],
    ['Weddings', '3 to 12 months', 'Tastings and a design consultation. Summer dates go first.', 'var(--bg-page)']
  ];
  $('#lead-cards').innerHTML = lc.map(([t, w, d, bg]) => `<div class="lead-card" style="background:${bg}"><span class="label muted">${t}</span><span class="big">${w.toUpperCase()}</span><p>${d}</p></div>`).join('');

  // Signature
  $('#sig-grid').innerHTML = C.signature.map(s => `
    <article class="card">
      <img src="${s.img}" alt="${s.name}" loading="lazy">
      <div class="card-body"><span><span class="tag">${s.occasion}</span></span><h3>${s.name}</h3><p class="small muted">${s.desc}</p></div>
      <div class="card-foot"><span class="price brand" style="font-size:22px">From ${money(s.from)}</span>
        <a class="btn btn-primary" href="order.html?occasion=${(C.occasions.find(o => o.name === s.occasion) || {}).id || 'birthday'}&cake=${s.id}">Order</a></div>
    </article>`).join('');
});
