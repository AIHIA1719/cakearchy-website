document.addEventListener('DOMContentLoaded', () => {
  const { C, $, $$, availability, addDays, notice, money, basket, toast, short, iso } = window.CA;
  const nextSat = (() => { const d = new Date(); d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7)); if ((d - new Date()) / 864e5 < C.leadTimes.quick) d.setDate(d.getDate() + 7); return iso(d); })();
  const item = new URLSearchParams(location.search).get('item');
  const q = C.quickBakes.find(x => x.id === item);

  // Listing
  $('#quick-grid').innerHTML = C.quickBakes.map(x => {
    const a = availability(nextSat, 'quick'); const from = Math.min(...x.sizes.map(s => s.price));
    return `<article class="card qb"><img src="${x.img}" alt="${x.name}" loading="lazy"><span class="tag butter">Ready in 3 days</span>
      <div class="card-body"><h4>${x.name}</h4><p class="small muted">${x.sub}</p></div>
      <div class="card-foot"><span class="price">${x.sizes.length > 1 ? 'From ' : ''}${money(from)}</span><span class="slots">${a.left ?? 0} left ${short(nextSat).split(' ')[0]}</span></div>
      <div style="padding:0 20px 20px"><a class="btn btn-primary btn-block" href="quick-bakes.html?item=${x.id}">Choose</a></div></article>`;
  }).join('');
  if (!q) return;

  // Detail
  $('#list').classList.add('hidden'); $('#detail').classList.remove('hidden');
  document.title = q.name + ' · Cakearchy';
  $('#p-img').src = q.img; $('#p-img').alt = q.name;
  $('#p-name').textContent = q.name.toUpperCase();
  $('#p-desc').textContent = q.desc;
  $('#p-slots').textContent = `${availability(nextSat, 'quick').left ?? 0} left ${short(nextSat)}`;

  const choice = (type, name, val, title, note, amt, checked) => `<label class="choice"><input type="${type}" name="${name}" value="${val}" ${checked ? 'checked' : ''}><span class="${type === 'radio' ? 'dot' : 'box'}"></span><span class="txt"><strong>${title}</strong><small>${note}</small></span><span class="amt">${amt}</span></label>`;
  $('#p-sizes').innerHTML = q.sizes.map((s, i) => choice('radio', 'size', s.id, s.name, s.note, money(s.price), i === q.sizes.length - 1)).join('');
  const chipGroup = (el, list) => { el.innerHTML = list.map((v, i) => `<button type="button" class="chip" aria-pressed="${i === 0}">${v}</button>`).join('');
    el.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; $$('.chip', el).forEach(c => c.setAttribute('aria-pressed', c === b)); }); };
  chipGroup($('#p-flav'), q.flavours); chipGroup($('#p-col'), q.colours);
  if (q.flavours.length < 2) $('#p-flav-wrap').classList.add('hidden');
  if (q.colours.length < 2) $('#p-col-wrap').classList.add('hidden');
  if (q.message) $('#p-msg-wrap').classList.remove('hidden');
  $('#p-addons').innerHTML = C.quickAddOns.map(a => choice('checkbox', 'addon', a.id, a.name, a.note, '+' + money(a.price), false)).join('');
  $('#p-allergy').innerHTML = notice('info', 'Allergies?', `${q.name} contains ${q.allergens}, and is made in a kitchen that handles nuts. Need it made without something? <a href="order.html">Use a custom order</a> instead.`);

  const date = $('#p-date'); date.min = addDays(C.leadTimes.quick); date.value = nextSat;
  const checkDate = () => { const a = availability(date.value, 'quick');
    $('#p-date-msg').innerHTML = a.status === 'free' ? `<span class="pill good">✓ ${a.title}. ${a.body}</span>` : `<span class="pill warn">${a.title}. ${a.body}</span>`; return a.status === 'free'; };
  date.addEventListener('change', checkDate); checkDate();

  const calc = () => { const s = q.sizes.find(x => x.id === $('input[name=size]:checked').value);
    const add = $$('input[name=addon]:checked').reduce((n, i) => n + C.quickAddOns.find(a => a.id === i.value).price, 0);
    $('#p-total').textContent = money(s.price + add); return { s, add }; };
  $('#p-form').addEventListener('change', calc); calc();

  $('#p-form').addEventListener('submit', e => {
    e.preventDefault();
    if (!checkDate()) { toast('Pick a date that\'s free'); return; }
    const { s, add } = calc();
    const flav = $('#p-flav .chip[aria-pressed=true]')?.textContent; const col = $('#p-col .chip[aria-pressed=true]')?.textContent;
    const addons = $$('input[name=addon]:checked').map(i => C.quickAddOns.find(a => a.id === i.value).name);
    basket.add({ id: q.id, name: q.name + (q.sizes.length > 1 ? ' · ' + s.name.toLowerCase() : ''), img: q.img, price: s.price + add, qty: 1, date: date.value,
      details: [q.flavours.length > 1 ? flav : null, q.colours.length > 1 ? col : null, $('#p-msg').value ? `"${$('#p-msg').value}"` : null, ...addons].filter(Boolean).join(' · '), allergens: q.allergens });
    toast('Added to your basket');
    setTimeout(() => location.href = 'basket.html', 600);
  });
});
