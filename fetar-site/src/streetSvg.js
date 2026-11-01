// Procedural SVG artwork for the Egyptian neighbourhood. Seeded, so the street is identical on every load.
function rng(seed) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (r, a) => a[Math.floor(r() * a.length)];
const W = 1920, H = 1080, BASE = 800;

const WALLS = ['#E8B88A', '#D98F60', '#EDCAA0', '#C97B50', '#E5A978', '#D8A56C', '#F1D5B0', '#B9C08E', '#E0A58A'];
const SHUT = ['#5E6B2E', '#6F7F36', '#7A4A2A', '#4F5E27', '#8A3B22'];

function arch(x, y, w, h, fill, extra = '') {
  return `<path d="M${x} ${y + h}V${y + w / 2}A${w / 2} ${w / 2} 0 0 1 ${x + w} ${y + w / 2}V${y + h}Z" fill="${fill}" ${extra}/>`;
}

function windowAt(x, y, w, h, r, lights, lit) {
  let s = arch(x, y, w, h, '#2C1A10');
  if (lit) lights.push(arch(x + 2, y + 2, w - 4, h - 4, '#FFC65C'));
  const col = pick(r, SHUT);
  if (r() < 0.55) {
    // open shutters flank the window
    s += `<rect x="${x - w * 0.52}" y="${y + w / 2 - 2}" width="${w * 0.5}" height="${h - w / 2 + 2}" fill="${col}"/>`;
    s += `<rect x="${x + w + 1}" y="${y + w / 2 - 2}" width="${w * 0.5}" height="${h - w / 2 + 2}" fill="${col}"/>`;
    s += `<path d="M${x - w * 0.52} ${y + w / 2 + 8}h${w * 0.5}M${x - w * 0.52} ${y + w / 2 + 18}h${w * 0.5}M${x + w + 1} ${y + w / 2 + 8}h${w * 0.5}M${x + w + 1} ${y + w / 2 + 18}h${w * 0.5}" stroke="rgba(0,0,0,.25)" stroke-width="2"/>`;
  } else {
    s += arch(x, y, w, h, col, 'opacity=".96"');
    for (let k = 0; k < 5; k++) s += `<path d="M${x} ${y + w / 2 + k * 11}h${w}" stroke="rgba(0,0,0,.28)" stroke-width="2"/>`;
  }
  s += `<rect x="${x - 4}" y="${y + h}" width="${w + 8}" height="5" fill="rgba(60,30,12,.55)"/>`;
  return s;
}

function mashrabiya(x, y, w, h = 92) {
  return `<g>
    <path d="M${x - 8} ${y}h${w + 16}l-6 -14h${-(w + 4)}z" fill="#4b2a16"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#7B4A29"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#lat)"/>
    <rect x="${x}" y="${y}" width="${w}" height="6" fill="#4b2a16"/>
    <rect x="${x - 4}" y="${y + h}" width="${w + 8}" height="7" fill="#3f2312"/>
    <rect x="${x + 8}" y="${y + 14}" width="${w - 16}" height="${h - 24}" fill="none" stroke="#3a2010" stroke-width="3"/>
  </g>`;
}

