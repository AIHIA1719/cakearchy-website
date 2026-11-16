/* Request builder: 6 steps with autosave, live price guide and honest allergy logic. */
document.addEventListener('DOMContentLoaded', () => {
  const { C, $, $$, store, availability, addDays, notice, money, deliveryQuote, short, pretty, ICON, daysUntil } = window.CA;
  $('#back').innerHTML = ICON.back;

  const params = new URLSearchParams(location.search);
  const fresh = {
    step: 0, occasion: 'birthday', who: '', date: addDays(21), size: 'm8', addons: [], start: 'signature', cake: '', colours: [], message: '', notes: '',
    needs: 'no', avoid: [], diet: [], severity: 'mild', flavour: 'Vanilla', other: '', get: 'collect', postcode: '', slot: '10 to 11am',
    name: '', mobile: '', email: '', texts: true, surprise: false, allergenOk: false, files: 0
  };
  let S = Object.assign({}, fresh, store.get('draft', {}));
  if (params.get('occasion')) { S = Object.assign({}, fresh, { occasion: params.get('occasion') === 'quick' ? 'birthday' : params.get('occasion') }); }
  if (params.get('date')) S.date = params.get('date');
  if (params.get('cake')) { S.cake = params.get('cake'); S.start = 'signature'; }
  if (!S.cake) S.cake = (C.signature.find(s => s.occasion.toLowerCase().replace('/', '') === S.occasion) || C.signature[0]).id;

  const save = () => { store.set('draft', S); $('#saved').textContent = 'Saved'; };
  const occ = () => C.occasions.find(o => o.id === S.occasion) || C.occasions[0];
  const isWedding = () => S.occasion === 'wedding';
  const leadType = () => S.start === 'own' && S.occasion !== 'wedding' ? 'bespoke' : occ().lead === 'quick' ? 'celebration' : occ().lead;

  // ---------- Allergy assessment ----------
  function allergy() {
    if (S.needs !== 'yes') return { block: false, extra: 0, notes: [] };
    const picked = C.allergens.filter(a => S.avoid.includes(a.id));
    const severe = S.severity === 'severe';
    const blockers = picked.filter(a => a.can === 'no' || (severe && a.can === 'ingredients'));
    const notes = [];
    if (blockers.length) {
      const names = blockers.map(b => b.name.toLowerCase()).join(' and ');
      const nutty = blockers.some(b => b.id === 'nuts' || b.id === 'peanuts');
      notes.push(['warn', 'I can\'t make this one safely', nutty && !severe
        ? `My kitchen handles nuts every day, so I can't make a cake free from ${names}, even for a mild allergy. I'd rather tell you now than risk it.`
        : `My kitchen handles ${names}, so I can't promise a cake that's safe for a serious allergy. I'd rather tell you now than risk it.`]);
      return { block: true, extra: 0, notes };
    }
    picked.forEach(a => notes.push([a.can === 'yes' ? 'good' : 'info', a.ok, a.okBody]));
    if (S.diet.includes('Vegan')) notes.push(['good', 'Vegan: can do', 'Vegan sponge and buttercream. Made in a kitchen that uses eggs and dairy.']);
    return { block: false, extra: picked.reduce((n, a) => n + (a.extra || 0), 0) + (S.diet.includes('Vegan') ? 5 : 0), notes };
  }

  // ---------- Price ----------
  function price() {
    if (isWedding()) return { text: 'From £250', n: null };
    const size = C.sizes.find(s => s.id === S.size);
    if (S.step === 0) return { text: 'From ' + money(occ().from), n: null };
    let n = size.price + S.addons.reduce((t, id) => t + C.addOns.find(a => a.id === id).price, 0);
    if (S.message) n += 3;
    const al = allergy(); if (al.block) return { text: 'Let\'s talk first', n: null };
    n += al.extra;
    const dq = S.get === 'deliver' ? deliveryQuote(S.postcode) : null; if (dq && dq.ok) n += dq.fee;
    if (S.start === 'own') return { text: `${money(n)} to ${money(Math.round(n * 1.3))}`, n };
    return { text: money(n), n };
  }

  // ---------- Bits ----------
  const choice = (type, name, val, title, note, amt, checked) => `<label class="choice"><input type="${type}" name="${name}" value="${val}" ${checked ? 'checked' : ''}><span class="${type === 'radio' ? 'dot' : 'box'}"></span><span class="txt"><strong>${title}</strong>${note ? `<small>${note}</small>` : ''}</span>${amt ? `<span class="amt">${amt}</span>` : ''}</label>`;
  const chips = (name, list, sel, multi) => `<div class="chips" data-chips="${name}" data-multi="${multi ? 1 : 0}">${list.map(v => `<button type="button" class="chip" aria-pressed="${multi ? sel.includes(v) : sel === v}" data-v="${v}">${v}</button>`).join('')}</div>`;
  const field = (id, label, val, attrs = '') => `<div class="field"><label class="label" for="${id}">${label}</label><input class="input" id="${id}" name="${id}" value="${(val || '').replace(/"/g, '&quot;')}" ${attrs}></div>`;
  const label = t => `<span class="label muted">${t}</span>`;

  const steps = [
    { title: () => 'WHAT ARE WE CELEBRATING?', render: () => {
      const a = availability(S.date, leadType());
      return `${label('Occasion')}${chips('occasion', C.occasions.filter(o => o.id !== 'cupcakes').map(o => o.name), occ().name)}
        ${field('who', isWedding() ? 'Your names' : 'Whose party is it?', S.who, 'placeholder="' + (isWedding() ? 'Sam and Alex' : 'Ava, turning 5') + '"')}
        ${field('date', 'Date', S.date, `type="date" min="${addDays(0)}"`)}
        <div id="date-msg">${a.status === 'free' ? notice('good', a.title, a.body + ' Send your request soon to hold it.') : a.status === 'none' ? '' : notice('warn', a.title, a.body + (a.quickOk ? ' <a href="quick-bakes.html" style="color:#fff">See quick bakes</a>' : ''))}</div>
        ${a.status === 'free' ? notice('info', daysUntil(S.date) >= 14 ? 'You\'re in plenty of time' : 'Good timing', `I need at least ${C.leadTimes[leadType()]} days' notice for this. You've got ${daysUntil(S.date)}.`) : ''}`;
    }, valid: () => availability(S.date, leadType()).status === 'free' || 'Pick a date that\'s free' },

    { title: () => isWedding() ? 'HOW MANY GUESTS?' : 'HOW MANY PEOPLE?', render: () => isWedding()
      ? `<p class="muted">Weddings are all quoted individually, so just give me a rough idea.</p>
        ${[['w60', 'Two tiers', 'Serves around 60', 'From £250'], ['w100', 'Three tiers', 'Serves around 100', 'From £380'], ['w150', 'Four tiers or a dessert table', 'Serves 150+', 'From £550']].map(([v, t, n, p], i) => choice('radio', 'wsize', v, t, n, p, (S.wsize || 'w100') === v)).join('')}
        ${notice('info', 'Tastings', 'Once you\'ve sent this, I\'ll invite you to a tasting box of four flavours (£25, taken off your final price).')}`
      : `<p class="muted">Party slices are smaller than dessert slices, so I've sized these for parties.</p>
        ${C.sizes.map(s => choice('radio', 'size', s.id, s.name, s.note, money(s.price), S.size === s.id)).join('')}
        ${notice('info', 'Not sure?', 'For a kids\' party of 25, an 8 inch cake leaves a few slices for the grown-ups too.')}
        ${label('Add-ons')}${C.addOns.map(a => choice('checkbox', 'addon', a.id, a.name, a.note + ' · +' + money(a.price), '', S.addons.includes(a.id))).join('')}` },

    { title: () => 'HOW SHOULD IT LOOK?', render: () => `
      ${choice('radio', 'start', 'signature', 'Start from a signature cake', 'Pick one and I\'ll make it yours', '', S.start === 'signature')}
      <div class="thumbs ${S.start === 'signature' ? '' : 'hidden'}" id="thumbs">${C.signature.map(s => `<button type="button" aria-pressed="${S.cake === s.id}" data-cake="${s.id}" aria-label="${s.name}"><img src="${s.img}" alt=""></button>`).join('')}</div>
      ${S.start === 'signature' ? `<h4>${(C.signature.find(s => s.id === S.cake) || {}).name || ''} selected</h4>` : ''}
      ${choice('radio', 'start', 'own', 'Something totally my own', 'Upload ideas and I\'ll design it', '', S.start === 'own')}
      <label class="upload"><input type="file" accept="image/*" multiple hidden id="files">
        <span style="font-size:28px">⬆</span><strong>Add inspiration photos</strong><span class="small muted">${S.files ? S.files + ' added. ' : ''}Screenshots, Pinterest links or a photo of the invite. Up to 5.</span></label>
      ${field('pin', 'Or paste a Pinterest or Instagram link', S.pin)}
      ${label('Colours')}${chips('colours', C.colours, S.colours, true)}
      ${field('message', 'Message on the cake (+£3)', S.message, 'maxlength="40" placeholder="Happy 5th Birthday Ava!"')}
      ${notice('info', 'Inspiration, not a copy', 'I\'ll put my own Cakearchy spin on any photo you send. I can\'t copy characters from films or TV, but I can absolutely nail the theme.')}` },

    { title: () => 'ANY ALLERGIES OR DIETARY NEEDS?', render: () => {
      const al = allergy();
      return `<p class="muted">Tell me about anyone who'll be eating it. About 1 in 10 kids at a party has a food intolerance, so you're not being fussy.</p>
        ${choice('radio', 'needs', 'no', 'No, everyone can eat anything', 'Standard recipes', '', S.needs === 'no')}
        ${choice('radio', 'needs', 'yes', 'Yes, someone has an allergy or dietary need', 'I\'ll show you what I can do', '', S.needs === 'yes')}
        ${S.needs === 'yes' ? `
          ${label('What does the cake need to be made without?')}
          ${C.allergens.map(a => choice('checkbox', 'avoid', a.id, a.name, a.hint, '', S.avoid.includes(a.id))).join('')}
          <details><summary style="font-weight:800;color:var(--text-brand);cursor:pointer">Show all 14 allergens</summary>
            <p class="small muted" style="margin-top:8px">None of my recipes use ${C.otherAllergens.join(', ').toLowerCase()}. If you need any of these avoided, add it in the box below.</p></details>
          ${label('Dietary choices')}${chips('diet', C.dietary, S.diet, true)}
          ${label('How serious is it?')}
          ${choice('radio', 'severity', 'mild', 'A preference or mild intolerance', 'A little bit won\'t cause a problem', '', S.severity === 'mild')}
          ${choice('radio', 'severity', 'severe', 'Coeliac or a diagnosed allergy', 'Even a trace could make someone ill', '', S.severity === 'severe')}
          <div id="al-notes" class="form-grid">${al.notes.map(n => notice(...n)).join('')}</div>
          ${al.block ? `<a class="btn btn-outline btn-lg btn-block" href="mailto:${C.business.email}?subject=Allergy-safe cake">Ask me about a safe alternative</a>
            <a class="btn btn-outline btn-lg btn-block" href="mailto:${C.business.email}?subject=Allergy-safe bakers">Get a list of allergy-safe bakers</a>
            ${notice('info', 'Not quite that serious?', 'If it\'s a preference rather than an allergy, switch the answer above and you can carry on.')}` : ''}
          ${field('other', 'Anything else I should know?', S.other, 'placeholder="Ava\'s friend Leo can\'t have eggs."')}`
        : `${label('Flavour')}${chips('flavour', C.flavours, S.flavour, false)}
           ${notice('info', 'Good to know', 'Every cake comes with an allergen label listing all 14 major allergens, even if no one has asked.')}`}
        ${S.needs === 'yes' && !al.block ? `${label('Flavour')}${chips('flavour', C.flavours, S.flavour, false)}` : ''}`;
    }, valid: () => !allergy().block || 'blocked', cta: () => allergy().block ? 'Message Amy' : 'Continue' },

    { title: () => 'HOW WILL IT GET TO THE PARTY?', render: () => {
      const dq = deliveryQuote(S.postcode);
      return `${choice('radio', 'get', 'collect', 'Collect from Harpenden', 'Free. Exact address sent once your order is confirmed', 'Free', S.get === 'collect')}
        ${choice('radio', 'get', 'deliver', isWedding() ? 'Delivery and set-up' : 'Local delivery', isWedding() ? 'Included locally, quoted for further venues' : 'Up to 5 miles from Harpenden. Fee depends on distance', isWedding() ? 'Included' : 'From £6', S.get === 'deliver')}
        ${S.get === 'deliver' ? `${field('postcode', isWedding() ? 'Venue postcode' : 'Delivery postcode (to check the distance)', S.postcode, 'autocomplete="postal-code" placeholder="AL1 4"')}
          <div id="pc-msg">${S.postcode.length > 1 && !isWedding() ? notice(dq.ok ? 'good' : 'warn', dq.msg, dq.ok ? 'In Harpenden it\'s £6. Up to 5 miles it\'s £10.' : 'Switch to collection, or message me.') : ''}</div>` : ''}
        ${label(`Collection or delivery time on ${short(S.date)}`)}${chips('slot', ['9 to 10am', '10 to 11am', '11am to 12pm', 'Day before, 5 to 7pm'], S.slot, false)}
        ${notice('info', 'Getting it home safely', 'Put it flat in the boot or footwell, not on a seat. I\'ll send a few more tips the day before.')}
        ${label('Your details')}
        ${field('name', 'Your name', S.name, 'autocomplete="name"')}${field('mobile', 'Mobile', S.mobile, 'type="tel" autocomplete="tel"')}${field('email', 'Email', S.email, 'type="email" autocomplete="email"')}
        ${choice('checkbox', 'texts', '1', 'Text me updates', 'The quickest way to hear about your quote and design', '', S.texts)}
        ${choice('checkbox', 'surprise', '1', 'It\'s a surprise', 'I\'ll only ever contact you, never the birthday person', '', S.surprise)}`;
    }, valid: () => {
      if (S.get === 'deliver' && !isWedding() && !deliveryQuote(S.postcode).ok) return 'Add a postcode inside the delivery area, or choose collection';
      if (!S.name.trim() || !S.mobile.trim() || !/\S+@\S+\.\S+/.test(S.email)) return 'Add your name, mobile and email';
      return true;
    } },

    { title: () => 'CHECK AND SEND', render: () => {
      const sig = C.signature.find(s => s.id === S.cake); const size = C.sizes.find(s => s.id === S.size); const al = allergy();
      const rows = [
        ['Occasion', `${occ().name}${S.who ? ' · ' + S.who : ''}`, 0],
        ['Date', `${pretty(S.date)}, ${S.get === 'deliver' ? 'delivered to ' + S.postcode.toUpperCase() : 'collect'} ${S.slot}`, 0],
        ['Size', isWedding() ? ({ w60: 'Two tiers, around 60', w100: 'Three tiers, around 100', w150: 'Four tiers or dessert table, 150+' }[S.wsize || 'w100']) : `${size.name}, ${size.note.toLowerCase()}${S.addons.length ? ', plus ' + S.addons.map(id => C.addOns.find(a => a.id === id).name.toLowerCase()).join(' and ') : ''}`, 1],
        ['Look', `${S.start === 'signature' && sig ? sig.name : 'My own design' + (S.files ? ` (${S.files} photo${S.files > 1 ? 's' : ''})` : '')}${S.colours.length ? '. ' + S.colours.join(' and ') : ''}${S.message ? `. "${S.message}"` : ''}`, 2],
        ['Allergies', S.needs === 'yes' ? (al.notes.map(n => n[1]).join('. ') || 'Noted') + (S.other ? '. ' + S.other : '') : 'None. ' + S.flavour, 3],
        ['Contact', `${S.name} · ${S.texts ? 'texts on' : 'email only'}${S.surprise ? ' · surprise' : ''}`, 4]
      ];
      return `<div class="summary">${rows.map(([l, v, st]) => `<div class="row"><div><span class="label muted">${l}</span><p>${v}</p></div><button type="button" class="edit" data-goto="${st}">Edit</button></div>`).join('')}</div>
        ${notice('info', 'What happens next', `I'll reply within ${C.business.replyHours} hours with a final price and a quick sketch. Nothing to pay until you're happy. A ${C.business.depositPercent}% deposit then locks in your date.`)}
        ${choice('checkbox', 'allergenOk', '1', 'I\'ve read the allergen information', 'My kitchen handles all 14 major allergens', '', S.allergenOk)}`;
    }, valid: () => S.allergenOk || 'Tick to confirm you\'ve read the allergen information', cta: () => 'Send my request' }
  ];

  // ---------- Render ----------
  function render() {
    const st = steps[S.step];
    $('#step-label').textContent = `Step ${S.step + 1} of ${steps.length}`;
    $('#bar').style.width = ((S.step + 1) / steps.length * 100) + '%';
    $('#step-title').textContent = st.title();
    $('#step').innerHTML = st.render() + '<div id="err"></div>';
    $('#next').textContent = st.cta ? st.cta() : 'Continue';
    $('#price').textContent = price().text;
    $('#back').style.visibility = S.step === 0 ? 'hidden' : 'visible';
    save();
  }
  const rerender = () => { const y = window.scrollY; render(); window.scrollTo(0, y); };

  // ---------- Events ----------
  $('#step').addEventListener('click', e => {
    const chip = e.target.closest('.chip');
    if (chip) {
      const group = chip.parentElement.dataset.chips; const multi = chip.parentElement.dataset.multi === '1'; const v = chip.dataset.v;
      if (group === 'occasion') { S.occasion = C.occasions.find(o => o.name === v).id; const sig = C.signature.find(s => s.occasion === v); if (sig) S.cake = sig.id; }
      else if (multi) { S[group] = S[group].includes(v) ? S[group].filter(x => x !== v) : [...S[group], v]; }
      else S[group] = v;
      rerender(); return;
    }
    const th = e.target.closest('[data-cake]'); if (th) { S.cake = th.dataset.cake; rerender(); return; }
    const ed = e.target.closest('[data-goto]'); if (ed) { S.step = Number(ed.dataset.goto); render(); window.scrollTo(0, 0); }
  });
  $('#step').addEventListener('change', e => {
    const t = e.target; const n = t.name;
    if (t.id === 'files') { S.files = Math.min(5, t.files.length); rerender(); return; }
    if (n === 'addon') S.addons = $$('input[name=addon]:checked').map(i => i.value);
    else if (n === 'avoid') S.avoid = $$('input[name=avoid]:checked').map(i => i.value);
    else if (t.type === 'checkbox') S[n] = t.checked;
    else if (t.type === 'radio') S[n] = t.value;
    else if (n) S[n] = t.value;
    if (t.type === 'radio' || t.type === 'checkbox' || t.type === 'date' || n === 'postcode') rerender();
  });
  $('#step').addEventListener('input', e => { const t = e.target; if (t.name && t.type !== 'radio' && t.type !== 'checkbox') { S[t.name] = t.value; $('#price').textContent = price().text; save();
    if (t.name === 'postcode') { const dq = deliveryQuote(S.postcode); const m = $('#pc-msg'); if (m) m.innerHTML = S.postcode.length > 1 ? notice(dq.ok ? 'good' : 'warn', dq.msg, dq.ok ? 'In Harpenden it\'s £6. Up to 5 miles it\'s £10.' : 'Switch to collection, or message me.') : ''; } } });

  $('#next').addEventListener('click', () => {
    const v = steps[S.step].valid ? steps[S.step].valid() : true;
    if (v === 'blocked') { location.href = `mailto:${C.business.email}?subject=Allergy question about a cake`; return; }
    if (v !== true) { $('#err').innerHTML = notice('warn', 'Nearly there', v); $('#err').scrollIntoView({ behavior: 'smooth', block: 'center' }); return; }
    if (S.step < steps.length - 1) { S.step++; render(); window.scrollTo(0, 0); return; }
    // Send (preview: stored locally)
    const ref = 'CA-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    const order = { ...S, ref, sentAt: new Date().toISOString(), price: price().text };
    store.set('lastOrder', order); store.set('draft', {});
    $('#flow').classList.add('hidden'); $('#sent').classList.remove('hidden'); window.scrollTo(0, 0);
    $('#sent-msg').textContent = `Thanks ${S.name.split(' ')[0]}. I've texted you a link to track everything, so you never have to wonder what's happening. Your reference is ${ref}.`;
    const d = C.business.changeCutoffDays;
    const changeBy = (() => { const x = window.CA.parse(S.date); x.setDate(x.getDate() - d); return x.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }); })();
    const bake = (() => { const x = window.CA.parse(S.date); x.setDate(x.getDate() - 1); return x.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }); })();
    $('#sent-steps').innerHTML = [['Request sent', 'Just now', 'done'], ['Quote and sketch', `Within ${C.business.replyHours} hours`, ''], ['Deposit locks your date', `${C.business.depositPercent}% to secure ${short(S.date)}`, ''], ['Design approved', `Tweaks welcome until ${changeBy}`, ''], ['Baking day', bake, ''], ['Party time', `${short(S.date)}, ${S.slot}`, '']]
      .map(([t, s, c]) => `<li class="${c}"><span class="d"></span><span><strong>${t}</strong><br><span class="small muted">${s}</span></span></li>`).join('');
  });
  $('#back').addEventListener('click', () => { if (S.step > 0) { S.step--; render(); window.scrollTo(0, 0); } });

  render();
});
