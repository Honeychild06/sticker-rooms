// Sticker art (100x100 SVG), sticker categories, and room backgrounds.

const INK = '#5a3a6e';
const O = `stroke="${INK}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"`;

const eye = (x, y, r = 4, iris = null) => iris
  ? `<circle cx="${x}" cy="${y}" r="${r + 1}" fill="${iris}"/><ellipse cx="${x}" cy="${y}" rx="${r * 0.45}" ry="${r}" fill="#2a1f33"/><circle cx="${x + 1.3}" cy="${y - 1.6}" r="${r * 0.35}" fill="#fff"/>`
  : `<circle cx="${x}" cy="${y}" r="${r}" fill="#3a2a4a"/><circle cx="${x + r * 0.35}" cy="${y - r * 0.35}" r="${r * 0.38}" fill="#fff"/>`;
const blush = (x, y, k = 1) => `<ellipse cx="${x}" cy="${y}" rx="${5 * k}" ry="${3 * k}" fill="#ff8fb8" opacity=".6"/>`;
const smile = (x, y, w = 4, c = INK) => `<path d="M${x - w} ${y} q${w} ${w * 0.9} ${w * 2} 0" stroke="${c}" stroke-width="2.2" fill="none" stroke-linecap="round"/>`;
const thick = (d, c, w = 7) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;

function starPath(cx, cy, R, r, n = 5, rot = -90) {
  let d = '';
  for (let i = 0; i < n * 2; i++) {
    const a = (rot + i * 180 / n) * Math.PI / 180, rr = i % 2 ? r : R;
    d += (i ? 'L' : 'M') + (cx + rr * Math.cos(a)).toFixed(1) + ' ' + (cy + rr * Math.sin(a)).toFixed(1);
  }
  return d + 'Z';
}
const sprinkles = (list) => list.map(([x, y, a, c]) =>
  `<rect x="${x - 3}" y="${y - 1.2}" width="6" height="2.4" rx="1.2" fill="${c}" transform="rotate(${a} ${x} ${y})"/>`).join('');

// ---------- Cats ----------
function cat(c, d, inner, opts = {}) {
  const lc = opts.light ? '#f3e6ff' : INK;
  const horn = opts.horn ? `<path d="M50 0 L44 22 L56 22 Z" fill="#ffd86b" ${O}/><path d="M46 14 L54 11 M45 19 L55 16" stroke="#e9a93a" stroke-width="2"/>` : '';
  return `
  ${thick('M68 84 C90 84 92 62 82 58', c)}
  <ellipse cx="50" cy="72" rx="23" ry="20" fill="${c}" ${O}/>
  <ellipse cx="50" cy="77" rx="12" ry="11" fill="#fff" opacity=".45"/>
  <ellipse cx="41" cy="90" rx="8" ry="5" fill="${c}" ${O}/><ellipse cx="59" cy="90" rx="8" ry="5" fill="${c}" ${O}/>
  <path d="M26 36 L28 10 L46 24 Z" fill="${c}" ${O}/><path d="M74 36 L72 10 L54 24 Z" fill="${c}" ${O}/>
  <path d="M30 28 L31 16 L40 23 Z" fill="${inner}"/><path d="M70 28 L69 16 L60 23 Z" fill="${inner}"/>
  ${horn}
  <ellipse cx="50" cy="42" rx="27" ry="22" fill="${c}" ${O}/>
  ${d ? `<path d="M44 22 l2 6 M50 21 v7 M56 22 l-2 6" stroke="${d}" stroke-width="3" stroke-linecap="round"/>` : ''}
  ${eye(40, 42, 4.5, opts.iris)}${eye(60, 42, 4.5, opts.iris)}
  <path d="M47.5 48 h5 l-2.5 3 Z" fill="#ff7fa8"/>
  <path d="M45 52 q2.5 3 5 0 q2.5 3 5 0" stroke="${lc}" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M20 45 l11 2 M20 52 l11 -1 M80 45 l-11 2 M80 52 l-11 -1" stroke="${lc}" stroke-width="1.6" stroke-linecap="round"/>
  ${blush(33, 51)}${blush(67, 51)}`;
}

function sleepyCat(c, d) {
  return `
  ${thick('M84 76 C98 70 94 50 82 56', c)}
  <ellipse cx="58" cy="68" rx="34" ry="20" fill="${c}" ${O}/>
  ${d ? `<path d="M60 50 q4 8 0 14 M72 52 q4 8 0 14" stroke="${d}" stroke-width="3" fill="none" stroke-linecap="round"/>` : ''}
  <path d="M17 54 L16 36 L30 46 Z" fill="${c}" ${O}/><path d="M36 45 L46 34 L47 54 Z" fill="${c}" ${O}/>
  <circle cx="32" cy="62" r="18" fill="${c}" ${O}/>
  <ellipse cx="42" cy="82" rx="10" ry="5" fill="${c}" ${O}/>
  <path d="M22 62 q4 3 8 0 M35 62 q4 3 8 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
  <path d="M30.5 67 h3 l-1.5 2 Z" fill="#ff7fa8"/>
  ${blush(22, 69, .7)}${blush(42, 69, .7)}
  <text x="58" y="40" font-size="14" font-weight="700" fill="#a77bff" font-family="Fredoka,sans-serif">z</text>
  <text x="68" y="28" font-size="19" font-weight="700" fill="#a77bff" font-family="Fredoka,sans-serif">Z</text>`;
}

function fish(c, s) {
  return `
  <path d="M38 32 Q48 16 60 30" fill="${s}" ${O}/>
  <path d="M74 50 L94 33 L89 50 L94 67 Z" fill="${s}" ${O}/>
  <ellipse cx="46" cy="50" rx="32" ry="22" fill="${c}" ${O}/>
  <path d="M56 31 Q50 50 56 69 M66 35 Q61 50 66 65" stroke="${s}" stroke-width="4" fill="none" stroke-linecap="round"/>
  ${eye(28, 46, 5)}${blush(30, 57, .7)}${smile(36, 56, 3)}`;
}