function acUnit(x, y) {
  return `<rect x="${x}" y="${y}" width="46" height="30" rx="3" fill="#CFC9BD"/><circle cx="${x + 16}" cy="${y + 15}" r="9" fill="#8F8A80"/><path d="M${x + 30} ${y + 8}h10M${x + 30} ${y + 15}h10M${x + 30} ${y + 22}h10" stroke="#8F8A80" stroke-width="2"/>`;
}
function dish(x, y) {
  return `<g><path d="M${x} ${y}l-8 22" stroke="#555" stroke-width="3"/><ellipse cx="${x}" cy="${y}" rx="17" ry="12" fill="#E9E4D8" transform="rotate(-24 ${x} ${y})"/><circle cx="${x + 4}" cy="${y - 4}" r="2.5" fill="#444"/></g>`;
}
function tank(x, y) {
  return `<g><rect x="${x}" y="${y}" width="46" height="46" rx="12" fill="#3F4F58"/><rect x="${x + 6}" y="${y + 8}" width="8" height="30" rx="4" fill="rgba(255,255,255,.2)"/><path d="M${x + 8} ${y + 46}v14M${x + 38} ${y + 46}v14" stroke="#2c373e" stroke-width="4"/></g>`;
}
function rebar(x, y) {
  let s = '';
  for (let i = 0; i < 4; i++) s += `<path d="M${x + i * 9} ${y}l${(i % 2 ? 2 : -2)} -${34 + i * 5}" stroke="#4a3b32" stroke-width="3"/>`;
  return s;
}
function laundry(x1, y1, x2, y2, r) {
  let s = `<path d="M${x1} ${y1}Q${(x1 + x2) / 2} ${Math.max(y1, y2) + 26} ${x2} ${y2}" fill="none" stroke="#6b5645" stroke-width="2.2"/>`;
  const cols = ['#F4E7CC', '#C8321F', '#E3A92B', '#5E6B2E', '#FFFFFF'];
  const n = Math.floor((x2 - x1) / 38);
  for (let i = 1; i < n; i++) {
    const t = i / n, x = x1 + (x2 - x1) * t, y = y1 + (y2 - y1) * t + Math.sin(t * Math.PI) * 26 * 0.98;
    const w = 20 + r() * 12, h = 28 + r() * 16;
    s += `<g class="sway" style="transform-origin:${x}px ${y}px;animation-delay:${(r() * -4).toFixed(2)}s"><path d="M${x - w / 2} ${y}h${w}l${r() * 4 - 2} ${h}h${-w}z" fill="${pick(r, cols)}" stroke="rgba(0,0,0,.12)"/></g>`;
  }
  return s;
}

function building(x, w, h, base, r, lights, opt = {}) {
  const top = base - h, wall = opt.wall || pick(r, WALLS);
  let s = `<g>`;
  s += `<rect x="${x}" y="${top}" width="${w}" height="${h}" fill="${wall}"/>`;
  s += `<rect x="${x}" y="${top}" width="${w}" height="10" fill="rgba(70,30,10,.28)"/>`;
  s += `<rect x="${x - 4}" y="${top - 8}" width="${w + 8}" height="12" fill="${wall}"/><rect x="${x - 4}" y="${top + 2}" width="${w + 8}" height="4" fill="rgba(60,25,8,.3)"/>`;
  s += `<rect x="${x}" y="${top}" width="${w * 0.14}" height="${h}" fill="rgba(70,30,10,.14)"/>`;
  s += `<rect x="${x + w * 0.86}" y="${top}" width="${w * 0.14}" height="${h}" fill="rgba(255,235,190,.16)"/>`;
  // plaster stains
  for (let i = 0; i < 3; i++) s += `<rect x="${x + r() * w * 0.8}" y="${top + r() * h * 0.7}" width="${20 + r() * 40}" height="${30 + r() * 80}" fill="rgba(80,40,20,.07)"/>`;
  const fh = opt.floor || 118, floors = Math.max(1, Math.floor((h - 70) / fh));
  const cols = Math.max(1, Math.floor(w / 78));
  const gap = w / cols;
  for (let f = 0; f < floors; f++) {
    const fy = top + 34 + f * fh;
    const balc = r() < (opt.balc ?? 0.45);
    for (let c = 0; c < cols; c++) {
      const wx = x + c * gap + gap / 2 - 17;
      if (balc && c === Math.floor(cols / 2)) { s += mashrabiya(x + c * gap + 6, fy + 18, gap - 12, 88); continue; }
      s += windowAt(wx, fy + 10, 34, 64, r, lights, r() < (opt.lit ?? 0.28));
    }
  }
  const t = r();
  if (t < 0.25) s += tank(x + w * 0.2, top - 54);
  else if (t < 0.5) s += rebar(x + w * 0.6, top - 4);
  else if (t < 0.7) s += dish(x + w * 0.7, top - 18);
  if (r() < 0.4) s += acUnit(x + 12 + r() * (w - 70), top + 40 + Math.floor(r() * (floors)) * fh + 86);
  s += `</g>`;
  return s;
}

