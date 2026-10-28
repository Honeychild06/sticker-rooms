(() => {
  const SAVE_KEY = 'sparkle-stickers-v1';
  const W = 1000, H = 625;

  // ---------- Saved data ----------
  let data = { rooms: {}, sound: true };
  try {
    const d = JSON.parse(localStorage.getItem(SAVE_KEY));
    if (d && d.rooms) data = Object.assign(data, d);
  } catch (e) { }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch (e) { } };

  const $ = s => document.querySelector(s);
  const home = $('#home'), play = $('#play'), wrap = $('#wrap'), stage = $('#stage'), layer = $('#layer');
  const selbox = $('#selbox'), fx = $('#fx'), hint = $('#hint'), sheet = $('#sheet');
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  let room = null, items = [], sel = null, scale = 1, nextId = 1, tab = CATEGORIES[0].id;
  const els = new Map();

  const svgOf = k => `<svg viewBox="0 0 100 100"><g filter="url(#stk)">${STICKERS[k].svg}</g></svg>`;
  const stkStyle = i => `left:${i.x}px;top:${i.y}px;width:${i.s}px;height:${i.s}px;` +
    `transform:translate(-50%,-50%) rotate(${i.r}deg) scaleX(${i.f ? -1 : 1})`;
  const roomItems = id => (data.rooms[id] || []).filter(i => STICKERS[i.k]);

  // ---------- Sounds (made on the fly, no files) ----------
  let ac = null;
  function audio() {
    if (!data.sound) return null;
    if (!ac) { try { ac = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  }
  function tone(f, dur, { type = 'sine', vol = .18, to = null, at = 0 } = {}) {
    const a = audio(); if (!a) return;
    const t = a.currentTime + at, o = a.createOscillator(), g = a.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f, t);
    if (to) o.frequency.exponentialRampToValueAtTime(to, t + dur);
    g.gain.setValueAtTime(.0001, t);
    g.gain.exponentialRampToValueAtTime(vol, t + .01);
    g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g).connect(a.destination);
    o.start(t); o.stop(t + dur + .05);
  }
  const sfx = {
    tap: () => tone(660, .08, { type: 'triangle', vol: .12 }),
    pop: () => { tone(380, .14, { to: 900, vol: .22 }); [1320, 1760, 2093].forEach((f, i) => tone(f, .12, { type: 'triangle', vol: .06, at: .08 + i * .05 })); },
    grab: () => tone(520, .07, { to: 700, type: 'triangle', vol: .1 }),
    drop: () => tone(300, .09, { to: 200, vol: .15 }),
    trash: () => tone(600, .25, { to: 150, type: 'triangle', vol: .18 }),
    flip: () => { tone(500, .07, { type: 'triangle', vol: .1 }); tone(750, .07, { type: 'triangle', vol: .1, at: .07 }); },
    tada: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .3, { type: 'triangle', vol: .14, at: i * .09 })),
  };

  // ---------- Home ----------
  const COLORS = ['#ff6fae', '#c77dff', '#ff9f43', '#4dabf7', '#38c98b', '#a66cff'];
  $('#title').innerHTML = [...'Sparkle Sticker Rooms'].map((ch, i) => ch === ' ' ? ' '
    : `<span style="color:${COLORS[i % COLORS.length]};animation-delay:${i * .08}s">${ch}</span>`).join('');

  function renderHome() {
    const box = $('#rooms');
    box.innerHTML = '';
    ROOMS.forEach(r => {
      const card = document.createElement('button');
      card.className = 'room-card';
      card.innerHTML = `<div class="prev"><div class="scene" style="background:${r.bgCss}"><div class="bgfill">${r.svg}</div>` +
        roomItems(r.id).map(i => `<div class="stk" style="${stkStyle(i)}"><div class="in">${svgOf(i.k)}</div></div>`).join('') +
        `</div></div><div class="label">${r.name}</div>`;
      card.onclick = () => { sfx.tap(); openRoom(r.id); };
      box.appendChild(card);
    });
    fitPreviews();
  }
  function fitPreviews() {
    document.querySelectorAll('.prev').forEach(p => {
      p.firstChild.style.transform = `scale(${p.clientWidth / W})`;
    });
  }
  function showHome() {
    select(null);
    play.classList.add('hidden');
    home.classList.remove('hidden');
    renderHome();
  }

  // ---------- Room ----------
  function openRoom(id) {
    room = ROOMS.find(r => r.id === id);
    items = roomItems(id).map(i => ({ ...i }));
    nextId = items.reduce((m, i) => Math.max(m, i.id), 0) + 1;
    stage.style.background = room.bgCss;
    $('#bg').innerHTML = room.svg;
    $('#roomName').textContent = room.name;
    layer.innerHTML = '';
    els.clear();
    items.forEach(i => layer.appendChild(makeEl(i)));
    sel = null;
    updateSel();
    home.classList.add('hidden');
    play.classList.remove('hidden');
    renderTabs();
    fit();
    updateHint();
  }
  function fit() {
    const w = wrap.clientWidth, h = wrap.clientHeight, pad = 10;
    scale = Math.min((w - pad * 2) / W, (h - pad * 2) / H);
    stage.style.transform = `translate(${(w - W * scale) / 2}px, ${(h - H * scale) / 2}px) scale(${scale})`;
    updateSel();
  }
  function makeEl(i) {
    const el = document.createElement('div');
    el.className = 'stk';
    el.dataset.id = i.id;
    el.innerHTML = `<div class="in">${svgOf(i.k)}</div>`;
    el.style.cssText = stkStyle(i);
    els.set(i.id, el);
    return el;
  }
  function apply(i) {
    els.get(i.id).style.cssText = stkStyle(i);
    if (i === sel) updateSel();
  }
  function save() {
    data.rooms[room.id] = items.map(({ id, k, x, y, s, r, f }) =>
      ({ id, k, x: Math.round(x), y: Math.round(y), s: Math.round(s), r: Math.round(r), f }));
    persist();
  }
  function updateHint() { hint.classList.toggle('hidden', items.length > 0); }

  function select(i) {
    sel = i || null;
    if (sel) {
      // Bring to the front
      items = items.filter(x => x !== sel).concat(sel);
      layer.appendChild(els.get(sel.id));
    }
    updateSel();
  }
  function updateSel() {
    if (!sel) { selbox.style.display = 'none'; return; }
    const b = Math.max(sel.s * .92, 120 / scale);
    selbox.style.cssText = `display:block;left:${sel.x}px;top:${sel.y}px;width:${b}px;height:${b}px;` +
      `transform:translate(-50%,-50%) rotate(${sel.r}deg);--h:${Math.round(54 / scale)}px`;
  }

  function addSticker(k, x, y) {
    const i = { id: nextId++, k, x: clamp(x, 0, W), y: clamp(y, 0, H), s: STICKERS[k].size || 150, r: Math.round(Math.random() * 16 - 8), f: false };
    items.push(i);
    const el = makeEl(i);
    el.classList.add('pop');
    layer.appendChild(el);
    setTimeout(() => el.classList.remove('pop'), 550);
    select(i);
    sparkles(i.x, i.y);
    sfx.pop();
    save();
    updateHint();
  }
  function removeSel() {
    const i = sel, el = els.get(i.id);
    items = items.filter(x => x !== i);
    els.delete(i.id);
    select(null);
    el.classList.add('bye');
    setTimeout(() => el.remove(), 320);
    sfx.trash();
    save();
    updateHint();
  }

  // ---------- Effects ----------
  function sparkles(x, y) {
    for (let n = 0; n < 8; n++) {
      const s = document.createElement('div'), a = n / 8 * Math.PI * 2, d = 70 + Math.random() * 50;
      s.className = 'spark';
      s.textContent = pick(['✦', '★', '♥']);
      s.style.cssText = `left:${x}px;top:${y}px;color:${pick(COLORS)};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
      fx.appendChild(s);
      setTimeout(() => s.remove(), 750);
    }
  }
  function tada() {
    select(null);
    sfx.tada();
    for (let n = 0; n < 40; n++) {
      const c = document.createElement('div'), dur = 1.4 + Math.random() * 1.2;
      c.className = 'confetti';
      c.textContent = pick(['★', '♥', '✦', '●']);
      c.style.cssText = `left:${Math.random() * W}px;color:${pick(COLORS)};animation-duration:${dur}s;` +
        `animation-delay:${Math.random() * .5}s;--spin:${Math.random() * 720 - 360}deg`;
      fx.appendChild(c);
      setTimeout(() => c.remove(), (dur + .6) * 1000);
    }
    const cheer = $('#cheer');
    cheer.textContent = pick(['So pretty!', 'Wow!', 'Great job!', 'I love it!', 'Super!']);
    cheer.classList.remove('show');
    void cheer.offsetWidth;
    cheer.classList.add('show');
  }

  // ---------- Touch on the room: move, turn, size ----------
  const pts = new Map();
  let mode = null, g = null;
  const toStage = e => {
    const b = stage.getBoundingClientRect();
    return { x: (e.clientX - b.left) / scale, y: (e.clientY - b.top) / scale };
  };
  const twoPts = () => { const [a, b] = [...pts.values()]; return { a, b }; };
  function startPinch() {
    const { a, b } = twoPts();
    return {
      d0: Math.max(20, Math.hypot(b.x - a.x, b.y - a.y)), a0: Math.atan2(b.y - a.y, b.x - a.x),
      m0: { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }, s0: sel.s, r0: sel.r, x0: sel.x, y0: sel.y,
    };
  }
  function liftOff() { layer.querySelectorAll('.lift').forEach(e => e.classList.remove('lift')); }

  stage.addEventListener('pointerdown', e => {
    audio();
    const p = toStage(e);
    pts.set(e.pointerId, p);
    try { stage.setPointerCapture(e.pointerId); } catch (err) { }
    const t = e.target;

    if (pts.size === 2 && sel && mode !== 'none') { mode = 'pinch'; g = startPinch(); return; }
    if (pts.size > 1) return;

    if (sel && t.closest('.h-del')) { removeSel(); mode = 'none'; return; }
    if (sel && t.closest('.h-flip')) { sel.f = !sel.f; apply(sel); sfx.flip(); save(); mode = 'none'; return; }
    if (sel && t.closest('.h-rot')) {
      mode = 'rot';
      g = { a0: Math.atan2(p.y - sel.y, p.x - sel.x), d0: Math.max(20, Math.hypot(p.x - sel.x, p.y - sel.y)), s0: sel.s, r0: sel.r };
      sfx.grab();
      return;
    }
    const el = t.closest('.stk');
    if (el) {
      const i = items.find(x => x.id == el.dataset.id);
      select(i);
      mode = 'drag';
      g = { dx: i.x - p.x, dy: i.y - p.y };
      el.classList.add('lift');
      sfx.grab();
      return;
    }
    select(null);
    mode = null;
  });

  stage.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return;
    const p = toStage(e);
    pts.set(e.pointerId, p);
    if (!sel) return;
    if (mode === 'drag') {
      sel.x = clamp(p.x + g.dx, 0, W);
      sel.y = clamp(p.y + g.dy, 0, H);
    } else if (mode === 'rot') {
      const a = Math.atan2(p.y - sel.y, p.x - sel.x), d = Math.hypot(p.x - sel.x, p.y - sel.y);
      sel.s = clamp(g.s0 * d / g.d0, 50, 620);
      sel.r = g.r0 + (a - g.a0) * 180 / Math.PI;
    } else if (mode === 'pinch' && pts.size >= 2) {
      const { a, b } = twoPts();
      const d = Math.hypot(b.x - a.x, b.y - a.y), ang = Math.atan2(b.y - a.y, b.x - a.x);
      sel.s = clamp(g.s0 * d / g.d0, 50, 620);
      sel.r = g.r0 + (ang - g.a0) * 180 / Math.PI;
      sel.x = clamp(g.x0 + (a.x + b.x) / 2 - g.m0.x, 0, W);
      sel.y = clamp(g.y0 + (a.y + b.y) / 2 - g.m0.y, 0, H);
    } else return;
    apply(sel);
  });

  function endPointer(e) {
    if (!pts.has(e.pointerId)) return;
    pts.delete(e.pointerId);
    if (mode === 'pinch' && pts.size === 1 && sel) {
      const p = [...pts.values()][0];
      mode = 'drag';
      g = { dx: sel.x - p.x, dy: sel.y - p.y };
      return;
    }
    if (pts.size === 0) {
      if (mode === 'drag' || mode === 'rot' || mode === 'pinch') { sfx.drop(); save(); }
      liftOff();
      mode = null;
    }
  }
  stage.addEventListener('pointerup', endPointer);
  stage.addEventListener('pointercancel', endPointer);

  // ---------- Sticker tray ----------
  function renderTabs() {
    const box = $('#tabs');
    box.innerHTML = '';
    CATEGORIES.forEach(c => {
      const b = document.createElement('button');
      b.className = 'tab' + (c.id === tab ? ' on' : '');
      b.innerHTML = svgOf(c.icon) + `<span>${c.name}</span>`;
      b.onclick = () => { sfx.tap(); tab = c.id; renderTabs(); };
      box.appendChild(b);
    });
    sheet.innerHTML = CATEGORIES.find(c => c.id === tab).items
      .map(k => `<div class="item" data-k="${k}">${svgOf(k)}</div>`).join('');
    sheet.scrollLeft = 0;
  }

  // Tap a sticker to add it, or pull it up into the room.
  let td = null;
  sheet.addEventListener('pointerdown', e => {
    const it = e.target.closest('.item');
    if (!it || td) return;
    audio();
    td = { k: it.dataset.k, x0: e.clientX, y0: e.clientY, id: e.pointerId, drag: false, ghost: null, el: it };
    it.classList.add('press');
  });
  window.addEventListener('pointermove', e => {
    if (!td || e.pointerId !== td.id) return;
    const dx = e.clientX - td.x0, dy = e.clientY - td.y0;
    if (!td.drag) {
      if (dy < -14 && Math.abs(dy) > Math.abs(dx)) {
        td.drag = true;
        const size = (STICKERS[td.k].size || 150) * scale;
        td.ghost = document.createElement('div');
        td.ghost.className = 'ghost';
        td.ghost.style.width = td.ghost.style.height = size + 'px';
        td.ghost.innerHTML = svgOf(td.k);
        document.body.appendChild(td.ghost);
        td.el.classList.remove('press');
        sfx.grab();
      } else if (Math.abs(dx) > 12) {
        td.el.classList.remove('press');
        td = null; // the tray is scrolling
        return;
      }
    }
    if (td.drag) {
      const s = td.ghost.offsetWidth;
      td.ghost.style.transform = `translate(${e.clientX - s / 2}px, ${e.clientY - s / 2}px)`;
    }
  });
  function endTray(e, cancelled) {
    if (!td || e.pointerId !== td.id) return;
    const d = td;
    td = null;
    d.el.classList.remove('press');
    if (d.drag) {
      d.ghost.remove();
      const b = stage.getBoundingClientRect();
      if (!cancelled && e.clientX > b.left && e.clientX < b.right && e.clientY > b.top && e.clientY < b.bottom) {
        addSticker(d.k, (e.clientX - b.left) / scale, (e.clientY - b.top) / scale);
      }
    } else if (!cancelled) {
      addSticker(d.k, W / 2 + (Math.random() - .5) * 300, H / 2 + (Math.random() - .5) * 160);
    }
  }
  window.addEventListener('pointerup', e => endTray(e, false));
  window.addEventListener('pointercancel', e => endTray(e, true));

  // ---------- Buttons ----------
  $('#btnHome').onclick = () => { sfx.tap(); showHome(); };
  $('#btnTada').onclick = tada;
  const soundBtn = $('#btnSound');
  const showSound = () => { soundBtn.textContent = data.sound ? '🔊' : '🔇'; };
  soundBtn.onclick = () => { data.sound = !data.sound; persist(); showSound(); sfx.tap(); };
  showSound();
  const modal = $('#modal');
  $('#btnClear').onclick = () => { sfx.tap(); select(null); modal.classList.remove('hidden'); };
  $('#no').onclick = () => { sfx.tap(); modal.classList.add('hidden'); };
  $('#yes').onclick = () => {
    items = [];
    els.clear();
    layer.innerHTML = '';
    save();
    sfx.trash();
    updateHint();
    modal.classList.add('hidden');
  };

  window.addEventListener('resize', () => { if (play.classList.contains('hidden')) fitPreviews(); else fit(); });
  if (window.ResizeObserver) new ResizeObserver(() => { if (!play.classList.contains('hidden')) fit(); }).observe(wrap);
  document.addEventListener('contextmenu', e => e.preventDefault());

  renderHome();

  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => { });
  }
})();