// ---------- Unicorns ----------
function unicorn(m1, m2, m3, m4 = m1) {
  return `
  <circle cx="72" cy="30" r="12" fill="${m1}" ${O}/><circle cx="80" cy="46" r="12" fill="${m2}" ${O}/>
  <circle cx="79" cy="62" r="11" fill="${m3}" ${O}/><circle cx="73" cy="77" r="10" fill="${m4}" ${O}/>
  <circle cx="27" cy="38" r="9" fill="${m2}" ${O}/>
  <path d="M32 32 L27 12 L43 25 Z" fill="#fff" ${O}/><path d="M68 32 L73 12 L57 25 Z" fill="#fff" ${O}/>
  <path d="M33 26 L31 18 L38 24 Z" fill="#ffc2dd"/><path d="M67 26 L69 18 L62 24 Z" fill="#ffc2dd"/>
  <ellipse cx="50" cy="52" rx="24" ry="26" fill="#fff" ${O}/>
  <ellipse cx="50" cy="69" rx="13" ry="8.5" fill="#ffe8f3"/>
  <ellipse cx="45.5" cy="67" rx="1.4" ry="1" fill="#e7a3c4"/><ellipse cx="54.5" cy="67" rx="1.4" ry="1" fill="#e7a3c4"/>
  ${smile(50, 70.5, 3.5)}
  <path d="M50 2 L42 30 L58 30 Z" fill="#ffd86b" ${O}/>
  <path d="M45.5 20 L55 16 M44 26 L57 22 M47.5 12 L53 9.5" stroke="#e9a93a" stroke-width="2"/>
  <circle cx="41" cy="30" r="8" fill="${m1}" ${O}/><circle cx="56" cy="31" r="6.5" fill="${m3}" ${O}/>
  ${eye(40, 53, 5)}${eye(60, 53, 5)}
  <path d="M35 51 l-4 -1.5 M35.5 54.5 l-4 .5 M65 51 l4 -1.5 M64.5 54.5 l4 .5" stroke="${INK}" stroke-width="1.8" stroke-linecap="round"/>
  ${blush(33, 62)}${blush(67, 62)}`;
}

// ---------- Mermaids ----------
function mermaid(skin, hair, tail, top) {
  return `
  <path d="M33 24 C27 44 25 60 34 68 C42 62 58 62 66 68 C75 60 73 44 67 24 Z" fill="${hair}" ${O}/>
  ${thick('M42 44 Q33 52 40 60', skin, 4)}${thick('M58 44 Q67 52 60 60', skin, 4)}
  <path d="M42 40 Q50 37 58 40 L60 60 L40 60 Z" fill="${skin}" ${O}/>
  <path d="M40 57 C38 74 44 82 50 86 C56 82 62 74 60 57 Z" fill="${tail}" ${O}/>
  <path d="M50 83 Q36 79 27 94 Q42 97 50 88 Q58 97 73 94 Q64 79 50 83 Z" fill="${tail}" ${O}/>
  <path d="M44 66 q3 3 6 0 q3 3 6 0 M46 74 q2 3 4 0 q2 3 4 0" stroke="#fff" stroke-width="1.8" fill="none" opacity=".7"/>
  <circle cx="45" cy="47" r="5" fill="${top}" ${O}/><circle cx="55" cy="47" r="5" fill="${top}" ${O}/>
  <circle cx="50" cy="26" r="14" fill="${skin}" ${O}/>
  <path d="M36 27 Q35 10 50 11 Q65 10 64 27 Q58 18 50 19 Q42 18 36 27 Z" fill="${hair}" ${O}/>
  <path d="${starPath(62, 13, 6, 2.8)}" fill="#ffd86b" ${O} stroke-width="1.5"/>
  ${eye(45, 28, 2.6)}${eye(55, 28, 2.6)}${smile(50, 33, 2.6)}${blush(42, 32, .5)}${blush(58, 32, .5)}`;
}

