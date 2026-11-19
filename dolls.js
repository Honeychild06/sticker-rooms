// Doll Studio: pixel-art dress-up dolls. Finished dolls become stickers in a "Dolls" tab.
// Loads after stickers.js and before game.js (it adds doll stickers to STICKERS and CATEGORIES).
const DollStudio = (() => {
  const SAVE_KEY = 'sparkle-dolls-v1';

  // ================= Pixel engine =================
  // Every doll is drawn on a 64 x 160 pixel grid. Each piece is a shape (mask) that gets
  // an outline, light shading on the left, shadow on the right, and its color or leopard print.
  const W = 64, H = 160, HY = 2; // HY drops the head 2px (shorter neck)
  const off = document.createElement('canvas'); off.width = W; off.height = H;
  const oc = off.getContext('2d', { willReadFrequently: true });
  const down = c => c.translate(0, HY);

  function mk(...fns) {
    oc.setTransform(1, 0, 0, 1, 0, 0); oc.clearRect(0, 0, W, H);
    oc.fillStyle = oc.strokeStyle = '#000'; oc.lineCap = oc.lineJoin = 'round';
    fns.forEach(f => f(oc));
    const d = oc.getImageData(0, 0, W, H).data, m = new Uint8Array(W * H);
    for (let i = 0; i < W * H; i++) m[i] = d[i * 4 + 3] > 127 ? 1 : 0;
    return m;
  }
  const poly = pts => c => { c.beginPath(); pts.forEach(([x, y], i) => i ? c.lineTo(x, y) : c.moveTo(x, y)); c.closePath(); c.fill(); };
  const ell = (x, y, rx, ry, r = 0) => c => { c.beginPath(); c.ellipse(x, y, rx, ry, r, 0, Math.PI * 2); c.fill(); };
  const mir = pts => pts.map(([x, y]) => [64 - x, y]);
  const or = (...ms) => { const o = new Uint8Array(W * H); ms.forEach(m => { for (let i = 0; i < o.length; i++) o[i] |= m[i]; }); return o; };
  const keep = (m, f) => { const o = new Uint8Array(W * H); for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const i = y * W + x; o[i] = m[i] && f(x, y) ? 1 : 0; } return o; };
  const dil = m => {
    const o = new Uint8Array(m);
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (m[y * W + x])
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const X = x + dx, Y = y + dy; if (X >= 0 && Y >= 0 && X < W && Y < H) o[Y * W + X] = 1; }
    return o;
  };

  const cache = new Map();
  function rgb(hex) { if (!cache.has(hex)) cache.set(hex, [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16))); return cache.get(hex); }
  const hx = a => '#' + a.map(v => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');
  const mix = (a, b, t) => { const A = rgb(a), B = rgb(b); return hx(A.map((v, i) => v + (B[i] - v) * t)); };

  function hash(a, b) { let h = (a * 374761393 + b * 668265263) | 0; h = Math.imul(h ^ (h >>> 13), 1274126177); return ((h ^ (h >>> 16)) >>> 0) / 4294967296; }
  // Leopard print: jittered spots, each a tan center with a broken dark ring.
  function leo(x, y) {
    const S = 6, cx = Math.floor(x / S), cy = Math.floor(y / S);
    let best = 99;
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      const gx = cx + dx, gy = cy + dy;
      const px = gx * S + 1.5 + hash(gx, gy) * 3 + (gy % 2) * 3, py = gy * S + 1.5 + hash(gy + 77, gx) * 3;
      best = Math.min(best, Math.hypot(x + .5 - px, y + .5 - py));
    }
    if (best < 1.15) return '#c98a3a';
    if (best < 2.2 && hash(x * 3, y * 5) > .22) return '#3b2416';
    return '#f2bd5c';
  }
  const outlineOf = c => c === 'leo' ? '#5b3518' : mix(c, '#2a1630', .58);

  // A piece: {z, m, col, ol?, flat?, fx?} or {z, pix: [[x, y, color]]}.
  // z = draw zone: 0 behind, 1 legs, 2 body, 3 head, 4 arms, 5 front (hair, hats).
  function put(buf, x, y, c) { const i = (y * W + x) * 4, v = rgb(c); buf[i] = v[0]; buf[i + 1] = v[1]; buf[i + 2] = v[2]; buf[i + 3] = 255; }
  function paint(buf, p) {
    if (p.pix) { p.pix.forEach(([x, y, c]) => put(buf, x, y, c)); return; }
    const m = p.m, at = (x, y) => x >= 0 && y >= 0 && x < W && y < H && m[y * W + x];
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (!m[y * W + x]) continue;
      let base = p.col === 'leo' ? leo(x, y) : p.col, out;
      if (p.flat) out = base;
      else if (!at(x - 1, y) || !at(x + 1, y) || !at(x, y - 1) || !at(x, y + 1)) out = p.ol || outlineOf(p.col);
      else {
        if (p.fx) base = p.fx(x, y, base) || base;
        if (!at(x + 2, y) || !at(x, y + 2)) out = mix(base, '#3a1d40', .2);
        else if (!at(x - 2, y) || !at(x, y - 2)) out = mix(base, '#ffffff', .35);
        else out = base;
      }
      put(buf, x, y, out);
    }
  }
  function render(pieces) {
    const img = new ImageData(W, H);
    pieces.map((p, i) => [p, i]).sort((a, b) => a[0].z - b[0].z || a[1] - b[1]).forEach(([p]) => paint(img.data, p));
    return img;
  }

  // ================= Body =================
  const legPts = [[23.5, 82], [31.5, 82], [31.4, 100], [30.8, 118], [30, 145], [26, 145], [25, 118], [24, 100]];
  const B = {
    head: mk(down, ell(32, 27, 11.5, 13)),
    neck: mk(c => c.fillRect(29, 37, 6, 12)),
    torso: mk(poly([[25, 46], [39, 46], [42, 49], [40.5, 58], [38.5, 69], [41, 80], [41, 88], [23, 88], [23, 80], [25.5, 69], [23.5, 58], [22, 49]])),
    armL: mk(c => { c.lineWidth = 5; c.beginPath(); c.moveTo(23.5, 50); c.quadraticCurveTo(19.5, 68, 18, 90); c.stroke(); }, ell(17.6, 94, 2.8, 3.6, .15)),
    armR: mk(c => { c.lineWidth = 5; c.beginPath(); c.moveTo(40.5, 50); c.quadraticCurveTo(44.5, 68, 46, 90); c.stroke(); }, ell(46.4, 94, 2.8, 3.6, -.15)),
    legL: mk(poly(legPts)),
    legR: mk(poly(mir(legPts))),
    footL: mk(ell(27, 147.5, 3.8, 2.6)),
    footR: mk(ell(37, 147.5, 3.8, 2.6)),
  };
  const D = {}; for (const k in B) D[k] = dil(B[k]);
  const straps = (x, y, top) => y >= top || (y >= 45 && ((x >= 26 && x <= 28) || (x >= 35 && x <= 37)));

  const SKINS = ['#ffe3d3', '#f7c9a6', '#d9a07a', '#a8714e', '#6e4630'];
  const HAIRS = ['#8a5a3b', '#f5d27a', '#3a2c3a', '#d9583b', '#ff9ccf', '#b38cff'];
  const CLOTH = ['leo', '#ff8fc8', '#b98cff', '#7cc4ff', '#7fe3b8', '#ffe066', '#3d3346', '#fbf7ff'];
  const first = (c, list = CLOTH) => [c, ...list.filter(x => x !== c)];

  function skinPieces(s) {
    return [
      { z: 1, m: B.legL, col: s }, { z: 1, m: B.legR, col: s }, { z: 1, m: B.footL, col: s }, { z: 1, m: B.footR, col: s },
      { z: 2, m: B.neck, col: s }, { z: 2, m: B.torso, col: s },
      { z: 3, m: B.head, col: s },
      { z: 4, m: B.armL, col: s }, { z: 4, m: B.armR, col: s },
      // plain white play clothes under everything
      { z: 1, m: keep(D.legL, (x, y) => y <= 90), col: '#f4eeff' }, { z: 1, m: keep(D.legR, (x, y) => y <= 90), col: '#f4eeff' },
      { z: 2, m: keep(D.torso, (x, y) => straps(x, y, 51)), col: '#f4eeff' },
    ];
  }
  function facePieces(s, hair) {
    const dark = '#2a1630', iris = '#5f9ee8', irisD = '#2f5aa0', p = [];
    for (const x of [25, 26, 27, 28, 35, 36, 37, 38]) p.push([x, 26, dark]);
    for (const [a, b, c] of [[26, 27, 28], [35, 36, 37]]) {
      p.push([a, 27, iris], [b, 27, iris], [c, 27, '#ffffff'], [a, 28, irisD], [b, 28, dark], [c, 28, iris],
        [a, 29, '#9fd0ff'], [b, 29, iris], [c, 29, '#9fd0ff']);
    }
    p.push([24, 27, dark], [39, 27, dark]); // outer lash flick
    const brow = outlineOf(hair);
    p.push([26, 23, brow], [27, 23, brow], [36, 23, brow], [37, 23, brow]);
    p.push([32, 31, mix(s, '#a0523a', .25)]);
    p.push([30, 33, '#c45a7a'], [31, 34, '#e8708f'], [32, 34, '#e8708f'], [33, 33, '#c45a7a']);
    const bl = mix(s, '#ff6f9f', .4);
    p.push([24, 32, bl], [25, 32, bl], [38, 32, bl], [39, 32, bl]);
    return [{ z: 3, pix: p.map(([x, y, c]) => [x, y + HY, c]) }];
  }

  // ================= Wardrobe =================
  const hairFx = (x, y, base) => {
    if (y >= 14 + HY && y <= 16 + HY && x >= 25 && x <= 39 && (x + y) % 3) return mix(base, '#ffffff', .45);
    if (Math.sin(x * 1.7 + y * .12) > .93) return mix(base, '#2a1630', .22);
  };
  const longHairBack = mk(down, ell(32, 25, 14, 14), poly([[18, 25], [46, 25], [47.5, 45], [46, 64], [47, 78], [44, 82], [41, 79], [38, 83], [34, 80], [30, 83], [26, 80], [23, 83], [20, 79], [17, 82], [18, 64], [16.5, 45]]));
  const lockL = [[18.5, 24], [23.5, 24], [22.5, 36], [21.5, 48], [19, 56], [17, 48], [17, 34]];
  const longHairFront = mk(down, c => {
    c.beginPath(); c.ellipse(32, 25.5, 13.5, 13.5, 0, Math.PI, Math.PI * 2);
    [[45.5, 27], [43, 24], [40.5, 22.5], [38, 24.5], [35.5, 21], [32.5, 23.5], [29.5, 20.5], [26.5, 23.5], [24, 22], [21, 25], [18.5, 27]].forEach(([x, y]) => c.lineTo(x, y));
    c.closePath(); c.fill();
  }, poly(lockL), poly(mir(lockL)));
  const earPts = [[20, 19], [23, 3], [30.5, 13]], innerEar = [[23, 13.5], [23.8, 7], [27.5, 12.2]];
  const bootTop = (x, y, b) => y <= 124 ? mix(b, '#fff', .3) : null;

  const ITEMS = {
    hair: [{ id: 'long', name: 'Long hair', colors: HAIRS, make: col => [{ z: 0, m: longHairBack, col, fx: hairFx }, { z: 5, m: longHairFront, col, fx: hairFx }] }],
    top: [{ id: 'tee', name: 'Tee', colors: CLOTH, make: col => [
      { z: 2, m: keep(D.torso, (x, y) => y >= 45 && y <= 80 && ((x + .5 - 32) / 4) ** 2 + ((y + .5 - 45) / 2.5) ** 2 > 1), col },
      { z: 4, m: keep(D.armL, (x, y) => y <= 60), col }, { z: 4, m: keep(D.armR, (x, y) => y <= 60), col }] }],
    bottom: [
      { id: 'leggings', name: 'Leggings', colors: CLOTH, make: col => [
        { z: 1, m: keep(D.legL, (x, y) => y <= 141), col }, { z: 1, m: keep(D.legR, (x, y) => y <= 141), col },
        { z: 2, m: keep(D.torso, (x, y) => y >= 77), col }] },
      { id: 'skirt', name: 'Skirt', colors: first('#ff8fc8'), make: col => [
        { z: 2, m: or(keep(D.torso, (x, y) => y >= 75), mk(poly([[23.5, 76], [40.5, 76], [46, 102], [41, 103.5], [36, 102], [32, 103.5], [28, 102], [23, 103.5], [18, 102]]))), col }] },
    ],
    dress: [{ id: 'party', name: 'Party dress', colors: CLOTH, make: col => [
      { z: 2, m: or(keep(D.torso, (x, y) => straps(x, y, 49)), mk(poly([[23, 74], [41, 74], [48, 112], [43, 114], [38, 112], [32, 114], [26, 112], [21, 114], [16, 112]]))), col,
        fx: (x, y) => (y >= 71 && y <= 73) ? (col === 'leo' ? '#3b2416' : mix(col, '#ff4f9a', .45)) : null }] }],
    shoes: [
      { id: 'flats', name: 'Flats', colors: first('#ff8fc8'), make: col => [
        { z: 1, m: or(D.footL, keep(D.legL, (x, y) => y >= 143)), col }, { z: 1, m: or(D.footR, keep(D.legR, (x, y) => y >= 143)), col }] },
      { id: 'boots', name: 'Boots', colors: first('#3d3346'), make: col => [
        { z: 1, m: or(D.footL, keep(D.legL, (x, y) => y >= 122)), col, fx: bootTop },
        { z: 1, m: or(D.footR, keep(D.legR, (x, y) => y >= 122)), col, fx: bootTop }] },
    ],
    ears: [{ id: 'ears', name: 'Kitty ears', colors: CLOTH, make: col => [
      { z: 5, m: mk(down, poly(earPts), poly(mir(earPts)),
          c => { c.lineWidth = 2; c.beginPath(); c.ellipse(32, 25.5, 13, 13, 0, Math.PI * 1.06, Math.PI * 1.94); c.stroke(); }), col },
      { z: 5, m: mk(down, poly(innerEar), poly(mir(innerEar))), col: '#ffb3cf', flat: true }] }],
    tail: [{ id: 'tail', name: 'Tail', colors: CLOTH, make: col => [
      { z: 0, m: mk(c => { c.lineWidth = 4.5; c.beginPath(); c.moveTo(38, 84); c.bezierCurveTo(56, 90, 44, 118, 55, 128); c.stroke(); }), col }] }],
    bow: [{ id: 'bow', name: 'Bow', colors: first('#ff8fc8'), make: col => [
      { z: 5, m: mk(down, poly([[42, 13], [36.5, 8.5], [36.5, 17.5]]), poly([[42, 13], [47.5, 8.5], [47.5, 17.5]]), ell(42, 13, 2, 2)), col }] }],
  };
  const SLOTS = ['hair', 'tail', 'bottom', 'shoes', 'top', 'dress', 'ears', 'bow'];
  const TABS = [
    { id: 'mine', icon: '💖', label: 'My Dolls' },
    { id: 'body', icon: '🙂', label: 'Me' },
    { id: 'hair', icon: '💇', label: 'Hair', slots: ['hair'] },
    { id: 'top', icon: '👕', label: 'Tops', slots: ['top'] },
    { id: 'bottom', icon: '👖', label: 'Bottoms', slots: ['bottom'] },
    { id: 'dress', icon: '👗', label: 'Dresses', slots: ['dress'] },
    { id: 'shoes', icon: '👟', label: 'Shoes', slots: ['shoes'] },
    { id: 'extras', icon: '🎀', label: 'Extras', slots: ['ears', 'tail', 'bow'] },
  ];
  const find = (slot, id) => ITEMS[slot] && ITEMS[slot].find(i => i.id === id);

  const starter = () => ({
    skin: 1, hair: { id: 'long', col: HAIRS[0] },
    top: { id: 'tee', col: 'leo' }, bottom: { id: 'leggings', col: 'leo' }, dress: null,
    shoes: { id: 'flats', col: '#ff8fc8' }, ears: { id: 'ears', col: 'leo' }, tail: { id: 'tail', col: 'leo' }, bow: null,
  });
  const copy = d => JSON.parse(JSON.stringify(d));

  function dollPieces(d) {
    const s = SKINS[d.skin] || SKINS[0], hair = d.hair ? d.hair.col : HAIRS[0];
    let ps = [...skinPieces(s), ...facePieces(s, hair)];
    for (const slot of SLOTS) {
      const it = d[slot] && find(slot, d[slot].id);
      if (it) ps = ps.concat(it.make(d[slot].col));
    }
    return ps;
  }

  // Crop a render to its pixels and scale it up by a whole number (keeps pixels crisp).
  function crop(img) {
    const d = img.data; let x0 = W, y0 = H, x1 = 0, y1 = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (d[(y * W + x) * 4 + 3]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(img, 0, 0);
    return { t, x0, y0, w: x1 - x0 + 1, h: y1 - y0 + 1 };
  }
  function thumb(pieces, size = 64) {
    const { t, x0, y0, w, h } = crop(render(pieces)), k = Math.max(1, Math.floor(size * (window.devicePixelRatio || 1) / Math.max(w, h)));
    const c = document.createElement('canvas'); c.width = w * k; c.height = h * k;
    const cx = c.getContext('2d'); cx.imageSmoothingEnabled = false; cx.drawImage(t, x0, y0, w, h, 0, 0, w * k, h * k);
    const s = size / Math.max(w, h); c.style.width = w * s + 'px'; c.style.height = h * s + 'px';
    return c;
  }

  // ================= Saved dolls -> stickers =================
  let dolls = [];
  try { const d = JSON.parse(localStorage.getItem(SAVE_KEY)); if (Array.isArray(d)) dolls = d; } catch (e) { }
  const persist = () => { try { localStorage.setItem(SAVE_KEY, JSON.stringify(dolls)); } catch (e) { } };
  const keyOf = id => 'doll-' + id;

  function stickerSvg(outfit) {
    const K = 4, c = document.createElement('canvas'); c.width = W * K; c.height = H * K;
    const cx = c.getContext('2d'); cx.imageSmoothingEnabled = false;
    const t = document.createElement('canvas'); t.width = W; t.height = H; t.getContext('2d').putImageData(render(dollPieces(outfit)), 0, 0);
    cx.drawImage(t, 0, 0, W * K, H * K);
    // The doll fills the 100-tall sticker box; the box is square, so she sits in the middle.
    return `<image href="${c.toDataURL()}" x="30" y="0" width="40" height="100" style="image-rendering:pixelated"/>`;
  }
  function registerAll() {
    for (const k of Object.keys(STICKERS)) if (k.startsWith('doll-')) delete STICKERS[k];
    dolls.forEach(d => { STICKERS[keyOf(d.id)] = { svg: stickerSvg(d.outfit), size: 230 }; });
    const at = CATEGORIES.findIndex(c => c.id === 'dolls');
    if (at >= 0) CATEGORIES.splice(at, 1);
    if (dolls.length) CATEGORIES.push({ id: 'dolls', name: 'Dolls', icon: keyOf(dolls[dolls.length - 1].id), items: dolls.map(d => keyOf(d.id)).reverse() });
  }
  registerAll();

  // ================= Studio screen =================
  const $ = s => document.querySelector(s);
  let doll = starter(), editing = null, tab = 'top', scale = 3, opts = {};
  const active = { hair: 'hair', top: 'top', bottom: 'bottom', dress: 'dress', shoes: 'shoes', extras: 'ears' };
  const small = document.createElement('canvas'); small.width = W; small.height = H;
  const sctx = small.getContext('2d');
  let big, bctx;

  const tone = (...a) => opts.tone && opts.tone(...a);
  const sfx = {
    on: () => { tone(660, .1, { type: 'triangle', vol: .12 }); tone(990, .12, { type: 'triangle', vol: .1, at: .07 }); },
    off: () => tone(440, .12, { to: 300, type: 'triangle', vol: .12 }),
    tap: () => tone(660, .08, { type: 'triangle', vol: .12 }),
    tada: () => [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, .3, { type: 'triangle', vol: .14, at: i * .09 })),
  };

  function draw() {
    sctx.putImageData(render(dollPieces(doll)), 0, 0);
    bctx.imageSmoothingEnabled = false;
    bctx.clearRect(0, 0, big.width, big.height);
    bctx.drawImage(small, 0, 0, big.width, big.height);
  }
  function fit() {
    if ($('#studio').classList.contains('hidden')) return;
    const st = $('#dsStage'), dpr = window.devicePixelRatio || 1;
    const h = st.clientHeight - 24, w = st.clientWidth - 24;
    scale = Math.max(1, Math.floor(Math.min(h * dpr / H, w * dpr / W)));
    big.width = W * scale; big.height = H * scale;
    const cw = W * scale / dpr, ch = H * scale / dpr;
    big.style.width = cw + 'px'; big.style.height = ch + 'px';
    const fs = $('#dsShadow');
    fs.style.top = (st.clientHeight / 2 + ch / 2 - 13 * scale / dpr) + 'px';
    fs.style.width = (26 * scale / dpr) + 'px'; fs.style.height = (5 * scale / dpr) + 'px';
    draw();
  }

  function sparkle(n = 8) {
    const fx = $('#dsFx'), r = big.getBoundingClientRect(), s = $('#dsStage').getBoundingClientRect();
    for (let i = 0; i < n; i++) {
      const e = document.createElement('div'), a = Math.random() * 6.28, d = 70 + Math.random() * 110;
      e.className = 'spark'; e.textContent = ['✦', '★', '♥'][i % 3];
      e.style.cssText = `left:${r.left - s.left + r.width / 2}px;top:${r.top - s.top + r.height * .4}px;color:${['#ff6fae', '#c77dff', '#ffb703', '#4dabf7'][i % 4]};--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
      fx.appendChild(e); setTimeout(() => e.remove(), 750);
    }
  }

  function wear(slot, id) {
    const cur = doll[slot];
    if (cur && cur.id === id) { if (slot !== 'hair') { doll[slot] = null; sfx.off(); } }
    else {
      const it = find(slot, id);
      doll[slot] = { id, col: cur && it.colors.includes(cur.col) ? cur.col : it.colors[0] };
      if (slot === 'dress') { doll.top = null; doll.bottom = null; }
      if (slot === 'top' || slot === 'bottom') doll.dress = null;
      sfx.on(); sparkle(5);
    }
    active[tab] = slot;
    draw(); renderTray();
  }

  function button(cls, onclick) { const b = document.createElement('button'); b.className = cls; b.onclick = onclick; return b; }

  function renderTray() {
    const tabs = $('#dsTabs'); tabs.innerHTML = '';
    TABS.forEach(t => {
      const b = button('tab' + (t.id === tab ? ' on' : ''), () => { sfx.tap(); tab = t.id; renderTray(); });
      b.innerHTML = `<span class="ds-ico">${t.icon}</span><span>${t.label}</span>`;
      tabs.appendChild(b);
    });
    const sheet = $('#dsSheet'), colors = $('#dsColors');
    sheet.innerHTML = ''; colors.innerHTML = '';
    colors.classList.remove('hidden');

    if (tab === 'mine') {
      colors.classList.add('hidden');
      const nb = button('ds-item ds-new', () => { sfx.tap(); doll = starter(); editing = null; tab = 'top'; draw(); renderTray(); sparkle(6); });
      nb.innerHTML = '<span>➕</span><small>New</small>';
      sheet.appendChild(nb);
      dolls.slice().reverse().forEach(d => {
        const b = button('ds-item' + (editing === d.id ? ' on' : ''), () => { sfx.on(); doll = copy(d.outfit); editing = d.id; draw(); renderTray(); sparkle(5); });
        b.appendChild(thumb(dollPieces(d.outfit), 76));
        const x = document.createElement('span'); x.className = 'ds-x'; x.textContent = '✕';
        x.onclick = e => { e.stopPropagation(); askRemove(d.id); };
        b.appendChild(x);
        sheet.appendChild(b);
      });
      return;
    }
    if (tab === 'body') {
      colors.classList.add('hidden');
      SKINS.forEach((s, i) => {
        const b = button('ds-item' + (doll.skin === i ? ' on' : ''), () => { doll.skin = i; sfx.on(); draw(); renderTray(); });
        b.innerHTML = `<div class="ds-swatch" style="background:${s}"></div>`;
        sheet.appendChild(b);
      });
      return;
    }
    const T = TABS.find(t => t.id === tab);
    T.slots.forEach(slot => ITEMS[slot].forEach(it => {
      const worn = doll[slot] && doll[slot].id === it.id;
      const b = button('ds-item' + (worn ? ' on' : ''), () => wear(slot, it.id));
      b.setAttribute('aria-label', it.name);
      b.appendChild(thumb(it.make(worn ? doll[slot].col : it.colors[0]), 64));
      sheet.appendChild(b);
    }));
    const slot = T.slots.includes(active[tab]) ? active[tab] : T.slots[0], cur = doll[slot];
    if (cur) find(slot, cur.id).colors.forEach(c => {
      const d = button('ds-dot' + (c === 'leo' ? ' leo' : '') + (cur.col === c ? ' on' : ''), () => { cur.col = c; sfx.on(); draw(); renderTray(); });
      if (c !== 'leo') d.style.background = c;
      colors.appendChild(d);
    });
  }

  let removing = null;
  function askRemove(id) { sfx.tap(); removing = id; $('#dsModal').classList.remove('hidden'); }

  const pick = a => a[Math.floor(Math.random() * a.length)];
  function surprise() {
    doll.skin = Math.floor(Math.random() * SKINS.length);
    doll.hair = { id: pick(ITEMS.hair).id, col: pick(HAIRS) };
    if (Math.random() < .4) { const d = pick(ITEMS.dress); doll.dress = { id: d.id, col: pick(d.colors) }; doll.top = doll.bottom = null; }
    else {
      doll.dress = null;
      for (const s of ['top', 'bottom']) { const it = pick(ITEMS[s]); doll[s] = { id: it.id, col: pick(it.colors) }; }
    }
    { const it = pick(ITEMS.shoes); doll.shoes = { id: it.id, col: pick(it.colors) }; }
    for (const s of ['ears', 'tail', 'bow']) doll[s] = Math.random() < .4 ? { id: ITEMS[s][0].id, col: pick(ITEMS[s][0].colors) } : null;
    tone(523, .1, { type: 'triangle', vol: .12 }); tone(784, .15, { type: 'triangle', vol: .12, at: .08 });
    sparkle(10); draw(); renderTray();
  }

  function done() {
    sfx.tada(); sparkle(24);
    let msg = 'New sticker!';
    if (editing && dolls.some(d => d.id === editing)) { dolls.find(d => d.id === editing).outfit = copy(doll); msg = 'Saved!'; }
    else dolls.push({ id: Date.now(), outfit: copy(doll) }); // never reused, so old room stickers can't turn into a new doll
    persist(); registerAll();
    const old = $('#dsSaved'); if (old) old.remove();
    const box = document.createElement('div'); box.id = 'dsSaved';
    box.appendChild(thumb(dollPieces(doll), 120));
    const p = document.createElement('div'); p.textContent = msg + ' 💖'; box.appendChild(p);
    $('#dsStage').appendChild(box);
    setTimeout(() => { box.style.opacity = 0; setTimeout(() => box.remove(), 400); }, 2600);
    if (tab === 'mine') renderTray();
  }

  function open(o) {
    opts = o || {};
    big = $('#dsDoll'); bctx = big.getContext('2d');
    $('#studio').classList.remove('hidden');
    renderTray(); fit();
  }
  function close() { $('#studio').classList.add('hidden'); }

  document.addEventListener('DOMContentLoaded', () => {
    $('#dsHome').onclick = () => { sfx.tap(); close(); opts.onHome && opts.onHome(); };
    $('#dsRandom').onclick = surprise;
    $('#dsDone').onclick = done;
    $('#dsNo').onclick = () => { sfx.tap(); removing = null; $('#dsModal').classList.add('hidden'); };
    $('#dsYes').onclick = () => {
      dolls = dolls.filter(d => d.id !== removing);
      if (editing === removing) editing = null;
      removing = null; persist(); registerAll();
      tone(600, .25, { to: 150, type: 'triangle', vol: .18 });
      $('#dsModal').classList.add('hidden'); renderTray();
    };
    window.addEventListener('resize', fit);
    if (window.ResizeObserver) new ResizeObserver(fit).observe($('#dsStage'));
  });

  // Small picture of the newest doll for the home screen card.
  const preview = size => thumb(dollPieces(dolls.length ? dolls[dolls.length - 1].outfit : starter()), size);

  return { open, preview };
})();
