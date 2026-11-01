import { useRef, useState } from 'react';
import { Ingredient } from './Icons.jsx';
import { G, K, useScene, jump, isMobile, vh } from './motion.js';

// where each of the 5 ingredients floats (in vmin from the plate centre), its size and depth
const SLOTS = [
  { x: -31, y: -13, s: 21, r: -14, z: 0.9 },
  { x: 32, y: -19, s: 17, r: 12, z: 0.35 },
  { x: -28, y: 25, s: 16, r: 9, z: 0.25 },
  { x: 33, y: 20, s: 21, r: -8, z: 0.95 },
  { x: 3, y: -37, s: 14, r: 16, z: 0.55 },
];
const SLOTS_M = [
  { x: -30, y: -18, s: 24, r: -14, z: 0.9 },
  { x: 31, y: -24, s: 20, r: 12, z: 0.35 },
  { x: -29, y: 28, s: 21, r: 9, z: 0.25 },
  { x: 31, y: 27, s: 24, r: -8, z: 0.95 },
  { x: 2, y: -46, s: 19, r: 16, z: 0.55 },
];

export default function Ingredients({ menu, add, fmt, onPhoto }) {
  const root = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useScene(() => {
    const gsap = G();
    const $ = (s, r = root.current) => r.querySelector(s);
    const $$ = (s, r = root.current) => Array.from(r.querySelectorAll(s));
    const mob = isMobile();
    const W = window.innerWidth, H = window.innerHeight;
    const unit = Math.min(W, H) / 100;
    const slots = mob ? SLOTS_M : SLOTS;
    const plateD = (mob ? 56 : 44) * unit * (mob ? (W / H > 0.6 ? 1 : 1.15) : 1);
    gsap.set($('.ing-stage'), { '--plate': plateD + 'px' });
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'ingredients', trigger: root.current, start: 'top top', end: '+=' + Math.round(vh(mob ? 78 : 96) * 5), pin: true, scrub: 0.6, anticipatePin: 1,
        onUpdate: (self) => {
          const t = self.progress * 5;
          const i = Math.min(4, Math.floor(t + 0.0001));
          const q = t - i;
          if (i !== activeRef.current) { activeRef.current = i; setActive(i); }
          $$('.legend li').forEach((li, j) => {
            li.classList.toggle('on', q >= 0.1 + 0.055 * j);
            li.classList.toggle('done', q >= 0.7);
          });
        },
      },
    });

    $$('.scene').forEach((scene, i) => {
      const q = (s) => $(s, scene);
      // scene crossfade
      const op = i === 0 ? [[0, 1], [0.93 + 0, 1], [1.02, 0]] : i === 4 ? [[3.9, 0], [4.02, 1]] : [[i - 0.1, 0], [i + 0.02, 1], [i + 0.93, 1], [i + 1.02, 0]];
      K(tl, scene, 'autoAlpha', op);
      // plate rim, glow, photo
      K(tl, q('.plate-rim'), 'scale', [[i + 0.2, 0.6], [i + 0.55, 1, 'power2.out']]);
      K(tl, q('.plate-rim'), 'opacity', [[i + 0.2, 0], [i + 0.5, 1]]);
      K(tl, q('.scene-glow'), 'opacity', [[i + 0.05, 0.2], [i + 0.3, 0.45], [i + 0.68, 0.55], [i + 0.74, 1], [i + 0.92, 0.5]]);
      K(tl, q('.scene-glow'), 'scale', [[i + 0.05, 0.9], [i + 0.74, 1.15], [i + 1, 1.05]]);
      gsap.set(q('.plate-photo'), { clipPath: 'circle(0% at 50% 50%)' });
      tl.fromTo(q('.plate-photo'), { clipPath: 'circle(0% at 50% 50%)' }, { clipPath: 'circle(72% at 50% 50%)', duration: 0.16, ease: 'power2.inOut', immediateRender: false }, i + 0.66);
      K(tl, q('.plate-photo img'), 'scale', [[i + 0.66, 1.3], [i + 0.98, 1, 'power2.out']]);
      K(tl, q('.plate-cap'), 'opacity', [[i + 0.8, 0], [i + 0.88, 1]]);
      // ingredients
      $$('.fl', scene).forEach((fl, j) => {
        const sl = slots[j];
        const x = sl.x * unit, y = sl.y * unit, size = sl.s * unit;
        gsap.set(fl, { width: size, height: size, left: '50%', top: '50%', xPercent: -50, yPercent: -50 });
        const a = i + 0.01 + 0.03 * j; // enter
        const spot = i + 0.12 + 0.055 * j;
        const c0 = i + 0.43 + 0.012 * j, c1 = i + 0.66;
        const out = 1.9;
        K(tl, fl, 'x', [[a, x * out], [a + 0.16, x, 'power3.out'], [c0, x], [c1, 0, 'power3.inOut']]);
        K(tl, fl, 'y', [[a, y * out - 8 * unit], [a + 0.16, y, 'power3.out'], [c0, y], [c1, 0, 'power3.inOut']]);
        K(tl, fl, 'rotation', [[a, sl.r * 4], [a + 0.16, sl.r, 'power3.out'], [c0, sl.r], [c1, sl.r + 140, 'power3.inOut']]);
        K(tl, fl, 'scale', [[a, 0.4], [a + 0.16, 1, 'back.out(1.3)'], [c0, 1], [c1, 0.42, 'power3.inOut']]);
        K(tl, fl, 'opacity', [[a, 0], [a + 0.08, 1], [c1 - 0.04, 1], [c1 + 0.04, 0]]);
        K(tl, $('.fl-s', fl), 'scale', [[spot - 0.03, 1], [spot + 0.03, 1.22, 'power2.out'], [spot + 0.12, 1, 'power2.inOut']]);
        K(tl, $('.fl-label', fl), 'opacity', [[a + 0.1, 0], [spot, 1], [c0 - 0.02, 1], [c0 + 0.04, 0]]);
        const f = $('.fl-f', fl);
        fl.onclick = () => gsap.fromTo(f, { scale: 1 }, { scale: 1.25, duration: 0.22, yoyo: true, repeat: 1, ease: 'power2.out' });
      });
    });
    tl.set({}, {}, 5);

    // pointer parallax (desktop only)
    if (!mob && window.matchMedia('(pointer: fine)').matches) {
      const movers = $$('.fl-m').map((el) => {
        const z = slots[Number(el.dataset.j)].z;
        return { z, x: gsap.quickTo(el, 'x', { duration: 0.8, ease: 'power3.out' }), y: gsap.quickTo(el, 'y', { duration: 0.8, ease: 'power3.out' }) };
      });
      const move = (e) => {
        const nx = e.clientX / W - 0.5, ny = e.clientY / H - 0.5;
        movers.forEach((m) => { m.x(-nx * 46 * m.z); m.y(-ny * 36 * m.z); });
      };
      root.current.addEventListener('pointermove', move);
    }
  }, root);

  const d = menu[active];
  return (
    <section id="ingredients" ref={root} className="ings" style={{ '--glow': d.glow }}>
      <div className="ing-bg" />
      <div className="ing-head"><span>04 — THE INGREDIENT EXPERIENCE</span><span lang="ar" dir="rtl">رحلة المكوّنات</span></div>
      <nav className="ing-tabs" aria-label="Choose a dish">
        {menu.map((m, i) => (
          <button key={m.id} className={i === active ? 'on' : ''} onClick={() => jump('ingredients', (i + 0.03) / 5)}>
            <i lang="ar" dir="rtl">{m.ar}</i><span>{m.en}</span>
          </button>
        ))}
      </nav>

      <div className="ing-stage">
        {menu.map((m, i) => (
          <div className="scene" key={m.id} style={{ '--g': m.glow }}>
            <div className="scene-glow" />
            <div className="plate">
              <div className="plate-rim" />
              <div className="plate-photo"><img src={m.img} alt={`${m.en} — original photo`} style={{ objectPosition: m.pos }} loading="lazy" decoding="async" /></div>
              <div className="plate-cap"><i /> Original photograph · صورة أصلية</div>
            </div>
            {m.ingredients.map((g, j) => (
              <div className="fl" key={j} data-j={j}>
                <div className="fl-m" data-j={j}>
                  <div className="fl-s">
                    <div className="fl-f" style={{ animationDelay: -(j * 1.3) + 's', animationDuration: 5 + j * 0.9 + 's' }}>
                      <Ingredient type={g.t} className={SLOTS[j].z > 0.8 ? 'near' : SLOTS[j].z < 0.3 ? 'far' : ''} />
                    </div>
                    <div className="fl-label"><b lang="ar" dir="rtl">{g.ar}</b><span>{g.en}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="ing-info" key={d.id}>
        <div className="ii-no">{d.no} / 05</div>
        <h3 className="ii-ar" lang="ar" dir="rtl">{d.ar}</h3>
        <div className="ii-en">{d.en}</div>
        <p className="ii-tag">{d.tag.en} · <span lang="ar" dir="rtl">{d.tag.ar}</span></p>
        <div className="ii-cta">
          <button className="btn btn-solid" onClick={() => add(d.id)}>Add · {fmt(d.price)}</button>
          <button className="btn btn-line" onClick={() => onPhoto(d)}>Original photo ↗</button>
        </div>
      </div>
      <ul className="legend" aria-label={`${d.en} ingredients`}>
        {d.ingredients.map((g, j) => (
          <li key={j}><Ingredient type={g.t} /><span><b lang="ar" dir="rtl">{g.ar}</b>{g.en}</span></li>
        ))}
      </ul>
      <div className="ing-hint" aria-hidden="true"><i /> scroll to cook · or pick a dish</div>
    </section>
  );
}