const STICKERS = {
  // Cats
  'cat-orange': { svg: cat('#ffb35c', '#f08a24', '#ff9ec2') },
  'cat-gray': { svg: cat('#c3c3d6', '#9a9ab4', '#ffb3cf') },
  'cat-black': { svg: cat('#4b4459', null, '#ff9ec2', { light: true, iris: '#b7f36a' }) },
  'cat-white': { svg: cat('#ffffff', null, '#ffb3cf') },
  'caticorn': { svg: cat('#e7c6ff', null, '#ff9ec2', { horn: true }) },
  'cat-sleep': { svg: sleepyCat('#ffb35c', '#f08a24'), size: 170 },
  'cat-sleep2': { svg: sleepyCat('#c3c3d6', null), size: 170 },
  'yarn': { size: 110, svg: `
    ${thick('M70 72 Q86 80 80 90 Q74 97 90 96', '#c084fc', 3)}
    <circle cx="48" cy="52" r="30" fill="#c084fc" ${O}/>
    <path d="M24 42 Q46 58 70 32 M21 56 Q50 72 76 50 M32 76 Q38 52 60 25 M48 81 Q56 60 76 64" stroke="#9a5ae0" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  'paw': { size: 110, svg: `
    <ellipse cx="50" cy="64" rx="21" ry="17" fill="#ff9ec7" ${O}/>
    <ellipse cx="26" cy="42" rx="8" ry="10" fill="#ff9ec7" ${O}/><ellipse cx="41" cy="28" rx="8" ry="10" fill="#ff9ec7" ${O}/>
    <ellipse cx="59" cy="28" rx="8" ry="10" fill="#ff9ec7" ${O}/><ellipse cx="74" cy="42" rx="8" ry="10" fill="#ff9ec7" ${O}/>` },
  'fish-blue': { svg: fish('#8fd3ff', '#4fb0f0'), size: 120 },

  // Unicorns
  'uni-pink': { svg: unicorn('#ff8fc8', '#c77dff', '#ffb3de') },
  'uni-rainbow': { svg: unicorn('#ff7b9c', '#ffd166', '#6ee7b7', '#74c0fc') },
  'uni-mint': { svg: unicorn('#7ee8d6', '#a5b4fc', '#c4f1ff') },
  'castle': { size: 260, svg: `
    <rect x="14" y="40" width="20" height="52" fill="#ffd1ea" ${O}/><rect x="66" y="40" width="20" height="52" fill="#ffd1ea" ${O}/>
    <path d="M10 42 L24 12 L38 42 Z" fill="#b57cff" ${O}/><path d="M62 42 L76 12 L90 42 Z" fill="#b57cff" ${O}/>
    <rect x="28" y="52" width="44" height="40" fill="#ffe3f2" ${O}/>
    <path d="M28 52 v-6 h7 v6 M38 52 v-6 h7 v6 M55 52 v-6 h7 v6 M65 52 v-6 h7 v6" fill="#ffe3f2" ${O}/>
    <rect x="39" y="30" width="22" height="62" fill="#ffd1ea" ${O}/>
    <path d="M35 32 L50 4 L65 32 Z" fill="#c77dff" ${O}/>
    <path d="M50 4 V-2" stroke="${INK}" stroke-width="2"/><path d="M50 -4 L60 -1 L50 2 Z" fill="#ff6fae"/>
    <path d="M43 92 V80 a7 7 0 0 1 14 0 V92 Z" fill="#8a4fd8" ${O}/>
    <path d="M45 52 a5 5 0 0 1 10 0 v6 h-10 Z" fill="#bfe9ff" ${O}/>
    <circle cx="24" cy="58" r="4" fill="#bfe9ff" ${O}/><circle cx="76" cy="58" r="4" fill="#bfe9ff" ${O}/>
    <path d="M50 72 c-3 -4 -8 -1 -5 3 l5 4 l5 -4 c3 -4 -2 -7 -5 -3 Z" fill="#ff6fae"/>` },
  'wand': { size: 140, svg: `
    ${thick('M26 90 L58 44', '#c77dff', 6)}
    <path d="M30 84 l6 3 M36 76 l6 3 M42 68 l6 3 M48 60 l6 3" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
    <path d="${starPath(66, 32, 26, 12)}" fill="#ffd84d" ${O}/>
    ${eye(60, 32, 2.6)}${eye(72, 32, 2.6)}${smile(66, 38, 2.5)}
    <path d="M86 60 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 l5 -2 Z M22 30 l1.5 4 l4 1.5 l-4 1.5 l-1.5 4 l-1.5 -4 l-4 -1.5 l4 -1.5 Z" fill="#ff9ecf"/>` },
  'tiara': { size: 140, svg: `
    <path d="M14 74 L20 38 L35 58 L50 24 L65 58 L80 38 L86 74 Z" fill="#ffd86b" ${O}/>
    <rect x="12" y="70" width="76" height="12" rx="6" fill="#ffc94a" ${O}/>
    <circle cx="20" cy="38" r="5" fill="#ff6fae" ${O}/><circle cx="50" cy="24" r="6" fill="#c77dff" ${O}/><circle cx="80" cy="38" r="5" fill="#ff6fae" ${O}/>
    <path d="M50 56 l6 6 l-6 6 l-6 -6 Z" fill="#7ee8d6" ${O}/>
    <circle cx="30" cy="76" r="2.5" fill="#fff"/><circle cx="70" cy="76" r="2.5" fill="#fff"/>` },
  'horseshoe-heart': { size: 110, svg: `
    <path d="M50 88 C18 66 8 46 16 30 C24 14 44 16 50 30 C56 16 76 14 84 30 C92 46 82 66 50 88 Z" fill="#c77dff" ${O}/>
    <path d="M30 34 Q34 26 40 30" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".8"/>
    <path d="${starPath(50, 52, 14, 6)}" fill="#ffd84d" ${O} stroke-width="2"/>` },

  // Mermaids & sea
  'mermaid-1': { svg: mermaid('#ffd9b8', '#a66cff', '#4fd1c5', '#ff8fc8'), size: 170 },
  'mermaid-2': { svg: mermaid('#b9794e', '#ff6fae', '#a66cff', '#ffd86b'), size: 170 },
  'shell': { size: 110, svg: `
    <path d="M40 82 L50 94 L60 82 Z" fill="#ffb3d1" ${O}/>
    <path d="M50 88 L13 46 Q20 16 50 13 Q80 16 87 46 Z" fill="#ffb3d1" ${O}/>
    <path d="M50 86 L22 32 M50 86 L35 19 M50 86 L50 15 M50 86 L65 19 M50 86 L78 32" stroke="#ff7fb5" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="50" cy="70" r="7" fill="#fff" ${O}/><circle cx="48" cy="68" r="2" fill="#fff" stroke="#ffd6ea"/>` },
  'starfish': { size: 120, svg: `
    <path d="${starPath(50, 54, 44, 20)}" fill="#ffa36c" ${O} stroke-width="3"/>
    <circle cx="50" cy="24" r="2" fill="#ffd2b5"/><circle cx="22" cy="46" r="2" fill="#ffd2b5"/><circle cx="78" cy="46" r="2" fill="#ffd2b5"/>
    <circle cx="33" cy="80" r="2" fill="#ffd2b5"/><circle cx="67" cy="80" r="2" fill="#ffd2b5"/>
    ${eye(43, 50, 3.5)}${eye(57, 50, 3.5)}${smile(50, 58, 3.5)}${blush(39, 58, .6)}${blush(61, 58, .6)}` },
  'fish-pink': { svg: fish('#ff9ecf', '#ff6fae'), size: 130 },
  'fish-yellow': { svg: fish('#ffe066', '#ffb703'), size: 130 },
  'octopus': { svg: `
    ${thick('M30 60 Q18 74 26 88', '#b57cff', 9)}${thick('M42 64 Q38 80 44 92', '#b57cff', 9)}
    ${thick('M58 64 Q62 80 56 92', '#b57cff', 9)}${thick('M70 60 Q82 74 74 88', '#b57cff', 9)}
    <path d="M22 64 C17 30 33 12 50 12 C67 12 83 30 78 64 Z" fill="#b57cff" ${O}/>
    <circle cx="36" cy="26" r="4" fill="#d6b4ff"/><circle cx="64" cy="24" r="3" fill="#d6b4ff"/><circle cx="58" cy="34" r="2.5" fill="#d6b4ff"/>
    ${eye(40, 46, 5)}${eye(60, 46, 5)}${smile(50, 55, 4)}${blush(32, 54)}${blush(68, 54)}` },
  'bubbles': { size: 110, svg: `
    ${[[40, 60, 18], [68, 34, 12], [70, 72, 9], [28, 26, 8]].map(([x, y, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="#c9f2ff" fill-opacity=".85" stroke="#56b9e0" stroke-width="2.5"/>
       <path d="M${x - r * .55} ${y - r * .2} a${r * .6} ${r * .6} 0 0 1 ${r * .5} ${-r * .4}" stroke="#fff" stroke-width="2.5" fill="none" stroke-linecap="round"/>`).join('')}` },
  'clam': { size: 100, svg: `
    <ellipse cx="50" cy="66" rx="34" ry="20" fill="#a66cff" ${O}/>
    <path d="M18 62 Q50 4 82 62 Z" fill="#c9a3ff" ${O}/>
    <ellipse cx="50" cy="64" rx="26" ry="10" fill="#7b46d6"/>
    <circle cx="50" cy="60" r="12" fill="#fff" ${O}/><circle cx="46" cy="56" r="3.5" fill="#fff" stroke="#f0e6ff" stroke-width="2"/>` },

  // Home
  'bed': { size: 280, svg: `
    <rect x="11" y="74" width="6" height="14" rx="2" fill="#8a4fd8" ${O}/><rect x="83" y="74" width="6" height="14" rx="2" fill="#8a4fd8" ${O}/>
    <path d="M8 76 V36 Q8 22 22 22 H78 Q92 22 92 36 V76 Z" fill="#c77dff" ${O}/>
    <path d="M50 44 c-6 -8 -16 -2 -10 6 l10 8 l10 -8 c6 -8 -4 -14 -10 -6 Z" fill="#ff9ecf" ${O} stroke-width="2"/>
    <rect x="5" y="56" width="90" height="22" rx="6" fill="#fff" ${O}/>
    <rect x="10" y="46" width="24" height="14" rx="7" fill="#fff6fb" ${O}/>
    <path d="M32 52 H90 Q96 52 96 58 V80 H32 Z" fill="#ff9ecf" ${O}/>
    <path d="M32 60 H96" stroke="#fff" stroke-width="3" opacity=".7"/>
    <circle cx="46" cy="70" r="2.5" fill="#fff"/><circle cx="60" cy="68" r="2.5" fill="#fff"/><circle cx="74" cy="71" r="2.5" fill="#fff"/><circle cx="87" cy="68" r="2.5" fill="#fff"/>` },
  'armchair': { size: 190, svg: `
    <rect x="22" y="80" width="7" height="12" rx="2" fill="#8a4fd8" ${O}/><rect x="71" y="80" width="7" height="12" rx="2" fill="#8a4fd8" ${O}/>
    <rect x="20" y="16" width="60" height="56" rx="18" fill="#b57cff" ${O}/>
    <rect x="22" y="58" width="56" height="22" rx="9" fill="#d6b4ff" ${O}/>
    <rect x="8" y="44" width="20" height="38" rx="10" fill="#c99bff" ${O}/><rect x="72" y="44" width="20" height="38" rx="10" fill="#c99bff" ${O}/>
    <path d="M50 38 c-5 -7 -14 -2 -9 5 l9 7 l9 -7 c5 -7 -4 -12 -9 -5 Z" fill="#ff9ecf" ${O} stroke-width="2"/>` },
  'lamp': { size: 180, svg: `
    <ellipse cx="50" cy="90" rx="18" ry="6" fill="#c77dff" ${O}/>
    <rect x="47" y="44" width="6" height="44" fill="#c77dff" ${O}/>
    <path d="M30 14 H70 L82 46 H18 Z" fill="#ffb3de" ${O}/>
    <path d="M18 46 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0 q4 6 8 0" fill="#ff8fc8" ${O} stroke-width="2"/>
    <circle cx="40" cy="30" r="3" fill="#fff"/><circle cx="56" cy="24" r="3" fill="#fff"/><circle cx="62" cy="36" r="3" fill="#fff"/>` },
  'plant': { size: 160, svg: `
    <ellipse cx="34" cy="36" rx="9" ry="22" fill="#6fd08c" ${O} transform="rotate(-28 34 36)"/>
    <ellipse cx="66" cy="36" rx="9" ry="22" fill="#6fd08c" ${O} transform="rotate(28 66 36)"/>
    <ellipse cx="50" cy="28" rx="9" ry="24" fill="#86e0a0" ${O}/>
    <ellipse cx="24" cy="54" rx="7" ry="16" fill="#86e0a0" ${O} transform="rotate(-60 24 54)"/>
    <ellipse cx="76" cy="54" rx="7" ry="16" fill="#6fd08c" ${O} transform="rotate(60 76 54)"/>
    <path d="M30 62 H70 L64 93 H36 Z" fill="#ff9ecf" ${O}/>
    <rect x="26" y="56" width="48" height="11" rx="4" fill="#ffb3de" ${O}/>
    <path d="M44 78 c-3 -4 -8 -1 -5 3 l5 4 l5 -4 c3 -4 -2 -7 -5 -3 Z" fill="#fff"/>` },
  'window': { size: 220, svg: `
    <path d="M6 6 H94" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>
    <rect x="14" y="12" width="72" height="76" rx="6" fill="#fff" ${O}/>
    <rect x="20" y="18" width="60" height="64" rx="3" fill="#bfe9ff"/>
    <path d="M30 40 a6 6 0 0 1 10 -4 a7 7 0 0 1 12 2 a5 5 0 0 1 2 9 H32 a5 5 0 0 1 -2 -7 Z" fill="#fff"/>
    <circle cx="68" cy="30" r="6" fill="#ffe066"/>
    <rect x="48" y="18" width="4" height="64" fill="#fff"/><rect x="20" y="48" width="60" height="4" fill="#fff"/>
    <path d="M8 6 H30 Q22 50 30 94 H8 Z" fill="#ff9ecf" ${O}/><path d="M92 6 H70 Q78 50 70 94 H92 Z" fill="#ff9ecf" ${O}/>
    <path d="M14 20 V86 M86 20 V86" stroke="#fff" stroke-width="2.5" opacity=".6"/>` },
  'shelf': { size: 220, svg: `
    <rect x="12" y="8" width="76" height="86" rx="5" fill="#e3c6ff" ${O}/>
    <rect x="17" y="13" width="66" height="76" rx="2" fill="#f4e8ff"/>
    <path d="M14 38 H86 M14 64 H86" stroke="${INK}" stroke-width="3"/>
    <rect x="20" y="16" width="8" height="21" fill="#ff6fae" ${O} stroke-width="2"/><rect x="28" y="19" width="8" height="18" fill="#74c0fc" ${O} stroke-width="2"/>
    <rect x="36" y="16" width="8" height="21" fill="#ffd166" ${O} stroke-width="2"/><rect x="46" y="20" width="8" height="17" fill="#6ee7b7" ${O} stroke-width="2" transform="rotate(12 54 37)"/>
    <circle cx="72" cy="30" r="7" fill="#ffb3de" ${O} stroke-width="2"/>
    <rect x="22" y="44" width="8" height="19" fill="#c77dff" ${O} stroke-width="2"/><rect x="30" y="42" width="8" height="21" fill="#ff9ecf" ${O} stroke-width="2"/>
    <path d="M58 63 L64 46 L70 63 Z" fill="#7ee8d6" ${O} stroke-width="2"/><rect x="72" y="50" width="9" height="13" rx="2" fill="#ffd166" ${O} stroke-width="2"/>
    <rect x="22" y="70" width="8" height="18" fill="#ffd166" ${O} stroke-width="2"/><rect x="30" y="68" width="8" height="20" fill="#ff6fae" ${O} stroke-width="2"/>
    <rect x="38" y="71" width="8" height="17" fill="#74c0fc" ${O} stroke-width="2"/>
    <path d="M70 76 c-4 -5 -10 -1 -6 4 l6 5 l6 -5 c4 -5 -2 -9 -6 -4 Z" fill="#ff6fae"/>` },
  'table': { size: 190, svg: `
    <rect x="30" y="66" width="6" height="26" fill="#8a4fd8" ${O}/><rect x="64" y="66" width="6" height="26" fill="#8a4fd8" ${O}/>
    <path d="M10 40 Q10 66 18 72 Q26 64 34 72 Q42 64 50 72 Q58 64 66 72 Q74 64 82 72 Q90 66 90 40 Z" fill="#ff9ecf" ${O}/>
    <ellipse cx="50" cy="40" rx="40" ry="11" fill="#ffd6ea" ${O}/>
    <circle cx="26" cy="60" r="3" fill="#fff"/><circle cx="50" cy="62" r="3" fill="#fff"/><circle cx="74" cy="60" r="3" fill="#fff"/>` },
  'rug': { size: 280, svg: `
    <ellipse cx="50" cy="55" rx="46" ry="26" fill="#c77dff" ${O}/>
    <ellipse cx="50" cy="55" rx="36" ry="19" fill="#ff9ecf"/>
    <ellipse cx="50" cy="55" rx="25" ry="12" fill="#ffd6ea"/>
    <path d="M44 54 c-3 -4 -8 -1 -5 3 l5 4 l5 -4 c3 -4 -2 -7 -5 -3 Z" transform="translate(6 -2)" fill="#ff6fae"/>` },
  'frame': { size: 140, svg: `
    <rect x="16" y="12" width="68" height="76" rx="6" fill="#ffd86b" ${O}/>
    <rect x="24" y="20" width="52" height="60" fill="#fff4fb" ${O} stroke-width="2"/>
    <path d="M34 80 L46 58 L54 70 L60 62 L76 80 Z" fill="#86e0a0"/>
    <circle cx="62" cy="34" r="6" fill="#ffe066"/>
    <path d="M38 34 c-3 -4 -8 -1 -5 3 l5 4 l5 -4 c3 -4 -2 -7 -5 -3 Z" fill="#ff6fae"/>` },

  // Yummy
  'cupcake': { svg: `
    <path d="M24 56 H76 L68 92 H32 Z" fill="#c77dff" ${O}/>
    <path d="M36 58 L40 90 M50 58 V90 M64 58 L60 90" stroke="#a66cff" stroke-width="3"/>
    <path d="M20 58 Q13 46 26 42 Q26 28 40 30 Q44 16 58 22 Q72 22 72 36 Q86 40 80 58 Z" fill="#ffb3de" ${O}/>
    <path d="M54 22 Q56 12 62 8" stroke="#4caf50" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <circle cx="54" cy="18" r="7" fill="#ff4d6d" ${O}/><circle cx="52" cy="16" r="2" fill="#fff"/>
    ${sprinkles([[30, 48, 30, '#74c0fc'], [42, 40, -20, '#ffd166'], [64, 34, 50, '#6ee7b7'], [70, 50, -30, '#fff'], [50, 50, 10, '#c77dff'], [38, 54, 80, '#ff6fae']])}` },
  'donut': { svg: `
    <path d="M12 50 a38 38 0 1 0 76 0 a38 38 0 1 0 -76 0 Z M38 50 a12 12 0 1 1 24 0 a12 12 0 1 1 -24 0 Z" fill="#e8b27a" fill-rule="evenodd" ${O}/>
    <path d="M18 48 q2 -28 32 -30 q30 2 32 30 q-2 8 -6 4 q-4 10 -8 4 q-6 10 -12 4 q-6 8 -12 0 q-6 8 -10 0 q-6 6 -8 -2 q-6 4 -8 -10 Z M37 50 a13 13 0 1 1 26 0 a13 13 0 1 1 -26 0 Z" fill="#ff9ecf" fill-rule="evenodd" ${O} stroke-width="2"/>
    ${sprinkles([[30, 34, 30, '#74c0fc'], [46, 26, -20, '#ffd166'], [64, 30, 50, '#6ee7b7'], [72, 46, -30, '#fff'], [28, 50, 70, '#c77dff'], [56, 66, 10, '#fff']])}` },
  'icecream': { svg: `
    <path d="M32 54 L50 95 L68 54 Z" fill="#f2c48d" ${O}/>
    <path d="M38 60 L58 76 M46 58 L62 68 M42 72 L60 58 M38 62 L48 56 M44 82 L56 70" stroke="#d9a066" stroke-width="2"/>
    <circle cx="50" cy="48" r="19" fill="#ff9ecf" ${O}/>
    <circle cx="50" cy="28" r="17" fill="#d6b4ff" ${O}/>
    <circle cx="50" cy="10" r="5" fill="#ff4d6d" ${O}/>
    ${eye(43, 50, 3)}${eye(57, 50, 3)}${smile(50, 56, 3)}${blush(38, 56, .6)}${blush(62, 56, .6)}
    ${sprinkles([[40, 22, 30, '#ffd166'], [58, 20, -40, '#74c0fc'], [50, 34, 70, '#fff'], [62, 32, 10, '#6ee7b7']])}` },
  'cookie': { size: 120, svg: `
    <circle cx="50" cy="50" r="38" fill="#e9b97a" ${O}/>
    ${[[34, 34], [58, 28], [68, 52], [44, 58], [30, 66], [56, 74], [72, 70]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="4.5" ry="3.5" fill="#7a4a2a"/>`).join('')}` },
  'strawberry': { size: 120, svg: `
    <path d="M50 92 C22 76 14 46 26 34 C36 26 46 30 50 32 C54 30 64 26 74 34 C86 46 78 76 50 92 Z" fill="#ff5d7a" ${O}/>
    ${[[34, 46], [66, 46], [40, 70], [60, 70], [50, 80], [28, 58], [72, 58]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="1.6" ry="2.6" fill="#ffe08a"/>`).join('')}
    <path d="M50 36 L36 24 L45 27 L50 14 L55 27 L64 24 Z" fill="#6fd08c" ${O}/>
    ${eye(43, 54, 3.5)}${eye(57, 54, 3.5)}${smile(50, 61, 3)}` },
  'teacup': { svg: `
    <ellipse cx="50" cy="85" rx="38" ry="8" fill="#fff" ${O}/>
    ${thick('M72 54 Q90 54 86 66 Q82 74 70 70', '#fff', 5)}
    <path d="M22 46 H74 Q74 82 48 84 Q22 82 22 46 Z" fill="#fff" ${O}/>
    <ellipse cx="48" cy="46" rx="26" ry="5" fill="#d99a6c" ${O}/>
    <path d="M48 64 c-4 -5 -10 -1 -6 4 l6 5 l6 -5 c4 -5 -2 -9 -6 -4 Z" fill="#ff6fae"/>
    <path d="M40 34 q-6 -8 0 -14 q6 -6 0 -14 M56 34 q-6 -8 0 -14 q6 -6 0 -14" stroke="#c9a3ff" stroke-width="3" fill="none" stroke-linecap="round"/>` },
  'cake': { size: 170, svg: `
    <ellipse cx="50" cy="90" rx="44" ry="6" fill="#fff" ${O}/>
    <rect x="12" y="56" width="76" height="32" rx="6" fill="#ffd6ea" ${O}/>
    <path d="M12 62 V58 Q12 54 18 54 H82 Q88 54 88 58 V62 Q82 70 76 62 Q70 70 64 62 Q58 70 52 62 Q46 70 40 62 Q34 70 28 62 Q22 70 18 62 Z" fill="#c77dff"/>
    <rect x="26" y="32" width="48" height="26" rx="6" fill="#fff6fb" ${O}/>
    <path d="M26 38 Q26 32 32 32 H68 Q74 32 74 38 Q70 44 66 38 Q62 44 58 38 Q54 44 50 38 Q46 44 42 38 Q38 44 34 38 Q30 44 26 38 Z" fill="#ff9ecf"/>
    <rect x="47" y="16" width="6" height="16" rx="2" fill="#74c0fc" ${O} stroke-width="2"/>
    <path d="M50 4 Q56 10 50 15 Q44 10 50 4 Z" fill="#ffb703" ${O} stroke-width="2"/>
    <circle cx="24" cy="76" r="3" fill="#ff6fae"/><circle cx="42" cy="78" r="3" fill="#74c0fc"/><circle cx="60" cy="76" r="3" fill="#ffd166"/><circle cx="76" cy="78" r="3" fill="#6ee7b7"/>` },
  'lollipop': { size: 130, svg: `
    <rect x="47" y="58" width="6" height="36" rx="3" fill="#fff" ${O}/>
    <circle cx="50" cy="38" r="28" fill="#ff9ecf" ${O}/>
    <path d="M50 38 a4 4 0 0 1 8 0 a8 8 0 0 1 -16 0 a12 12 0 0 1 24 0 a16 16 0 0 1 -32 0 a20 20 0 0 1 40 0" stroke="#c77dff" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M50 72 L38 66 L38 80 Z M50 72 L62 66 L62 80 Z" fill="#c77dff" ${O} stroke-width="2"/>` },

  // Sparkle
  'rainbow': { size: 240, svg: `
    ${[['#ff6b8b', 40], ['#ffa94d', 34], ['#ffd84d', 28], ['#6ee7b7', 22], ['#74c0fc', 16], ['#b57cff', 10]].map(([c, r]) =>
      `<path d="M${50 - r - 3} 70 A${r + 3} ${r + 3} 0 0 1 ${50 + r + 3} 70" stroke="${c}" stroke-width="6.5" fill="none"/>`).join('')}
    <path d="M4 70 A46 46 0 0 1 96 70 M34 70 A16 16 0 0 1 66 70" stroke="${INK}" stroke-width="2.5" fill="none"/>
    <path d="M2 78 a8 8 0 0 1 8 -12 a10 10 0 0 1 16 2 a7 7 0 0 1 2 12 H6 a5 5 0 0 1 -4 -2 Z" fill="#fff" ${O}/>
    <path d="M72 78 a8 8 0 0 1 8 -12 a10 10 0 0 1 16 2 a7 7 0 0 1 2 12 H76 a5 5 0 0 1 -4 -2 Z" fill="#fff" ${O}/>` },
  'star': { size: 120, svg: `
    <path d="${starPath(50, 54, 46, 21)}" fill="#ffd84d" ${O} stroke-width="3"/>
    ${eye(42, 52, 4)}${eye(58, 52, 4)}${smile(50, 60, 4)}${blush(36, 61, .6)}${blush(64, 61, .6)}` },
  'heart': { size: 110, svg: `
    <path d="M50 88 C18 66 8 46 16 30 C24 14 44 16 50 30 C56 16 76 14 84 30 C92 46 82 66 50 88 Z" fill="#ff6fae" ${O}/>
    <path d="M26 34 Q30 24 38 26" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>` },
  'heart-purple': { size: 100, svg: `
    <path d="M50 88 C18 66 8 46 16 30 C24 14 44 16 50 30 C56 16 76 14 84 30 C92 46 82 66 50 88 Z" fill="#b57cff" ${O}/>
    <path d="M26 34 Q30 24 38 26" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".85"/>
    ${eye(40, 46, 3.5)}${eye(60, 46, 3.5)}${smile(50, 53, 3.5)}` },
  'cloud': { size: 160, svg: `
    <path d="M22 72 C6 72 6 48 22 48 C22 30 44 24 52 38 C58 24 82 26 82 46 C96 46 96 72 80 72 Z" fill="#fff" ${O}/>
    ${eye(42, 56, 3.5)}${eye(60, 56, 3.5)}${smile(51, 62, 3.5)}${blush(36, 63, .6)}${blush(66, 63, .6)}` },
  'moon': { size: 130, svg: `
    <path d="M50.5 10 A40 40 0 1 0 88.5 60.7 A32 32 0 1 1 50.5 10 Z" fill="#ffe58a" ${O}/>
    <path d="M22 50 q4 3 8 0" stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    ${smile(32, 66, 3.5)}${blush(22, 60, .6)}
    <path d="${starPath(78, 20, 7, 3)}" fill="#ffd84d" ${O} stroke-width="1.5"/>` },
  'sparkle': { size: 100, svg: `
    <path d="M50 6 Q54 46 94 50 Q54 54 50 94 Q46 54 6 50 Q46 46 50 6 Z" fill="#ffe066" ${O}/>
    <path d="M80 12 Q81 19 88 20 Q81 21 80 28 Q79 21 72 20 Q79 19 80 12 Z" fill="#ff9ecf" ${O} stroke-width="1.8"/>` },
  'balloon': { size: 140, svg: `
    <path d="M50 74 Q44 84 52 90 Q58 96 50 99" stroke="${INK}" stroke-width="2" fill="none"/>
    <path d="M46 76 L54 76 L50 70 Z" fill="#c77dff" ${O} stroke-width="2"/>
    <ellipse cx="50" cy="40" rx="26" ry="32" fill="#c77dff" ${O}/>
    <path d="M34 28 Q36 18 44 16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/>` },
  'flower': { size: 120, svg: `
    ${thick('M50 60 V96', '#6fd08c', 5)}
    <ellipse cx="62" cy="82" rx="10" ry="5" fill="#86e0a0" ${O} transform="rotate(-30 62 82)"/>
    ${[0, 72, 144, 216, 288].map(a => `<circle cx="${(50 + 18 * Math.cos((a - 90) * Math.PI / 180)).toFixed(1)}" cy="${(38 + 18 * Math.sin((a - 90) * Math.PI / 180)).toFixed(1)}" r="14" fill="#ff9ecf" ${O}/>`).join('')}
    <circle cx="50" cy="38" r="12" fill="#ffd84d" ${O}/>
    ${eye(46, 37, 2.2)}${eye(54, 37, 2.2)}${smile(50, 42, 2.2)}` },
  'butterfly': { size: 120, svg: `
    <ellipse cx="30" cy="34" rx="20" ry="17" fill="#c77dff" ${O} transform="rotate(-20 30 34)"/>
    <ellipse cx="70" cy="34" rx="20" ry="17" fill="#c77dff" ${O} transform="rotate(20 70 34)"/>
    <ellipse cx="33" cy="64" rx="15" ry="13" fill="#ff9ecf" ${O} transform="rotate(20 33 64)"/>
    <ellipse cx="67" cy="64" rx="15" ry="13" fill="#ff9ecf" ${O} transform="rotate(-20 67 64)"/>
    <circle cx="28" cy="32" r="6" fill="#ffd6ea"/><circle cx="72" cy="32" r="6" fill="#ffd6ea"/>
    <circle cx="33" cy="65" r="4" fill="#fff"/><circle cx="67" cy="65" r="4" fill="#fff"/>
    <path d="M47 22 Q42 10 36 8 M53 22 Q58 10 64 8" stroke="${INK}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    <rect x="44" y="20" width="12" height="60" rx="6" fill="#7b46d6" ${O}/>
    ${eye(47, 30, 2)}${eye(53, 30, 2)}` },
  'sun': { size: 140, svg: `
    <path d="${starPath(50, 50, 46, 32, 12)}" fill="#ffb703" ${O}/>
    <circle cx="50" cy="50" r="28" fill="#ffd84d" ${O}/>
    ${eye(41, 47, 4)}${eye(59, 47, 4)}${smile(50, 56, 5)}${blush(35, 57, .7)}${blush(65, 57, .7)}` },
};

const CATEGORIES = [
  { id: 'cats', name: 'Cats', icon: 'cat-orange', items: ['cat-orange', 'cat-gray', 'cat-black', 'cat-white', 'caticorn', 'cat-sleep', 'cat-sleep2', 'yarn', 'paw', 'fish-blue'] },
  { id: 'unicorns', name: 'Unicorns', icon: 'uni-pink', items: ['uni-pink', 'uni-rainbow', 'uni-mint', 'castle', 'wand', 'tiara', 'horseshoe-heart'] },
  { id: 'sea', name: 'Mermaids', icon: 'mermaid-1', items: ['mermaid-1', 'mermaid-2', 'shell', 'starfish', 'fish-pink', 'fish-yellow', 'octopus', 'bubbles', 'clam'] },
  { id: 'home', name: 'Home', icon: 'bed', items: ['bed', 'armchair', 'lamp', 'plant', 'window', 'shelf', 'table', 'rug', 'frame'] },
  { id: 'yummy', name: 'Yummy', icon: 'cupcake', items: ['cupcake', 'donut', 'icecream', 'cookie', 'strawberry', 'teacup', 'cake', 'lollipop'] },
  { id: 'sparkle', name: 'Sparkle', icon: 'rainbow', items: ['rainbow', 'star', 'heart', 'heart-purple', 'cloud', 'moon', 'sparkle', 'balloon', 'flower', 'butterfly', 'sun'] },
];

// ---------- Rooms (1000 x 625 scenes) ----------
const range = (a, b, step) => { const r = []; for (let i = a; i < b; i += step) r.push(i); return r; };
const tinyHeart = (x, y, s, c) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 4 c-6 -8 -16 -2 -10 6 l10 8 l10 -8 c6 -8 -4 -14 -10 -6 Z" fill="${c}"/>`;
const scene = (inner) => `<svg viewBox="0 0 1000 625" preserveAspectRatio="xMidYMid slice" width="100%" height="100%">${inner}</svg>`;

const ROOMS = [
  {
    id: 'unicorn', name: 'Unicorn Room', bgCss: '#ffd9ec',
    svg: scene(`
      ${range(0, 1000, 80).map(x => `<rect x="${x}" y="0" width="40" height="470" fill="#ffcfe6"/>`).join('')}
      ${[[120, 120], [330, 220], [560, 100], [760, 250], [900, 120], [220, 360], [660, 380], [450, 300]].map(([x, y], i) =>
        i % 2 ? tinyHeart(x, y, 1.2, '#ffb3d9') : `<path d="${starPath(x, y, 12, 5)}" fill="#fff" opacity=".8"/>`).join('')}
      <rect y="0" width="1000" height="26" fill="#e9a6d8"/>
      <rect y="456" width="1000" height="22" fill="#fff" stroke="#e9a6d8" stroke-width="3"/>
      <rect y="478" width="1000" height="147" fill="#d4b0ee"/>
      ${[520, 565, 610].map(y => `<path d="M0 ${y} H1000" stroke="#c39ce3" stroke-width="3"/>`).join('')}
      ${[[150, 478, 520], [520, 478, 520], [830, 478, 520], [330, 520, 565], [700, 520, 565], [90, 565, 610], [470, 565, 610], [880, 565, 610]].map(([x, a, b]) =>
        `<path d="M${x} ${a} V${b}" stroke="#c39ce3" stroke-width="3"/>`).join('')}`),
  },
  {
    id: 'sea', name: 'Mermaid Sea', bgCss: 'linear-gradient(#a3eef6, #5bb4e6 65%, #3f8fd4)',
    svg: scene(`
      <polygon points="120,0 230,0 420,625 230,625" fill="#fff" opacity=".12"/>
      <polygon points="430,0 500,0 640,625 520,625" fill="#fff" opacity=".10"/>
      <polygon points="720,0 820,0 960,625 800,625" fill="#fff" opacity=".12"/>
      ${[[180, 160, 8], [205, 120, 5], [640, 220, 9], [660, 180, 5], [880, 120, 7], [400, 90, 6]].map(([x, y, r]) =>
        `<circle cx="${x}" cy="${y}" r="${r}" fill="none" stroke="#fff" stroke-width="3" opacity=".6"/>`).join('')}
      ${[[50, 3], [90, 0], [940, 2], [900, 1]].map(([x, p]) =>
        `<path d="M${x} 625 q-${20 + p * 4} -50 0 -100 q${20 + p * 4} -50 0 -100 q-15 -40 0 -70" stroke="#4cc38a" stroke-width="16" fill="none" stroke-linecap="round"/>`).join('')}
      <path d="M0 520 Q150 490 300 515 T600 510 T1000 505 V625 H0 Z" fill="#ffe2a6"/>
      <path d="M0 560 Q250 540 500 560 T1000 555 V625 H0 Z" fill="#ffd68a" opacity=".6"/>
      ${[[120, 580], [260, 545], [420, 590], [580, 550], [740, 595], [860, 545]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#f2c26b"/>`).join('')}
      <ellipse cx="160" cy="540" rx="70" ry="38" fill="#9d8ac4"/><ellipse cx="200" cy="550" rx="40" ry="24" fill="#b3a2d6"/>
      <ellipse cx="860" cy="535" rx="80" ry="40" fill="#9d8ac4"/>`),
  },
  {
    id: 'cafe', name: 'Kitty Café', bgCss: '#fff3d6',
    svg: scene(`
      ${range(40, 1000, 80).map(x => range(110, 460, 70).map(y => `<circle cx="${x + (y % 140 ? 40 : 0)}" cy="${y}" r="6" fill="#ffe0a3"/>`).join('')).join('')}
      ${range(0, 1000, 80).map((x, i) => {
        const c = i % 2 ? '#fff' : '#ff9ecf';
        return `<rect x="${x}" y="0" width="80" height="56" fill="${c}"/><path d="M${x} 56 a40 30 0 0 0 80 0 Z" fill="${c}"/>`;
      }).join('')}
      <path d="M0 0 H1000" stroke="#c77dff" stroke-width="10"/>
      <rect y="468" width="1000" height="14" fill="#c77dff"/>
      ${range(0, 1000, 62.5).map((x, i) => range(482, 625, 48).map((y, j) =>
        `<rect x="${x}" y="${y}" width="62.5" height="48" fill="${(i + j) % 2 ? '#fff' : '#ffd1e6'}"/>`).join('')).join('')}`),
  },
  {
    id: 'park', name: 'Rainbow Park', bgCss: 'linear-gradient(#9fd8ff, #e6f6ff 70%)',
    svg: scene(`
      <g opacity=".5" fill="#fff">
        <path d="M120 140 a30 30 0 0 1 50 -20 a40 40 0 0 1 70 10 a25 25 0 0 1 10 40 H130 a20 20 0 0 1 -10 -30 Z"/>
        <path d="M700 100 a25 25 0 0 1 40 -16 a32 32 0 0 1 56 8 a20 20 0 0 1 8 32 H708 a16 16 0 0 1 -8 -24 Z"/>
      </g>
      <path d="M0 420 Q250 320 520 410 T1000 390 V625 H0 Z" fill="#b5ea9f"/>
      <path d="M0 500 Q300 430 600 495 T1000 470 V625 H0 Z" fill="#86d47a"/>
      ${[[90, 540, '#ff9ecf'], [230, 580, '#fff'], [380, 530, '#ffd84d'], [520, 590, '#c77dff'], [690, 545, '#ff9ecf'], [840, 590, '#fff'], [950, 530, '#ffd84d'], [300, 450, '#fff'], [760, 430, '#ff9ecf']].map(([x, y, c]) =>
        `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map(a => `<circle cx="${(7 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(7 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="5" fill="${c}"/>`).join('')}<circle r="4" fill="#ffb703"/></g>`).join('')}
      ${[[150, 600], [470, 560], [620, 610], [900, 560]].map(([x, y]) => `<path d="M${x} ${y} l6 -18 l4 14 l6 -16 l4 20" stroke="#5fb85a" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}`),
  },
];