const defs = `<defs>
  <pattern id="lat" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 0l14 14M14 0L0 14" stroke="#33190c" stroke-width="2.2" opacity=".75"/></pattern>
  <linearGradient id="gGround" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D8B07C"/><stop offset=".45" stop-color="#C79862"/><stop offset="1" stop-color="#A97A47"/></linearGradient>
  <linearGradient id="gFade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6D9B4" stop-opacity="0"/><stop offset="1" stop-color="#F6D9B4" stop-opacity=".8"/></linearGradient>
</defs>`;

function svg(inner, cls = '') {
  return `<svg class="${cls}" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMax slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${defs}${inner}</svg>`;
}

export function farLayer() {
  const r = rng(11);
  let s = '';
  const col = '#E3AB90', col2 = '#D69A82';
  // domes & minarets (Cairo skyline)
  const mina = (x, h, c) => `<g fill="${c}"><rect x="${x}" y="${BASE - h}" width="22" height="${h}"/><rect x="${x - 7}" y="${BASE - h * 0.72}" width="36" height="8"/><rect x="${x - 4}" y="${BASE - h * 0.9}" width="30" height="7"/><path d="M${x + 1} ${BASE - h}l10 -52 10 52z"/><circle cx="${x + 11}" cy="${BASE - h - 58}" r="5"/></g>`;
  const dome = (x, w, h, c) => `<g fill="${c}"><rect x="${x}" y="${BASE - h * 0.5}" width="${w}" height="${h * 0.5}"/><path d="M${x + 4} ${BASE - h * 0.5}Q${x + w / 2} ${BASE - h * 1.9} ${x + w - 4} ${BASE - h * 0.5}z"/><rect x="${x + w / 2 - 1.5}" y="${BASE - h * 1.5 - 22}" width="3" height="22"/></g>`;
  s += `<rect x="0" y="${BASE - 150}" width="${W}" height="160" fill="${col2}" opacity=".6"/>`;
  s += mina(200, 330, col) + dome(250, 150, 200, col2) + mina(470, 250, col2);
  s += dome(780, 190, 230, col2) + mina(1010, 360, col) + dome(1060, 140, 170, col);
  s += mina(1420, 280, col2) + dome(1480, 170, 210, col) + mina(1720, 330, col2);
  for (let x = -20; x < W; x += 90) { const h = 90 + r() * 110; s += `<rect x="${x}" y="${BASE - h}" width="${90 + r() * 20}" height="${h + 4}" fill="${r() < 0.5 ? col : col2}" opacity=".85"/>`; }
  return svg(s, 'svg-far');
}

export function midLayer() {
  const r = rng(29);
  const lights = [];
  let s = '', x = -60;
  while (x < W + 60) {
    const w = 170 + Math.floor(r() * 100), h = 330 + Math.floor(r() * 230);
    s += building(x, w, h, BASE + 4, r, lights, { floor: 112, balc: 0.5, lit: 0.34 });
    x += w - 6;
  }
  s += `<rect x="0" y="${BASE - 50}" width="${W}" height="60" fill="url(#gFade)"/>`;
  s += `<g class="lights">${lights.join('')}</g>`;
  return svg(s, 'svg-mid');
}

function bunting(x1, y1, x2, y2, sag, r, n) {
  const cols = ['#C8321F', '#E3A92B', '#5E6B2E', '#F4E7CC', '#C8321F', '#E3A92B'];
  const cx = (x1 + x2) / 2, cy = Math.max(y1, y2) + sag;
  let s = `<path d="M${x1} ${y1}Q${cx} ${cy} ${x2} ${y2}" fill="none" stroke="#4b3626" stroke-width="3"/>`;
  for (let i = 1; i < n; i++) {
    const t = i / n, px = (1 - t) * (1 - t) * x1 + 2 * (1 - t) * t * cx + t * t * x2, py = (1 - t) * (1 - t) * y1 + 2 * (1 - t) * t * cy + t * t * y2;
    const dx = 2 * (1 - t) * (cx - x1) + 2 * t * (x2 - cx), dy = 2 * (1 - t) * (cy - y1) + 2 * t * (y2 - cy);
    const ang = (Math.atan2(dy, dx) * 180) / Math.PI;
    s += `<g transform="translate(${px.toFixed(1)} ${py.toFixed(1)}) rotate(${ang.toFixed(1)})"><g class="flag" style="animation-delay:${(r() * -3).toFixed(2)}s"><path d="M-17 0h34l-17 40z" fill="${cols[i % cols.length]}" stroke="rgba(0,0,0,.15)"/><path d="M-17 0h34" stroke="rgba(0,0,0,.25)" stroke-width="2"/></g></g>`;
  }
  return s;
}

