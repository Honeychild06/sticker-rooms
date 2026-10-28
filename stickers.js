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

// ---------- Furniture & everyday things ----------
const heartPath = (x, y, k = 1) => `M${x} ${y} c${-4 * k} ${-5 * k} ${-10 * k} ${-1 * k} ${-6 * k} ${4 * k} l${6 * k} ${5 * k} l${6 * k} ${-5 * k} c${4 * k} ${-5 * k} ${-2 * k} ${-9 * k} ${-6 * k} ${-4 * k} Z`;

Object.assign(STICKERS, {
  // Cats
  'cat-bed': { size: 190, svg: `
    <ellipse cx="50" cy="70" rx="44" ry="20" fill="#a66cff" ${O}/>
    <ellipse cx="50" cy="62" rx="44" ry="20" fill="#c77dff" ${O}/>
    <ellipse cx="50" cy="60" rx="31" ry="11" fill="#ffd6ea" ${O}/>
    <path d="${heartPath(50, 74, .9)}" fill="#ffd6ea"/>` },
  'cat-bowl': { size: 120, svg: `
    ${[[34, 50], [42, 46], [50, 49], [58, 45], [66, 50], [46, 52], [56, 53], [40, 53], [62, 54]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#c98b5a" ${O} stroke-width="1.5"/>`).join('')}
    <path d="M12 56 H88 L80 82 Q50 92 20 82 Z" fill="#ff9ecf" ${O}/>
    <ellipse cx="50" cy="56" rx="38" ry="6" fill="#ffb3de" ${O}/>
    <path d="M36 72 Q46 62 58 72 Q46 82 36 72 Z M58 72 L66 66 L66 78 Z" fill="#fff"/>` },
  'cat-tree': { size: 240, svg: `
    <rect x="44" y="26" width="12" height="62" fill="#e9c9a0" ${O}/>
    <path d="M44 36 l12 4 M44 46 l12 4 M44 56 l12 4 M44 66 l12 4 M44 76 l12 4" stroke="#c9a070" stroke-width="2"/>
    <rect x="12" y="84" width="76" height="10" rx="4" fill="#c77dff" ${O}/>
    <rect x="14" y="54" width="42" height="9" rx="4" fill="#ff9ecf" ${O}/>
    <rect x="44" y="20" width="44" height="9" rx="4" fill="#c77dff" ${O}/>
    <path d="M80 29 V44" stroke="${INK}" stroke-width="2"/><circle cx="80" cy="48" r="5" fill="#ffd166" ${O} stroke-width="2"/>
    <path d="M18 84 V70 a10 10 0 0 1 20 0 V84" fill="#ffd6ea" ${O}/><path d="M23 84 V73 a5 5 0 0 1 10 0 V84 Z" fill="#7b46d6"/>` },
  'mouse-toy': { size: 100, svg: `
    ${thick('M20 62 Q8 60 10 48 Q12 38 6 34', '#ff9ecf', 2)}
    <path d="M18 64 Q18 38 50 38 Q78 38 86 62 Q70 70 18 64 Z" fill="#c3c3d6" ${O}/>
    <circle cx="48" cy="36" r="10" fill="#c3c3d6" ${O}/><circle cx="48" cy="36" r="5" fill="#ffb3cf"/>
    ${eye(68, 52, 3)}<circle cx="86" cy="61" r="3.5" fill="#ff7fa8" ${O} stroke-width="1.5"/>` },

  // Unicorns
  'canopy-bed': { size: 290, svg: `
    <rect x="10" y="14" width="5" height="78" fill="#ffd86b" ${O} stroke-width="2"/><rect x="85" y="14" width="5" height="78" fill="#ffd86b" ${O} stroke-width="2"/>
    <path d="M14 70 V46 Q50 22 86 46 V70 Z" fill="#c77dff" ${O}/>
    <path d="${starPath(50, 44, 8, 3.5)}" fill="#ffd86b"/>
    <rect x="8" y="62" width="84" height="16" rx="6" fill="#fff" ${O}/>
    <rect x="13" y="54" width="22" height="12" rx="6" fill="#fff6fb" ${O}/>
    <path d="M36 58 H86 Q92 58 92 64 V80 H36 Z" fill="#ffb3de" ${O}/>
    <path d="M12 16 Q4 46 18 62 L24 62 Q16 40 26 16 Z" fill="#ffd6f0" ${O} stroke-width="2"/>
    <path d="M88 16 Q96 46 82 62 L76 62 Q84 40 74 16 Z" fill="#ffd6f0" ${O} stroke-width="2"/>
    <path d="M6 10 H94 V18 q-5.9 6 -11.7 0 q-5.9 6 -11.7 0 q-5.9 6 -11.7 0 q-5.9 6 -11.7 0 q-5.9 6 -11.7 0 q-5.9 6 -11.7 0 q-5.9 6 -11.7 0 q-5.9 6 -11.8 0 Z" fill="#ff8fc8" ${O}/>
    <path d="M50 10 V2" stroke="${INK}" stroke-width="2"/><path d="${heartPath(50, 3, .7)}" fill="#ff6fae"/>` },
  'vanity': { size: 210, svg: `
    <rect x="16" y="70" width="5" height="22" fill="#c77dff" ${O} stroke-width="2"/><rect x="79" y="70" width="5" height="22" fill="#c77dff" ${O} stroke-width="2"/>
    <ellipse cx="50" cy="38" rx="24" ry="30" fill="#ffd86b" ${O}/>
    <ellipse cx="50" cy="38" rx="18" ry="24" fill="#d6f0ff"/>
    <path d="M40 26 L48 18 M40 34 L54 20" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
    <path d="M50 8 V2" stroke="${INK}" stroke-width="2"/><path d="${starPath(50, 4, 5, 2.2)}" fill="#ff6fae"/>
    <rect x="8" y="64" width="84" height="10" rx="4" fill="#ffb3de" ${O}/>
    <rect x="68" y="54" width="9" height="10" rx="3" fill="#c9a3ff" ${O} stroke-width="2"/><circle cx="72.5" cy="52" r="3" fill="#ff8fc8" ${O} stroke-width="1.5"/>
    <rect x="22" y="58" width="5" height="6" rx="1" fill="#ff4d6d" ${O} stroke-width="1.5"/>` },
  'dresser': { size: 210, svg: `
    <rect x="18" y="84" width="6" height="8" fill="#8a4fd8" ${O} stroke-width="2"/><rect x="76" y="84" width="6" height="8" fill="#8a4fd8" ${O} stroke-width="2"/>
    <rect x="12" y="32" width="76" height="54" rx="6" fill="#d6b4ff" ${O}/>
    ${[38, 54, 70].map(y => `<rect x="18" y="${y}" width="64" height="12" rx="3" fill="#ead9ff" ${O} stroke-width="2"/><path d="${heartPath(50, y + 4.5, .5)}" fill="#ff6fae"/>`).join('')}
    <path d="M62 32 L60 22 H72 L70 32 Z" fill="#7ee8d6" ${O} stroke-width="2"/>
    <path d="M66 22 V12" stroke="#4caf50" stroke-width="2"/><circle cx="66" cy="10" r="5" fill="#ff9ecf" ${O} stroke-width="2"/>
    <rect x="22" y="24" width="20" height="8" rx="2" fill="#74c0fc" ${O} stroke-width="2"/><rect x="24" y="16" width="16" height="8" rx="2" fill="#ffd166" ${O} stroke-width="2"/>` },

  // Mermaids
  'shell-bed': { size: 280, svg: `
    <path d="M8 66 Q8 12 50 10 Q92 12 92 66 Z" fill="#ffb3d1" ${O}/>
    <path d="M50 66 L16 40 M50 66 L26 22 M50 66 L42 13 M50 66 L58 13 M50 66 L74 22 M50 66 L84 40" stroke="#ff7fb5" stroke-width="2.5" stroke-linecap="round"/>
    <path d="M5 64 H95 Q92 92 50 92 Q8 92 5 64 Z" fill="#ff9ecf" ${O}/>
    <rect x="10" y="56" width="80" height="14" rx="7" fill="#fff" ${O}/>
    <ellipse cx="26" cy="54" rx="12" ry="7" fill="#e9f7ff" ${O}/>
    <path d="M38 52 H86 Q90 52 90 58 V70 H38 Z" fill="#4fd1c5" ${O}/>
    <path d="M44 60 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0 q3 3 6 0" stroke="#fff" stroke-width="1.8" fill="none" opacity=".8"/>` },
  'coral': { size: 160, svg: `
    ${thick('M50 88 V50 M50 72 Q34 64 30 40 M50 60 Q66 52 70 30 M31 52 Q20 48 18 36 M67 44 Q80 42 82 32 M50 50 Q48 36 54 24', '#ff7fa8', 8)}
    <ellipse cx="50" cy="90" rx="30" ry="7" fill="#9d8ac4" ${O}/>` },
  'treasure': { size: 160, svg: `
    <rect x="12" y="48" width="76" height="40" rx="4" fill="#c98b5a" ${O}/>
    <path d="M12 50 V36 Q12 18 50 18 Q88 18 88 36 V50 Z" fill="#d99a6c" ${O}/>
    <path d="M24 20 V88 M76 20 V88" stroke="#ffd86b" stroke-width="7"/><path d="M12 48 H88" stroke="${INK}" stroke-width="2.5"/>
    <rect x="42" y="42" width="16" height="16" rx="3" fill="#ffd86b" ${O}/><circle cx="50" cy="49" r="2.5" fill="${INK}"/>
    <circle cx="20" cy="92" r="5" fill="#ffd86b" ${O} stroke-width="2"/><circle cx="84" cy="90" r="5" fill="#fff" ${O} stroke-width="2"/>
    <circle cx="92" cy="84" r="4" fill="#ffd86b" ${O} stroke-width="2"/>` },
  'shell-chair': { size: 190, svg: `
    <path d="M14 70 Q8 20 50 12 Q92 20 86 70 Z" fill="#c9a3ff" ${O}/>
    <path d="M50 70 L22 40 M50 70 L32 22 M50 70 L50 14 M50 70 L68 22 M50 70 L78 40" stroke="#a66cff" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="16" y="62" width="68" height="16" rx="8" fill="#4fd1c5" ${O}/>
    <path d="M24 78 L20 92 H32 L34 78 M76 78 L80 92 H68 L66 78" fill="#ffd86b" ${O}/>
    <circle cx="50" cy="40" r="6" fill="#fff" ${O} stroke-width="2"/>` },

  // Home
  'sofa': { size: 270, svg: `
    <rect x="12" y="80" width="6" height="10" fill="#8a4fd8" ${O} stroke-width="2"/><rect x="82" y="80" width="6" height="10" fill="#8a4fd8" ${O} stroke-width="2"/>
    <rect x="10" y="28" width="80" height="38" rx="14" fill="#ff8fc8" ${O}/>
    <rect x="16" y="56" width="34" height="18" rx="7" fill="#ffb3de" ${O}/><rect x="50" y="56" width="34" height="18" rx="7" fill="#ffb3de" ${O}/>
    <rect x="3" y="44" width="17" height="38" rx="8" fill="#ff9ecf" ${O}/><rect x="80" y="44" width="17" height="38" rx="8" fill="#ff9ecf" ${O}/>
    <rect x="22" y="40" width="18" height="18" rx="6" fill="#c77dff" ${O} transform="rotate(-10 31 49)"/>
    <rect x="60" y="40" width="18" height="18" rx="6" fill="#ffd166" ${O} transform="rotate(10 69 49)"/>` },
  'tv': { size: 200, svg: `
    <path d="M40 16 L30 4 M60 16 L70 4" stroke="${INK}" stroke-width="2.5" stroke-linecap="round"/>
    <rect x="22" y="78" width="56" height="16" rx="4" fill="#c77dff" ${O}/>
    <rect x="12" y="16" width="76" height="60" rx="8" fill="#5a4a6e" ${O}/>
    <rect x="18" y="22" width="64" height="48" rx="4" fill="#bfe9ff"/>
    ${[['#ff6b8b', 22], ['#ffd84d', 17], ['#6ee7b7', 12], ['#b57cff', 7]].map(([c, r]) => `<path d="M${50 - r} 62 A${r} ${r} 0 0 1 ${50 + r} 62" stroke="${c}" stroke-width="4.5" fill="none"/>`).join('')}
    <circle cx="38" cy="85" r="2.5" fill="#fff"/><circle cx="62" cy="85" r="2.5" fill="#fff"/>` },
  'fridge': { size: 240, svg: `
    <rect x="22" y="6" width="56" height="88" rx="8" fill="#bdf0e3" ${O}/>
    <path d="M22 38 H78" stroke="${INK}" stroke-width="2.5"/>
    <rect x="68" y="16" width="4" height="14" rx="2" fill="#fff" ${O} stroke-width="1.5"/><rect x="68" y="46" width="4" height="22" rx="2" fill="#fff" ${O} stroke-width="1.5"/>
    <path d="${heartPath(36, 18, .9)}" fill="#ff6fae"/><path d="${starPath(52, 24, 5, 2.2)}" fill="#ffd84d"/>
    <rect x="30" y="50" width="20" height="16" fill="#fff" ${O} stroke-width="1.5" transform="rotate(-6 40 58)"/>
    <path d="M33 62 L38 54 L42 60 L45 56 L48 62" stroke="#ff6fae" stroke-width="1.8" fill="none"/>
    <circle cx="56" cy="78" r="3.5" fill="#74c0fc"/>` },
  'stove': { size: 200, svg: `
    <rect x="14" y="34" width="72" height="58" rx="6" fill="#fff" ${O}/>
    <rect x="14" y="34" width="72" height="10" rx="4" fill="#e3c6ff" ${O}/>
    <circle cx="26" cy="39" r="2.5" fill="${INK}"/><circle cx="36" cy="39" r="2.5" fill="${INK}"/><circle cx="64" cy="39" r="2.5" fill="${INK}"/><circle cx="74" cy="39" r="2.5" fill="${INK}"/>
    <rect x="24" y="52" width="52" height="30" rx="4" fill="#5a4a6e" ${O}/><rect x="30" y="58" width="40" height="8" rx="3" fill="#ffb703" opacity=".6"/>
    <path d="M30 34 V22 H62 V34 Z" fill="#ff9ecf" ${O}/><path d="M26 22 H66" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M40 16 q-4 -5 0 -10 M52 16 q-4 -5 0 -10" stroke="#c9a3ff" stroke-width="2.5" fill="none" stroke-linecap="round"/>` },
  'bathtub': { size: 250, svg: `
    <path d="M78 40 V22 Q78 14 70 14 H62 V20" stroke="${INK}" stroke-width="7" fill="none" stroke-linecap="round"/>
    <path d="M78 40 V22 Q78 14 70 14 H62 V20" stroke="#cfd6e6" stroke-width="3" fill="none" stroke-linecap="round"/>
    ${[[18, 40, 9], [30, 34, 11], [44, 38, 9], [56, 33, 10], [68, 38, 8]].map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#fff" ${O} stroke-width="2"/>`).join('')}
    <path d="M24 82 L18 92 M76 82 L82 92" stroke="#ffd86b" stroke-width="6" stroke-linecap="round"/>
    <path d="M8 46 H92 Q92 82 70 84 H30 Q8 82 8 46 Z" fill="#fff" ${O}/>
    <rect x="4" y="40" width="92" height="9" rx="4.5" fill="#ff9ecf" ${O}/>
    <path d="${heartPath(50, 64, 1)}" fill="#ffd6ea"/>
    <path d="M40 30 q0 -8 8 -8 q8 0 8 6 h6 l-4 4 q2 8 -10 8 q-8 0 -8 -10 Z" fill="#ffd84d" ${O} stroke-width="2"/>
    <circle cx="50" cy="26" r="1.6" fill="${INK}"/>` },
  'clock': { size: 110, svg: `
    <path d="M22 30 L22 8 L40 18 Z M78 30 L78 8 L60 18 Z" fill="#c77dff" ${O}/>
    <circle cx="50" cy="52" r="38" fill="#c77dff" ${O}/>
    <circle cx="50" cy="52" r="30" fill="#fff"/>
    ${[0, 90, 180, 270].map(a => `<circle cx="${(50 + 24 * Math.sin(a * Math.PI / 180)).toFixed(1)}" cy="${(52 - 24 * Math.cos(a * Math.PI / 180)).toFixed(1)}" r="2.5" fill="#ff6fae"/>`).join('')}
    <path d="M50 52 V34 M50 52 L62 58" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/><circle cx="50" cy="52" r="3" fill="${INK}"/>` },
  'toybox': { size: 170, svg: `
    <circle cx="34" cy="38" r="12" fill="#ff6b8b" ${O}/><path d="M24 34 Q34 40 44 34" stroke="#fff" stroke-width="3" fill="none"/>
    <rect x="52" y="22" width="18" height="18" rx="3" fill="#ffd166" ${O} transform="rotate(12 61 31)"/>
    <circle cx="74" cy="34" r="6" fill="#c98b5a" ${O}/><circle cx="62" cy="40" r="6" fill="#c98b5a" ${O}/>
    <rect x="14" y="42" width="72" height="46" rx="6" fill="#74c0fc" ${O}/>
    <rect x="10" y="38" width="80" height="10" rx="4" fill="#4dabf7" ${O}/>
    <path d="${starPath(50, 67, 13, 6)}" fill="#ffd84d" ${O} stroke-width="2"/>` },
  'desk': { size: 220, svg: `
    <rect x="14" y="54" width="6" height="38" fill="#8a4fd8" ${O} stroke-width="2"/>
    <rect x="60" y="54" width="28" height="38" rx="3" fill="#d6b4ff" ${O}/>
    <rect x="64" y="60" width="20" height="12" rx="2" fill="#ead9ff" ${O} stroke-width="2"/><rect x="64" y="76" width="20" height="12" rx="2" fill="#ead9ff" ${O} stroke-width="2"/>
    <circle cx="74" cy="66" r="2" fill="#ff6fae"/><circle cx="74" cy="82" r="2" fill="#ff6fae"/>
    <rect x="8" y="48" width="84" height="8" rx="3" fill="#c77dff" ${O}/>
    <rect x="22" y="38" width="24" height="10" fill="#fff" ${O} stroke-width="2" transform="rotate(-6 34 43)"/>
    <rect x="62" y="34" width="12" height="14" rx="2" fill="#ff9ecf" ${O} stroke-width="2"/>
    <path d="M64 34 L62 22 M68 34 V20 M72 34 L75 23" stroke-width="3" stroke-linecap="round" stroke="#74c0fc"/>
    <path d="M68 34 V20" stroke="#ffd166" stroke-width="3" stroke-linecap="round"/><path d="M72 34 L75 23" stroke="#6ee7b7" stroke-width="3" stroke-linecap="round"/>` },
  'toothbrush': { size: 100, svg: `
    <path d="M36 40 L30 10 M60 40 L68 12" stroke="${INK}" stroke-width="7" stroke-linecap="round"/>
    <path d="M36 40 L30 10" stroke="#ff9ecf" stroke-width="3.5" stroke-linecap="round"/><path d="M60 40 L68 12" stroke="#74c0fc" stroke-width="3.5" stroke-linecap="round"/>
    <rect x="25" y="6" width="9" height="8" rx="2" fill="#fff" ${O} stroke-width="1.5" transform="rotate(-11 30 10)"/>
    <rect x="64" y="8" width="9" height="8" rx="2" fill="#fff" ${O} stroke-width="1.5" transform="rotate(16 68 12)"/>
    <path d="M28 36 H72 L66 90 H34 Z" fill="#c9a3ff" ${O}/>
    <path d="${heartPath(50, 60, 1)}" fill="#fff"/>` },

  // Yummy
  'pancakes': { size: 150, svg: `
    <ellipse cx="50" cy="82" rx="44" ry="10" fill="#fff" ${O}/>
    ${[72, 62, 52].map(y => `<ellipse cx="50" cy="${y}" rx="34" ry="10" fill="#f2c48d" ${O}/>`).join('')}
    <path d="M18 50 Q20 42 50 42 Q80 42 82 50 Q80 60 76 54 Q72 64 68 54 Q60 60 50 56 Q38 60 32 54 Q26 62 18 50 Z" fill="#c26a3a" opacity=".85"/>
    <rect x="42" y="38" width="16" height="9" rx="2" fill="#ffe58a" ${O} stroke-width="2"/>
    <path d="M70 44 C64 34 74 28 76 36 C78 28 88 34 82 44 L76 50 Z" fill="#ff5d7a" ${O} stroke-width="2"/>` },
  'pizza': { size: 130, svg: `
    <path d="M50 94 L14 22 Q50 6 86 22 Z" fill="#ffd166" ${O}/>
    <path d="M14 22 Q50 6 86 22 L82 30 Q50 16 18 30 Z" fill="#e9a35e" ${O}/>
    <circle cx="40" cy="40" r="7" fill="#ff5d7a"/><circle cx="60" cy="46" r="7" fill="#ff5d7a"/><circle cx="48" cy="66" r="6" fill="#ff5d7a"/>
    <path d="M30 44 l4 4 M64 60 l3 4 M52 34 l3 -3" stroke="#6fd08c" stroke-width="3" stroke-linecap="round"/>` },
  'juice': { size: 120, svg: `
    <path d="M58 30 L70 4" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M58 30 L70 4" stroke="#ff6fae" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M24 26 H76 L70 92 H30 Z" fill="#e9f7ff" ${O}/>
    <path d="M26 40 H74 L70 88 H30 Z" fill="#ffa94d"/>
    <path d="M22 26 a14 14 0 0 1 28 0 Z" fill="#ffd166" ${O} stroke-width="2" transform="rotate(-20 36 26)"/>
    ${eye(43, 60, 3)}${eye(57, 60, 3)}${smile(50, 67, 3)}` },
  'milk': { size: 120, svg: `
    <path d="M26 30 L36 10 H64 L74 30 Z" fill="#fff" ${O}/>
    <rect x="36" y="4" width="28" height="7" rx="1" fill="#fff" ${O} stroke-width="2"/>
    <rect x="26" y="30" width="48" height="62" rx="3" fill="#fff" ${O}/>
    <rect x="26" y="44" width="48" height="30" fill="#ff9ecf"/>
    <path d="M60 52 C54 44 64 40 66 48 C68 40 78 44 72 52 L66 58 Z" fill="#ff5d7a" transform="translate(-16 2)"/>
    <path d="M26 44 H74 M26 74 H74" stroke="${INK}" stroke-width="2"/>` },
  'apple': { size: 100, svg: `
    <path d="M50 30 C34 18 10 26 14 54 C18 82 36 94 50 86 C64 94 82 82 86 54 C90 26 66 18 50 30 Z" fill="#ff5d7a" ${O}/>
    <path d="M50 30 Q48 18 54 10" stroke="#8a5a3a" stroke-width="4" fill="none" stroke-linecap="round"/>
    <path d="M54 18 Q66 8 76 16 Q66 26 54 18 Z" fill="#6fd08c" ${O} stroke-width="2"/>
    <path d="M26 44 Q28 36 36 34" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>
    ${eye(42, 56, 3.5)}${eye(58, 56, 3.5)}${smile(50, 63, 3.5)}` },
  'cereal': { size: 140, svg: `
    <path d="M70 36 L92 14" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M70 36 L92 14" stroke="#d6dbe8" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="50" cy="48" rx="40" ry="10" fill="#fff" ${O}/>
    ${[[30, 46, '#ff6b8b'], [42, 44, '#ffd84d'], [54, 47, '#6ee7b7'], [66, 45, '#b57cff'], [38, 50, '#74c0fc'], [60, 51, '#ffa94d']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="4.5" fill="none" stroke="${c}" stroke-width="3"/>`).join('')}
    <path d="M10 48 Q12 88 50 88 Q88 88 90 48 Q88 58 50 58 Q12 58 10 48 Z" fill="#c9a3ff" ${O}/>
    <path d="${heartPath(50, 70, .9)}" fill="#fff"/>` },

  // Sparkle
  'bunting': { size: 280, svg: (() => {
    const pt = t => [4 + 92 * t, 20 + 40 * t - 40 * t * t];
    const colors = ['#ff6b8b', '#ffa94d', '#ffd84d', '#6ee7b7', '#74c0fc', '#b57cff'];
    return `<path d="M4 20 Q50 40 96 20" stroke="${INK}" stroke-width="2.5" fill="none"/>` + colors.map((c, i) => {
      const t = .1 + i * .16, [x, y] = pt(t);
      return `<path d="M${(x - 6.5).toFixed(1)} ${(y - .5).toFixed(1)} L${(x + 6.5).toFixed(1)} ${(y + .5).toFixed(1)} L${x.toFixed(1)} ${(y + 18).toFixed(1)} Z" fill="${c}" ${O} stroke-width="2"/>`;
    }).join('');
  })() },
  'fairy-lights': { size: 280, svg: (() => {
    const y = x => 30 + 10 * Math.sin((x - 4) / 92 * Math.PI * 3);
    let d = 'M4 ' + y(4).toFixed(1);
    for (let x = 6; x <= 96; x += 2) d += ' L' + x + ' ' + y(x).toFixed(1);
    const colors = ['#ff6fae', '#ffd84d', '#74c0fc', '#b57cff', '#6ee7b7', '#ffa94d', '#ff6fae', '#ffd84d'];
    return `<path d="${d}" stroke="${INK}" stroke-width="2" fill="none"/>` + colors.map((c, i) => {
      const x = 10 + i * 11.4, yy = y(x) + 6;
      return `<circle cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" r="7" fill="${c}" opacity=".35"/><ellipse cx="${x.toFixed(1)}" cy="${yy.toFixed(1)}" rx="3.2" ry="4.5" fill="${c}" ${O} stroke-width="1.5"/>`;
    }).join('');
  })() },
  'mobile': { size: 190, svg: `
    <path d="M50 2 V14 M14 14 H86 M20 14 V44 M50 14 V60 M80 14 V40" stroke="${INK}" stroke-width="2"/>
    <path d="M14 14 H86" stroke="#c77dff" stroke-width="5" stroke-linecap="round"/>
    <path d="${starPath(20, 52, 11, 5)}" fill="#ffd84d" ${O} stroke-width="2"/>
    <path d="M42 66 a6 6 0 0 1 6 -6 a7 7 0 0 1 12 3 a5 5 0 0 1 0 10 H44 a4 4 0 0 1 -2 -7 Z" fill="#fff" ${O} stroke-width="2" transform="translate(-6 0)"/>
    <path d="${heartPath(80, 44, 1.2)}" fill="#ff6fae" ${O} stroke-width="2"/>` },
  'gift': { size: 120, svg: `
    <path d="M50 30 C36 14 22 22 32 30 Z M50 30 C64 14 78 22 68 30 Z" fill="#ff6fae" ${O}/>
    <rect x="16" y="42" width="68" height="48" rx="4" fill="#c77dff" ${O}/>
    <rect x="12" y="30" width="76" height="14" rx="4" fill="#d6b4ff" ${O}/>
    <rect x="44" y="30" width="12" height="60" fill="#ff6fae" ${O}/>
    <circle cx="28" cy="62" r="3" fill="#fff"/><circle cx="72" cy="56" r="3" fill="#fff"/><circle cx="70" cy="76" r="3" fill="#fff"/><circle cx="30" cy="80" r="3" fill="#fff"/>` },
});

