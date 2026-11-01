import { useRef } from 'react';
import { G, K, useScene, jump, isMobile, vh, vw } from './motion.js';

export default function Finale({ onOrder }) {
  const root = useRef(null);
  useScene(() => {
    const gsap = G();
    const $ = (s) => root.current.querySelector(s);
    const mob = isMobile();
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { id: 'finale', trigger: root.current, start: 'top top', end: '+=' + Math.round(vh(150)), pin: true, scrub: 0.6, anticipatePin: 1 },
    });
    K(tl, $('.fn-sun'), 'yPercent', [[0, 60], [1.2, 0, 'power2.out']]);
    K(tl, $('.fn-sun'), 'scale', [[0, 0.8], [2, 1.15]]);
    K(tl, $('.fn-cart'), 'x', [[0, -vw(80)], [1.1, 0, 'power3.out']]);
    K(tl, $('.fn-cart'), 'rotation', [[0, -6], [1.1, 0, 'power3.out']]);
    K(tl, $('.fn-cart'), 'scale', [[1.1, 1], [2.2, 1.06]]);
    K(tl, $('.fn-ar span'), 'yPercent', [[0.7, 120], [1.5, 0, 'power3.out']]);
    K(tl, $('.fn-en span'), 'yPercent', [[0.9, 120], [1.7, 0, 'power3.out']]);
    K(tl, $('.fn-cta'), 'opacity', [[1.5, 0], [2, 1]]);
    K(tl, $('.fn-cta'), 'yPercent', [[1.5, 40], [2, 0, 'power2.out']]);
    K(tl, $('.fn-steam'), 'opacity', [[1, 0], [1.6, 1]]);
    K(tl, $('.fn-vig'), 'opacity', [[1.6, 0], [2.4, 1]]);
    tl.set({}, {}, 2.4);
  }, root);

  return (
    <section id="finale" ref={root} className="finale">
      <div className="fn-sky" />
      <div className="fn-sun"><i /></div>
      <div className="fn-skyline" aria-hidden="true">
        <svg viewBox="0 0 1600 300" preserveAspectRatio="xMidYMax slice">
          <g fill="#7A1D10">
            <rect x="0" y="180" width="1600" height="120" />
            <rect x="60" y="120" width="110" height="180" /><rect x="190" y="150" width="90" height="150" /><rect x="300" y="100" width="130" height="200" />
            <rect x="470" y="40" width="22" height="260" /><path d="M468 40l14-60 14 60z" /><rect x="460" y="90" width="42" height="8" />
            <path d="M560 180q60-110 120 0z" /><rect x="560" y="180" width="120" height="120" /><rect x="720" y="130" width="120" height="170" />
            <rect x="900" y="60" width="22" height="240" /><path d="M898 60l14-60 14 60z" /><rect x="890" y="110" width="42" height="8" />
            <rect x="980" y="140" width="130" height="160" /><path d="M1140 170q50-90 100 0z" /><rect x="1140" y="170" width="100" height="130" />
            <rect x="1270" y="110" width="120" height="190" /><rect x="1410" y="150" width="90" height="150" /><rect x="1520" y="100" width="100" height="200" />
          </g>
        </svg>
      </div>
      <div className="fn-text">
        <p className="eyebrow">07 — THE FINAL SCENE · <span lang="ar" dir="rtl">اللقطة الأخيرة</span></p>
        <h2 className="fn-ar" lang="ar" dir="rtl"><span>يلا نفطر</span></h2>
        <div className="fn-en"><span>THE STREET IS WAITING.</span></div>
      </div>
      <div className="fn-cartwrap">
        <div className="fn-cart"><img src="img/cart.webp" alt="The original breakfast cart at sunrise" width="1012" height="954" loading="lazy" decoding="async" /><div className="fn-steam"><i /><i /><i /></div></div>
      </div>
      <div className="fn-ground" />
      <div className="fn-cta">
        <button className="btn btn-cream big" onClick={onOrder}>Order your breakfast <i>→</i></button>
        <button className="btn btn-ghost-light" onClick={() => jump('menu')}>See the menu</button>
      </div>
      <div className="fn-vig" />
      <footer className="foot">
        <b>فطار الحتة</b><span>EL FETAR EL MASRY · The taste of the streets</span>
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to the street ↑</button>
      </footer>
    </section>
  );
}
