import { useRef } from 'react';
import { Ingredient } from './Icons.jsx';
import { G, K, useScene, jump, isMobile, vh } from './motion.js';

// big decorative ingredient clusters per dish [type, css, rotation]
const ART = {
  ful: [['fava', { left: '-5vmin', top: '10vh', '--w': 46 }, -18], ['lemon', { right: '-4vmin', bottom: '8vh', '--w': 44 }, 12], ['oil', { right: '10vmin', top: '5vh', '--w': 26 }, 10], ['fava', { left: '12vmin', bottom: '-6vh', '--w': 34 }, 30]],
  taameya: [['falafel', { left: '-6vmin', bottom: '6vh', '--w': 50 }, -10], ['falafel', { left: '30vmin', bottom: '-8vh', '--w': 36 }, 18], ['herb', { right: '16vmin', top: '4vh', '--w': 36 }, 18], ['sesame', { right: '-4vmin', bottom: '10vh', '--w': 32 }, -8]],
  eggs: [['egg', { right: '-8vmin', top: '8vh', '--w': 52 }, 14], ['tomato', { left: '-5vmin', bottom: '6vh', '--w': 36 }, -10], ['pepper', { left: '22vmin', top: '3vh', '--w': 34 }, 20], ['egg', { left: '40vmin', bottom: '-8vh', '--w': 34 }, -18]],
  potatoes: [['potato', { right: '-6vmin', bottom: '4vh', '--w': 56 }, 8], ['potato', { left: '-8vmin', top: '12vh', '--w': 40 }, -24], ['herb', { left: '28vmin', bottom: '-4vh', '--w': 30 }, -12], ['garlic', { right: '20vmin', top: '4vh', '--w': 24 }, 18]],
  mesaka: [['eggplant', { left: '-8vmin', bottom: '4vh', '--w': 56 }, -8], ['sauce', { right: '-6vmin', top: '10vh', '--w': 40 }, 12], ['garlic', { right: '14vmin', bottom: '8vh', '--w': 24 }, -14], ['pepper', { left: '26vmin', top: '4vh', '--w': 30 }, 28]],
};
// panel k>0 reveal shapes (clip-path), each one different
const CLIPS = [
  null,
  ['circle(0% at 50% 50%)', 'circle(76% at 50% 50%)'],
  ['inset(100% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'],
  ['polygon(0% 0%, 0% 0%, -30% 100%, 0% 100%)', 'polygon(0% 0%, 135% 0%, 100% 100%, 0% 100%)'],
  ['circle(0% at 100% 100%)', 'circle(150% at 100% 100%)'],
];
const STEP = 1.3, WIN = 0.7;

