import { useRef, useEffect } from 'react';
import { farLayer, midLayer, nearLayer, groundLayer, fgLayer } from './streetSvg.js';
import { Ingredient } from './Icons.jsx';
import { DISHES, MORNING } from './data.js';
import { G, K, useScene, isMobile, vw, vh, reduced } from './motion.js';

const LAYERS = {
  far: farLayer(), mid: midLayer(), near: nearLayer(), ground: groundLayer(), fg: fgLayer(),
};
const CHIP = ['fava', 'falafel', 'egg', 'potato', 'eggplant'];

function Dust({ n = 26 }) {
  const items = Array.from({ length: n }, (_, i) => ({
    left: (i * 37 + 11) % 100, top: (i * 53 + 7) % 90, d: 6 + ((i * 7) % 9), s: 2 + (i % 4), dl: -((i * 1.3) % 9),
  }));
  return (
    <div className="dust" aria-hidden="true">
      {items.map((p, i) => (
        <i key={i} style={{ left: p.left + '%', top: p.top + '%', width: p.s, height: p.s, animationDuration: p.d + 's', animationDelay: p.dl + 's' }} />
      ))}
    </div>
  );
}

export default function Street({ ready, onOrder }) {
  const root = useRef(null);

  // intro (runs once the loader is gone)
  useEffect(() => {
    if (!ready || !G()) return;
    const gsap = G();
    const q = (s) => root.current.querySelector(s);
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    if (reduced()) { gsap.set(root.current.querySelectorAll('.in'), { clearProps: 'all' }); return; }
    tl.to(q('.cart-in'), { x: 0, rotation: 0, opacity: 1, duration: 1.5, ease: 'power3.out' }, 0.1)
      .to(q('.cart-shadow'), { opacity: 1, scaleX: 1, duration: 1.2 }, 0.3)
      .to(q('.ht-ar .in'), { yPercent: 0, opacity: 1, duration: 1.2 }, 0.35)
      .to(q('.ht-l .in'), { xPercent: 0, opacity: 1, duration: 1.1 }, 0.55)
      .to(q('.ht-r .in'), { xPercent: 0, opacity: 1, duration: 1.1 }, 0.55)
      .to(root.current.querySelectorAll('.ht-sub .in, .cue .in'), { opacity: 1, y: 0, duration: 0.9, stagger: 0.15 }, 1.2);
    return () => tl.kill();
  }, [ready]);

  useScene(() => {
    const gsap = G();
    const $ = (s) => root.current.querySelector(s);
    const $$ = (s) => Array.from(root.current.querySelectorAll(s));
    const mob = isMobile();
    const W = window.innerWidth, Hh = window.innerHeight;

    // initial "from" states for the intro
    gsap.set($('.cart-in'), { x: vw(mob ? 60 : 55), rotation: 9, opacity: 0 });
    gsap.set($('.cart-shadow'), { opacity: 0, scaleX: 0.5 });
    gsap.set($('.ht-ar .in'), { yPercent: 40, opacity: 0 });
    gsap.set($('.ht-l .in'), { xPercent: -50, opacity: 0 });
    gsap.set($('.ht-r .in'), { xPercent: 50, opacity: 0 });
    gsap.set($$('.ht-sub .in, .cue .in'), { opacity: 0, y: 14 });

    const dist = Hh * (mob ? 5.2 : 6.2);
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { id: 'street', trigger: root.current, start: 'top top', end: '+=' + Math.round(dist), pin: true, scrub: 0.7, anticipatePin: 1 },
    });
    const T = 12;

    /* ---- camera pan: layers slide at different speeds (parallax depth) ---- */
    const panFactors = { far: 0.25, mid: 0.55, near: 1, fg: 1.5, ground: 1 };
    Object.entries(panFactors).forEach(([k, f]) => {
      const el = $('.lay-' + k);
      if (!el) return;
      const extra = Math.max(0, el.offsetWidth - W);
      const base = -extra / 2;
      const s = (mob ? extra * 0.42 : extra * 0.46) * Math.min(f, 1.2);
      K(tl, el, 'x', [[0, base + s], [9.5, base - s]]);
    });
    // push-in
    K(tl, $('.world'), 'scale', [[0, 1], [T, 1.12]]);

    /* ---- hero typography (behind the cart) ---- */
    K(tl, $('.ht-ar'), 'yPercent', [[0, 0], [1.9, -34, 'power2.in']]);
    K(tl, $('.ht-ar'), 'scale', [[0, 1], [1.9, 1.3, 'power2.in']]);
    K(tl, $('.ht-ar'), 'opacity', [[0, 1], [0.8, 1], [1.9, 0]]);
    K(tl, $('.ht-l'), 'xPercent', [[0, 0], [1.8, -50, 'power2.in']]);
    K(tl, $('.ht-r'), 'xPercent', [[0, 0], [1.8, 50, 'power2.in']]);
    K(tl, $$('.ht-l, .ht-r'), 'opacity', [[0, 1], [0.7, 1], [1.7, 0]]);
    K(tl, $('.ht-sub'), 'opacity', [[0, 1], [0.6, 0]]);
    K(tl, $('.cue'), 'opacity', [[0, 1], [0.4, 0]]);

    /* ---- the cart: tilts upright, slides, then centres for the finale ---- */
    const cart = $('.cart-wrap');
    K(tl, cart, 'rotation', [[0, -6], [2, 0, 'power2.out'], [8.2, 0], [9.2, 0]]);
    K(tl, cart, 'x', [[0, 0], [2.3, mob ? 0 : vw(21), 'power2.inOut'], [8.2, mob ? 0 : vw(21)], [9.2, 0, 'power2.inOut']]);
    K(tl, cart, 'y', [[0, 0], [2.3, mob ? vh(5) : 0], [8.2, mob ? vh(5) : 0], [9.2, mob ? vh(2) : 0, 'power2.inOut'], [12, vh(2)]]);
    K(tl, cart, 'scale', [[0, 1], [2.3, mob ? 0.92 : 1], [8.2, mob ? 0.92 : 1], [9.2, mob ? 1 : 1.1, 'power2.inOut'], [12, mob ? 1.1 : 1.2, 'power1.in']]);
    K(tl, $('.cart-steam'), 'opacity', [[2.5, 0], [4, 1]]);

    /* ---- the morning: four beats ---- */
    $$('.mb').forEach((el, i) => {
      const a = 2.2 + i * 1.5;
      K(tl, el, 'opacity', [[a, 0], [a + 0.35, 1], [a + 1.1, 1], [a + 1.45, i === 3 ? 0 : 0]]);
      K(tl, el, 'yPercent', [[a, 18], [a + 0.4, 0, 'power2.out'], [a + 1.1, 0], [a + 1.45, -14, 'power2.in']]);
    });
    K(tl, $('.mclock'), 'opacity', [[2, 0], [2.4, 1], [8.3, 1], [8.7, 0]]);
    K(tl, $('.mclock .hand'), 'rotation', [[2, -70], [8.3, 70]]);

    /* light: dawn -> full morning */
    K(tl, $('.st-dawn'), 'opacity', [[0, 1], [2.2, 0.8], [6.5, 0]]);
    $$('.lights').forEach((el) => K(tl, el, 'opacity', [[0, 1], [3, 0.9], [7.5, 0.12]]));
    K(tl, $('.st-shafts'), 'opacity', [[0, 0.15], [3, 0.4], [7.5, 0.9]]);
    K(tl, $('.st-sun'), 'yPercent', [[0, 28], [7, -22]]);
    K(tl, $('.st-glowdown'), 'opacity', [[0, 0.5], [7, 0]]);
    K(tl, $('.birds'), 'x', [[3.2, -vw(15)], [7.6, vw(115)]]);
    K(tl, $('.birds'), 'y', [[3.2, vh(6)], [7.6, -vh(4)]]);

    /* ---- five plates, one cart ---- */
    const heading = $('.five-t');
    K(tl, heading, 'opacity', [[8.3, 0], [9, 1], [10.2, 1], [10.7, 0]]);
    K(tl, heading, 'yPercent', [[8.3, 30], [9, 0, 'power2.out']]);
    const cw = Math.min(W * 0.48, Hh * 0.66 * 1.06) * 1.1;
    const pos = mob
      ? [[-0.36, -0.27], [0.36, -0.27], [-0.36, -0.06], [0.36, -0.06], [0, -0.165]].map(([a, b]) => [a * W * 0.85, b * Hh * 0.62])
      : [[-0.62, -0.1], [0.62, -0.12], [-0.74, 0.3], [0.74, 0.28], [0, -0.58]].map(([a, b]) => [a * cw, b * Hh * 0.62]);
    $$('.chip').forEach((el, i) => {
      const s = 8.5 + i * 0.12;
      const [tx, ty] = pos[i];
      K(tl, el, 'x', [[s, 0], [s + 1.1, tx, 'power3.out']]);
      K(tl, el, 'y', [[s, mob ? vh(6) : vh(6)], [s + 1.1, ty, 'power3.out']]);
      K(tl, el, 'scale', [[s, 0.15], [s + 1.1, 1, 'back.out(1.5)']]);
      K(tl, el, 'rotation', [[s, -50], [s + 1.1, (i % 2 ? 8 : -8), 'power3.out']]);
      K(tl, el, 'opacity', [[s, 0], [s + 0.3, 1], [10.3, 1], [10.8, 0]]);
    });

    /* ---- wipe to tomato (the first signature plate) ---- */
    const wipe = $('.wipe');
    gsap.set(wipe, { clipPath: 'circle(0% at 50% 60%)' });
    tl.fromTo(wipe, { clipPath: 'circle(0% at 50% 60%)' }, { clipPath: 'circle(142% at 50% 60%)', duration: 1.7, ease: 'power2.in', immediateRender: false }, 10.3);
    K(tl, $('.wipe-in'), 'opacity', [[10.9, 0], [11.4, 1]]);
    tl.set({}, {}, T);
  }, root);

  return (
    <section id="street" ref={root} className="street">
      <div className="world">
        <div className="st-sky" />
        <div className="st-sun"><i /></div>
        <div className="st-dawn" />
        <div className="lay lay-far" dangerouslySetInnerHTML={{ __html: LAYERS.far }} />
        <div className="lay lay-mid" dangerouslySetInnerHTML={{ __html: LAYERS.mid }} />
        <div className="st-haze" />
        <div className="lay lay-near" dangerouslySetInnerHTML={{ __html: LAYERS.near }} />
        <div className="lay lay-ground" dangerouslySetInnerHTML={{ __html: LAYERS.ground }} />
        <div className="st-glowdown" />
        <svg className="birds" viewBox="0 0 120 40" aria-hidden="true">
          <path d="M4 20q8-14 16 0q8-14 16 0" /><path d="M50 8q6-10 12 0q6-10 12 0" /><path d="M84 26q5-8 10 0q5-8 10 0" />
        </svg>
      </div>

      {/* hero type: sits BEHIND the cart */}
      <div className="ht" aria-label="El Fetar El Masry — صباح الفل">
        <div className="ht-kicker"><span className="in">EL FETAR EL MASRY · فطار مصري</span></div>
        <div className="ht-ar"><span className="in" lang="ar" dir="rtl">صباح الفل</span></div>
        <div className="ht-row">
          <div className="ht-l"><span className="in">EL FETAR</span></div>
          <div className="ht-gap" />
          <div className="ht-r"><span className="in">EL MASRY</span></div>
        </div>
        <div className="ht-sub"><span className="in">THE TASTE OF THE STREETS <b>·</b> <span lang="ar" dir="rtl">طعم الشارع</span></span></div>
      </div>

      {/* the original cart — the hero object */}
      <div className="cart-wrap">
        <div className="cart-shadow" />
        <div className="cart-in">
          <div className="cart-bob">
            <img className="cart-img" src="img/cart.webp" alt="Egyptian street breakfast cart — ful مصري" width="1012" height="954" decoding="async" fetchPriority="high" />
            <div className="cart-steam" aria-hidden="true"><i /><i /><i /></div>
          </div>
        </div>
      </div>

      <div className="lay lay-fg" dangerouslySetInnerHTML={{ __html: LAYERS.fg }} />
      <div className="st-shafts" />
      <Dust />

      {/* section 02 — the morning */}
      <div className="morning" aria-live="off">
        <div className="mclock" aria-hidden="true">
          <svg viewBox="0 0 60 60"><circle cx="30" cy="30" r="26" /><g className="hand" style={{ transformOrigin: '30px 30px' }}><path d="M30 30V10" /></g><circle cx="30" cy="30" r="2.4" className="dot" /></svg>
          <span>S02 · THE MORNING · الصبح</span>
        </div>
        {MORNING.map((m, i) => (
          <div className="mb" key={i}>
            <div className="mb-time">{m.time}</div>
            <div className="mb-ar" lang="ar" dir="rtl">{m.ar}</div>
            <div className="mb-en">{m.en}</div>
          </div>
        ))}
      </div>

      {/* five plates */}
      <div className="five">
        <div className="five-t">
          <span lang="ar" dir="rtl">خمس أطباق. عربية واحدة.</span>
          <b>FIVE PLATES. ONE CART.</b>
        </div>
        {DISHES.map((d, i) => (
          <div className="chip" key={d.id}>
            <Ingredient type={CHIP[i]} />
            <span><i lang="ar" dir="rtl">{d.ar}</i> {d.en.toUpperCase()}</span>
          </div>
        ))}
      </div>

      <div className="cue" aria-hidden="true"><span className="in"><em>SCROLL · انزل</em><i /></span></div>

      <div className="wipe"><div className="wipe-in"><span lang="ar" dir="rtl">اتفضل</span></div></div>
    </section>
  );
}
