/* Festive overlay: snowflakes and sprinkles drifting down the homepage.
   - On page load: snow falls over the whole screen.
   - As soon as the visitor scrolls: it fades away.
   - Back at the top: it gently returns, but only falls as far as the date search form.
   Turn it on or off, and set the dates, in js/config.js (festive). */
(function () {
  const F = (window.CAKEARCHY || {}).festive;
  if (!F || !F.enabled) return;
  const now = new Date(); const md = (now.getMonth() + 1) * 100 + now.getDate();
  const toMD = s => { const [m, d] = s.split('-').map(Number); return m * 100 + d; };
  const from = toMD(F.from), to = toMD(F.to);
  const inSeason = from <= to ? (md >= from && md <= to) : (md >= from || md <= to);
  if (!inSeason) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let off = false; try { off = localStorage.getItem('cakearchy:snowOff') === '1'; } catch (e) {}

  document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:30;transition:opacity 1.2s ease';
    document.body.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    const btn = document.createElement('button');
    btn.type = 'button'; btn.className = 'btn btn-outline';
    btn.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:35;width:48px;height:48px;padding:0;font-size:22px;box-shadow:var(--shadow-sm);transition:opacity 1.2s ease';
    document.body.appendChild(btn);

    const form = document.getElementById('finder');
    const colours = ['#E34278', '#F7DD9E', '#F1AEC7', '#C1282B', '#FFFFFF', '#5BB8D6'];
    let W, H, parts = [], running = false, raf;
    let mode = 'full';      // 'full' on first load, 'hero' after coming back to the top
    let shown = true;       // false while faded out by scrolling

    const resize = () => { const r = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight; canvas.width = W * r; canvas.height = H * r; ctx.setTransform(r, 0, 0, r, 0, 0); };
    const limit = () => mode === 'hero' && form ? Math.max(0, form.getBoundingClientRect().top) : H;
    const make = (y) => {
      const flake = Math.random() < 0.55;
      return { x: Math.random() * W, y: y ?? -20, r: flake ? 5 + Math.random() * 6 : 2.5 + Math.random() * 1.5, len: 8 + Math.random() * 6,
        vy: 0.5 + Math.random() * 1.1, vx: -0.3 + Math.random() * 0.6, rot: Math.random() * Math.PI, vr: -0.03 + Math.random() * 0.06,
        sway: Math.random() * Math.PI * 2, flake, c: colours[Math.floor(Math.random() * colours.length)] };
    };
    const count = () => Math.round(Math.min(80, Math.max(28, W / 18)));
    const drawFlake = p => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.2; ctx.lineCap = 'round';
      ctx.shadowColor = 'rgba(29,24,22,.35)'; ctx.shadowBlur = 0; ctx.shadowOffsetX = 1; ctx.shadowOffsetY = 1;
      for (let i = 0; i < 6; i++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, p.r); ctx.moveTo(0, p.r * .55); ctx.lineTo(p.r * .3, p.r * .8); ctx.moveTo(0, p.r * .55); ctx.lineTo(-p.r * .3, p.r * .8); ctx.stroke(); }
      ctx.restore();
    };
    const drawSprinkle = p => {
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = '#1D1816'; ctx.beginPath(); ctx.roundRect(-p.len / 2 + 1, -p.r + 1, p.len, p.r * 2, p.r); ctx.fill();
      ctx.fillStyle = p.c; ctx.beginPath(); ctx.roundRect(-p.len / 2, -p.r, p.len, p.r * 2, p.r); ctx.fill();
      ctx.restore();
    };
    const tick = () => {
      ctx.clearRect(0, 0, W, H);
      const bottom = limit();
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W, bottom); ctx.clip();
      for (const p of parts) {
        p.sway += 0.02; p.y += p.vy; p.x += p.vx + Math.sin(p.sway) * 0.35; p.rot += p.vr;
        if (p.y > bottom + 20) Object.assign(p, make());
        p.flake ? drawFlake(p) : drawSprinkle(p);
      }
      ctx.restore();
      raf = requestAnimationFrame(tick);
    };
    const seed = () => { const b = limit(); parts = Array.from({ length: mode === 'hero' ? Math.round(count() * Math.max(0.35, b / H)) : count() }, () => make(Math.random() * b)); };
    const start = () => { if (running) return; running = true; resize(); seed(); canvas.style.display = ''; tick(); };
    const stop = () => { running = false; cancelAnimationFrame(raf); ctx.clearRect(0, 0, W, H); };
    const label = () => { btn.textContent = '❄'; btn.title = off ? 'Let it snow' : 'Stop the snow'; btn.setAttribute('aria-label', btn.title); btn.setAttribute('aria-pressed', String(!off)); btn.style.filter = off ? 'grayscale(1)' : ''; };

    let hideTimer;
    const hide = () => {
      shown = false; canvas.style.opacity = '0'; btn.style.opacity = '0'; btn.style.pointerEvents = 'none';
      clearTimeout(hideTimer); hideTimer = setTimeout(() => { if (!shown) stop(); }, 1250);
    };
    const show = () => {
      shown = true; clearTimeout(hideTimer); mode = 'hero';
      btn.style.opacity = '1'; btn.style.pointerEvents = '';
      if (!off) { stop(); start(); canvas.style.opacity = '0'; requestAnimationFrame(() => { canvas.style.opacity = '1'; }); }
    };
    const onScroll = () => {
      const atTop = scrollY < 10;
      if (!atTop && shown) hide();
      else if (atTop && !shown) show();
    };
    addEventListener('scroll', onScroll, { passive: true });

    btn.addEventListener('click', () => {
      off = !off; try { localStorage.setItem('cakearchy:snowOff', off ? '1' : '0'); } catch (e) {}
      label(); if (off) { stop(); canvas.style.opacity = '0'; } else { start(); canvas.style.opacity = '1'; }
    });
    addEventListener('resize', () => { if (running) resize(); });
    document.addEventListener('visibilitychange', () => { if (document.hidden) cancelAnimationFrame(raf); else if (running) tick(); });

    if (reduce) off = true;
    label();
    if (!off) start(); else canvas.style.opacity = '0';
    onScroll();
  });
})();