function lantern(x, y, c = '#E3A92B') {
  return `<g class="swing" style="transform-origin:${x}px ${y}px"><path d="M${x} ${y}v26" stroke="#4b3626" stroke-width="2"/><g transform="translate(${x} ${y + 26})"><path d="M-9 0h18l5 10v22l-5 10h-18l-5-10v-22z" fill="${c}"/><path d="M-9 0h18l5 10h-28z" fill="#8A3B22"/><path d="M-14 32h28l-5 10h-18z" fill="#8A3B22"/><path d="M-3 10h6v22h-6z" fill="#FFF0B0" opacity=".85"/><circle cx="0" cy="21" r="22" fill="#FFD36B" opacity=".18"/></g></g>`;
}

export function nearLayer() {
  const r = rng(77);
  const lights = [];
  let s = '';
  // left & right framing buildings
  s += building(-60, 400, 960, BASE + 50, r, lights, { wall: '#D98F60', floor: 130, balc: 0.6, lit: 0.45 });
  s += building(1570, 430, 900, BASE + 50, r, lights, { wall: '#E5A978', floor: 130, balc: 0.6, lit: 0.4 });
  // shopfronts at ground level
  const shop = (x, w, text, col, sub) => `<g>
    <rect x="${x}" y="${BASE - 120}" width="${w}" height="170" fill="#2a170c"/>
    <path d="M${x + 8} ${BASE + 50}V${BASE - 40}a${(w - 16) / 2} ${(w - 16) / 2} 0 0 1 ${w - 16} 0V${BASE + 50}z" fill="#FFB84D" opacity=".95"/>
    <path d="M${x + 8} ${BASE + 50}V${BASE - 40}a${(w - 16) / 2} ${(w - 16) / 2} 0 0 1 ${w - 16} 0V${BASE + 50}z" fill="url(#lat)" opacity=".18"/>
    <rect x="${x - 6}" y="${BASE - 170}" width="${w + 12}" height="48" rx="4" fill="${col}"/>
    <rect x="${x - 6}" y="${BASE - 124}" width="${w + 12}" height="6" fill="rgba(0,0,0,.3)"/>
    <text x="${x + w / 2}" y="${BASE - 134}" text-anchor="middle" font-size="40" font-family="Lalezar, Cairo, sans-serif" fill="#F4E7CC" direction="rtl">${text}</text>
    ${sub || ''}</g>`;
  s += shop(40, 250, 'فرن بلدي', '#5E6B2E',
    `<g class="oven-glow"><circle cx="165" cy="${BASE + 10}" r="86" fill="#FF9A2E" opacity=".35"/></g><g fill="#EDC57C">${[0, 1, 2].map((i) => `<ellipse cx="${100 + i * 64}" cy="${BASE - 4 + (i % 2) * 8}" rx="26" ry="9"/>`).join('')}</g>`);
  s += shop(1650, 230, 'عصير قصب', '#C8321F',
    `<rect x="1680" y="${BASE - 10}" width="170" height="62" fill="#6b4328"/><g fill="#9BB04A">${[0, 1, 2, 3, 4].map((i) => `<rect x="${1690 + i * 32}" y="${BASE - 60}" width="12" height="60" rx="5" transform="rotate(${-8 + i * 4} ${1696 + i * 32} ${BASE})"/>`).join('')}</g>`);
  s += laundry(380, 300, 1560, 250, r);
  s += `<g class="lights">${lights.join('')}</g>`;
  // bunting across the street
  s += bunting(335, 160, 1585, 140, 190, r, 30);
  s += bunting(335, 360, 1585, 340, 130, r, 24);
  s += lantern(760, 330) + lantern(960, 365, '#C8321F') + lantern(1160, 330);
  return svg(s, 'svg-near');
}