export default function Signatures({ menu, add, fmt }) {
  const root = useRef(null);

  useScene(() => {
    const gsap = G();
    const $$ = (s, r = root.current) => Array.from(r.querySelectorAll(s));
    const mob = isMobile();
    const T = STEP * 4 + 0.7;
    const panels = $$('.sig');
    const dots = $$('.rail-dot');
    const railCart = root.current.querySelector('.rail-cart');
    const setActive = (idx) => {
      panels.forEach((p, i) => p.classList.toggle('is-active', i === idx));
      dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    };
    setActive(0);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        id: 'signatures', trigger: root.current, start: 'top top', end: '+=' + Math.round(vh(mob ? 62 : 74) * T), pin: true, scrub: 0.6, anticipatePin: 1,
        onUpdate: (self) => {
          const t = self.progress * T;
          let idx = 0;
          for (let k = 1; k < 5; k++) if (t >= STEP * k - 0.3) idx = k;
          setActive(idx);
          if (railCart) railCart.style.left = (Math.min(t / (STEP * 4), 1) * 100).toFixed(2) + '%';
        },
      },
    });

    panels.forEach((p, k) => {
      const q = (s) => p.querySelector(s);
      const items = $$('.art-item', p);
      const s = STEP * k - WIN, e = STEP * k;
      // slow parallax drift of the art while the panel is on screen
      items.forEach((it, i) => K(tl, it, 'y', [[Math.max(0, s), (i % 2 ? -1 : 1) * vh(5)], [Math.min(T, e + STEP), (i % 2 ? 1 : -1) * vh(7)]]));
      if (k === 0) return;
      gsap.set(p, { clipPath: CLIPS[k][0] });
      tl.fromTo(p, { clipPath: CLIPS[k][0] }, { clipPath: CLIPS[k][1], duration: WIN, ease: 'power2.inOut', immediateRender: false }, s);
      K(tl, q('.sig-ar span'), 'yPercent', [[s + 0.2, 115], [e - 0.02, 0, 'power3.out']]);
      K(tl, q('.sig-en span'), 'yPercent', [[s + 0.3, 115], [e + 0.02, 0, 'power3.out']]);
      K(tl, q('.sig-no'), 'opacity', [[s + 0.25, 0], [e, 1]]);
      K(tl, q('.sig-info'), 'opacity', [[s + 0.35, 0], [e + 0.05, 1]]);
      K(tl, q('.sig-info'), 'yPercent', [[s + 0.35, 30], [e + 0.05, 0, 'power2.out']]);
      items.forEach((it, i) => {
        const a = s + 0.1 + i * 0.07;
        K(tl, it, 'scale', [[a, 0.2], [a + 0.55, 1, 'back.out(1.4)']]);
        K(tl, it, 'rotation', [[a, (i % 2 ? 70 : -70)], [a + 0.55, 0, 'power3.out']]);
        K(tl, it, 'opacity', [[a, 0], [a + 0.2, 1]]);
      });
    });
    tl.set({}, {}, T);
    // rail dots jump
    dots.forEach((d, i) => { d.onclick = () => jump('signatures', (STEP * i + 0.05) / T); });
  }, root);

  return (
    <section id="signatures" ref={root} className="sigs">
      <div className="sig-stack">
        {menu.map((d, k) => (
          <article key={d.id} className={`sig sig-${d.id}`} style={{ background: d.bg, color: d.ink, '--accent': d.accent }}>
            {d.id === 'eggs' && <div className="sig-sun" aria-hidden="true" />}
            <div className="sig-art" aria-hidden="true">
              {ART[d.id].map(([t, css, r], i) => (
                <div className="art-item" key={i} style={css}>
                  <div className="art-spin" style={{ animationDuration: 16 + i * 5 + 's', animationDirection: i % 2 ? 'reverse' : 'normal', '--r': r + 'deg' }}>
                    <Ingredient type={t} />
                  </div>
                </div>
              ))}
            </div>
            <div className="sig-no"><b>{d.no}</b><span>/05</span></div>
            <h3 className="sig-ar" lang="ar" dir="rtl"><span>{d.ar}</span></h3>
            <div className="sig-en"><span>{d.en}</span></div>
            <div className="sig-info">
              <p className="sig-tag"><b>{d.tag.en}</b><span lang="ar" dir="rtl">{d.tag.ar}</span></p>
              <div className="sig-actions">
                <button className="btn btn-solid" onClick={() => jump('ingredients', (k + 0.03) / 5)}>See what's inside <i>→</i></button>
                <button className="btn btn-ghost" onClick={() => add(d.id)}>Add to order · {fmt(d.price)}</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="sig-head"><span>03 — THE FIVE SIGNATURES</span><span lang="ar" dir="rtl">الخمس تواقيع</span></div>
      <div className="rail" aria-label="Signature dishes">
        <div className="rail-line" />
        {menu.map((d, i) => (
          <button key={d.id} className="rail-dot" aria-label={d.en} style={{ left: i * 25 + '%' }}>
            <i lang="ar" dir="rtl">{d.ar}</i>
          </button>
        ))}
        <img className="rail-cart" src="img/cart.webp" alt="" width="60" height="57" loading="lazy" />
      </div>
    </section>
  );
}