const CATEGORIES = [
  { id: 'cats', name: 'Cats', icon: 'cat-orange', items: ['cat-orange', 'cat-gray', 'cat-black', 'cat-white', 'caticorn', 'cat-sleep', 'cat-sleep2', 'cat-bed', 'cat-tree', 'cat-bowl', 'mouse-toy', 'yarn', 'paw', 'fish-blue'] },
  { id: 'unicorns', name: 'Unicorns', icon: 'uni-pink', items: ['uni-pink', 'uni-rainbow', 'uni-mint', 'canopy-bed', 'vanity', 'dresser', 'castle', 'wand', 'tiara', 'horseshoe-heart'] },
  { id: 'sea', name: 'Mermaids', icon: 'mermaid-1', items: ['mermaid-1', 'mermaid-2', 'shell-bed', 'shell-chair', 'treasure', 'coral', 'shell', 'starfish', 'fish-pink', 'fish-yellow', 'octopus', 'bubbles', 'clam'] },
  { id: 'home', name: 'Home', icon: 'bed', items: ['bed', 'sofa', 'armchair', 'tv', 'table', 'desk', 'fridge', 'stove', 'bathtub', 'lamp', 'plant', 'window', 'shelf', 'rug', 'frame', 'clock', 'toybox', 'toothbrush'] },
  { id: 'yummy', name: 'Yummy', icon: 'cupcake', items: ['pancakes', 'pizza', 'cereal', 'apple', 'juice', 'milk', 'cupcake', 'donut', 'icecream', 'cookie', 'strawberry', 'teacup', 'cake', 'lollipop'] },
  { id: 'sparkle', name: 'Sparkle', icon: 'rainbow', items: ['rainbow', 'star', 'heart', 'heart-purple', 'cloud', 'moon', 'sparkle', 'balloon', 'flower', 'butterfly', 'sun', 'bunting', 'fairy-lights', 'mobile', 'gift'] },
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