export function groundLayer() {
  const r = rng(5);
  let s = `<rect x="0" y="${BASE + 30}" width="${W}" height="${H - BASE}" fill="url(#gGround)"/>`;
  s += `<rect x="0" y="${BASE + 22}" width="${W}" height="14" fill="#8F6338"/><rect x="0" y="${BASE + 22}" width="${W}" height="4" fill="#F0D2A4" opacity=".7"/>`;
  for (let i = 0; i < 22; i++) { const y = BASE + 60 + i * 14, o = 0.05 + i * 0.004; s += `<path d="M0 ${y}H${W}" stroke="rgba(60,30,10,${o})" stroke-width="${1 + i * 0.12}"/>`; }
  for (let i = 0; i < 90; i++) s += `<ellipse cx="${r() * W}" cy="${BASE + 50 + r() * 230}" rx="${3 + r() * 14}" ry="${1 + r() * 3}" fill="rgba(70,35,12,${0.05 + r() * 0.08})"/>`;
  return svg(s, 'svg-ground');
}

export function fgLayer() {
  // bread bicycle (right) + street cat (left) in the foreground
  const bx = 1570, by = 975;
  let s = '';
  s += `<ellipse cx="${bx + 100}" cy="${by + 6}" rx="150" ry="14" fill="rgba(50,25,8,.28)"/>`;
  s += `<g stroke="#2d1a10" stroke-width="7" fill="none" stroke-linecap="round"><circle cx="${bx}" cy="${by - 58}" r="58"/><circle cx="${bx + 200}" cy="${by - 58}" r="58"/></g>`;
  s += `<g stroke="#C8321F" stroke-width="8" fill="none" stroke-linecap="round" stroke-linejoin="round"><path d="M${bx} ${by - 58}L${bx + 70} ${by - 128}H${bx + 150}L${bx + 200} ${by - 58}M${bx + 70} ${by - 128}L${bx + 100} ${by - 58}H${bx}M${bx + 100} ${by - 58}L${bx + 150} ${by - 128}M${bx + 150} ${by - 128}L${bx + 158} ${by - 168}H${bx + 190}"/></g>`;
  s += `<path d="M${bx + 60} ${by - 132}h40" stroke="#2d1a10" stroke-width="10" stroke-linecap="round"/>`;
  s += `<rect x="${bx - 30}" y="${by - 190}" width="130" height="62" rx="4" fill="#9A6A3A" stroke="#5b3a1d" stroke-width="4"/>`;
  s += `<g fill="#EBC47B" stroke="#C58A38">${[0, 1, 2, 3].map((i) => `<ellipse cx="${bx + 8 + i * 28}" cy="${by - 196 + (i % 2) * 5}" rx="26" ry="8"/>`).join('')}</g>`;
  s += `<g fill="#EBC47B" stroke="#C58A38"><ellipse cx="${bx + 20}" cy="${by - 206}" rx="26" ry="8"/><ellipse cx="${bx + 56}" cy="${by - 208}" rx="26" ry="8"/></g>`;
  // cat
  const cx = 250, cy = 1000;
  s += `<ellipse cx="${cx}" cy="${cy + 6}" rx="70" ry="9" fill="rgba(50,25,8,.28)"/>`;
  s += `<g fill="#2b1b13"><path d="M${cx - 44} ${cy}c-4-40 8-70 36-74l4-30 14 18c10-2 18 0 24 4l14-18 4 30c20 14 18 44 4 70z"/><path d="M${cx + 42} ${cy - 4}c34 2 52-14 40-40" stroke="#2b1b13" stroke-width="12" fill="none" stroke-linecap="round"/></g>`;
  s += `<g fill="#E3A92B"><ellipse cx="${cx + 4}" cy="${cy - 84}" rx="5" ry="4"/><ellipse cx="${cx + 30}" cy="${cy - 84}" rx="5" ry="4"/></g>`;
  return svg(s, 'svg-fg');
}
