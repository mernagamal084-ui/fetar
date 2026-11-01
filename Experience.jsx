import { useRef, useState } from 'react';
import { Ingredient } from './Icons.jsx';
import { G, K, useScene, isMobile, vw } from './motion.js';

const SPOTS = [
  { k: 'pot', x: 33, y: 22, ar: 'قدرة الفول', en: 'The ful pot', d: 'Simmering since before sunrise — the reason the whole street smells like breakfast.' },
  { k: 'bread', x: 86, y: 31, ar: 'العيش البلدي', en: 'Baladi bread', d: 'Warm, puffed flatbread. Torn by hand — it is the spoon, the plate and the napkin.' },
  { k: 'tahini', x: 62, y: 36, ar: 'الطحينة', en: 'Tahini', d: 'Spooned over the top for a nutty, cooling richness.' },
  { k: 'pickles', x: 71, y: 32, ar: 'الطرشي', en: 'Torshi pickles', d: 'Sharp and salty — the crunch that cuts through every rich bite.' },
  { k: 'chili', x: 35, y: 35, ar: 'الفلفل والشطة', en: 'Green chilies', d: 'Fresh, fiery and optional. Ask for it. Or don’t.' },
  { k: 'fresh', x: 11, y: 33, ar: 'طماطم وليمون', en: 'Tomatoes & lemons', d: 'Sliced and squeezed to order — brightness for the oil and cumin.' },
  { k: 'sign', x: 15, y: 60, ar: 'اللافتة', en: 'The hand-painted sign', d: '“أكل شعبي على الأصول” — street food done properly.' },
];
const PHRASES = ['اتفضل', 'بالهنا والشفا', 'صباح الفل', 'على قد الإيد', 'يا فتّاح يا عليم', 'نورت الحتة'];

function Plate() {
  return (
    <svg viewBox="0 0 200 200" className="ing" aria-hidden="true">
      <ellipse cx="100" cy="176" rx="62" ry="8" fill="rgba(40,20,5,.22)" />
      <ellipse cx="100" cy="108" rx="84" ry="66" fill="#F4E7CC" stroke="#C8321F" strokeWidth="6" />
      <ellipse cx="100" cy="108" rx="64" ry="48" fill="#FBF3E0" stroke="#C8321F" strokeWidth="2" strokeDasharray="2 7" strokeLinecap="round" />
      <ellipse cx="100" cy="108" rx="38" ry="28" fill="none" stroke="#5E6B2E" strokeWidth="3" />
    </svg>
  );
}

export default function Experience() {
  const root = useRef(null);
  const [spot, setSpot] = useState(0);

  useScene(() => {
    const gsap = G();
    const $ = (s) => root.current.querySelector(s);
    const $$ = (s) => Array.from(root.current.querySelectorAll(s));
    const mob = isMobile();
    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: { trigger: $('.xp-stage'), start: 'top 95%', end: 'top 25%', scrub: 0.6 },
    });
    K(tl, $('.xp-cart'), 'x', [[0, mob ? -vw(80) : -vw(70)], [1, 0, 'power3.out']]);
    K(tl, $('.xp-cart'), 'rotation', [[0, -5], [1, 0, 'power3.out']]);
    $$('.hot').forEach((h, i) => {
      K(tl, h, 'scale', [[0.7 + i * 0.03, 0], [0.9 + i * 0.03, 1, 'back.out(2)']]);
    });
    K(tl, $('.xp-title'), 'yPercent', [[0, 30], [0.7, 0, 'power2.out']]);
    tl.set({}, {}, 1);
    // table details drift
    const t2 = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: $('.xp-table'), start: 'top bottom', end: 'bottom top', scrub: 0.6 } });
    $$('.tb').forEach((el, i) => K(t2, el, 'y', [[0, (i % 2 ? 1 : -1) * 40], [1, (i % 2 ? -1 : 1) * 40]]));
    $$('.tb svg').forEach((el, i) => K(t2, el, 'rotation', [[0, -12 + i * 6], [1, 12 - i * 6]]));
  }, root);

  const s = SPOTS[spot];
  return (
    <section id="experience" ref={root} className="xp">
      <div className="xp-head">
        <p className="eyebrow">06 — THE EXPERIENCE · <span lang="ar" dir="rtl">التجربة</span></p>
        <h2 className="xp-title"><span lang="ar" dir="rtl">على الأصول</span><b>DONE PROPERLY</b></h2>
      </div>
      <div className="xp-stage">
        <div className="xp-cart">
          <div className="xp-cartbox">
            <img src="img/cart.webp" alt="The original Egyptian breakfast cart" width="1012" height="954" loading="lazy" decoding="async" />
            {SPOTS.map((p, i) => (
              <button key={p.k} className={`hot ${i === spot ? 'on' : ''}`} style={{ left: p.x + '%', top: p.y + '%' }} onClick={() => setSpot(i)} aria-label={p.en}>
                <span>{i + 1}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="xp-card" key={s.k} aria-live="polite">
          <div className="xp-n">{String(spot + 1).padStart(2, '0')} / 0{SPOTS.length}</div>
          <h3 lang="ar" dir="rtl">{s.ar}</h3>
          <b>{s.en}</b>
          <p>{s.d}</p>
          <div className="xp-dots">{SPOTS.map((p, i) => <button key={p.k} className={i === spot ? 'on' : ''} onClick={() => setSpot(i)} aria-label={p.en} />)}</div>
        </div>
      </div>

      <div className="xp-table" aria-hidden="true">
        <div className="tb tb1"><Ingredient type="bread" /><span>Baladi bread · <i lang="ar" dir="rtl">عيش بلدي</i></span></div>
        <div className="tb tb2"><Plate /><span>Enamel plates · <i lang="ar" dir="rtl">أطباق</i></span></div>
        <div className="tb tb3"><Ingredient type="herb" /><span>Fresh herbs · <i lang="ar" dir="rtl">خضرة</i></span></div>
        <div className="tb tb4"><Ingredient type="salt" /><span>Salt &amp; cumin on the side · <i lang="ar" dir="rtl">ملح وكمون</i></span></div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="mq-track">
          {[0, 1].map((k) => <div className="mq-set" key={k}>{PHRASES.map((p) => <span key={p + k} lang="ar" dir="rtl">{p}<i>✺</i></span>)}</div>)}
        </div>
      </div>
    </section>
  );
}
