import { useState, useEffect, useMemo, useCallback } from 'react';
import { DISHES, SETTINGS_DEFAULT, store } from './data.js';
import { Defs } from './Icons.jsx';
import { jump, money } from './motion.js';
import Street from './Street.jsx';
import Signatures from './Signatures.jsx';
import Ingredients from './Ingredients.jsx';
import Menu from './Menu.jsx';
import Experience from './Experience.jsx';
import Finale from './Finale.jsx';
import Drawer from './Drawer.jsx';

const LINKS = [['street', 'The Street', 'الشارع'], ['signatures', 'Signatures', 'التواقيع'], ['ingredients', 'Ingredients', 'المكونات'], ['menu', 'Menu', 'المنيو'], ['experience', 'Experience', 'التجربة']];

export default function App() {
  const [ready, setReady] = useState(false);
  const [overrides, setOverrides] = useState(() => store.get('fetar-menu-v1', {}));
  const [settings, setSettings] = useState(() => ({ ...SETTINGS_DEFAULT, ...store.get('fetar-settings-v1', {}) }));
  const [cart, setCart] = useState(() => store.get('fetar-cart-v1', {}));
  const [open, setOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [photo, setPhoto] = useState(null);

  useEffect(() => store.set('fetar-menu-v1', overrides), [overrides]);
  useEffect(() => store.set('fetar-settings-v1', settings), [settings]);
  useEffect(() => store.set('fetar-cart-v1', cart), [cart]);

  // loader: wait for the hero cart + fonts (max ~2.6s) then reveal
  useEffect(() => {
    let done = false;
    const go = () => { if (!done) { done = true; setReady(true); } };
    const img = new Image();
    img.src = 'img/cart.webp';
    const p1 = img.decode ? img.decode().catch(() => {}) : new Promise((r) => { img.onload = r; });
    const p2 = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    Promise.all([p1, p2]).then(() => setTimeout(go, 500));
    const t = setTimeout(go, 2600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    if (!ready) return;
    document.documentElement.classList.add('is-ready');
    const refresh = () => window.ScrollTrigger && window.ScrollTrigger.refresh();
    const t = setTimeout(refresh, 300);
    window.addEventListener('load', refresh);
    return () => { clearTimeout(t); window.removeEventListener('load', refresh); };
  }, [ready]);

  const menu = useMemo(() => DISHES.map((d) => {
    const o = overrides[d.id] || {};
    return { ...d, ar: o.ar ?? d.ar, en: o.en ?? d.en, price: o.price ?? d.price, desc: { en: o.descEn ?? d.desc.en, ar: o.descAr ?? d.desc.ar } };
  }), [overrides]);

  const fmt = useCallback((n) => money(n, settings.currency), [settings.currency]);
  const update = (id, field, v) => setOverrides((o) => ({ ...o, [id]: { ...(o[id] || {}), [field]: v } }));
  const resetMenu = () => { setOverrides({}); setSettings(SETTINGS_DEFAULT); };
  const add = (id) => setCart((c) => ({ ...c, [id]: Math.min(20, (c[id] || 0) + 1) }));
  const dec = (id) => setCart((c) => { const n = (c[id] || 0) - 1; const x = { ...c }; if (n <= 0) delete x[id]; else x[id] = n; return x; });
  const remove = (id) => setCart((c) => { const x = { ...c }; delete x[id]; return x; });
  const clear = () => setCart({});
  const count = Object.values(cart).reduce((a, b) => a + b, 0);

  // bump the order button when something is added
  const [bump, setBump] = useState(0);
  const addB = (id) => { add(id); setBump((b) => b + 1); };

  const go = (k) => { setNavOpen(false); jump(k); };

  return (
    <>
      <Defs />
      <div className={`loader ${ready ? 'gone' : ''}`} aria-hidden={ready}>
        <div className="ld-ar" lang="ar" dir="rtl">صباح الفل</div>
        <div className="ld-bar"><i /></div>
        <div className="ld-en">warming up the pot…</div>
      </div>

      <header className="nav">
        <button className="brand" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">
          <b lang="ar" dir="rtl">فطار الحتة</b><span>EL FETAR EL MASRY</span>
        </button>
        <nav className={`links ${navOpen ? 'open' : ''}`} aria-label="Sections">
          {LINKS.map(([k, en, ar]) => <button key={k} onClick={() => go(k)}><span>{en}</span><i lang="ar" dir="rtl">{ar}</i></button>)}
        </nav>
        <button className="burger" onClick={() => setNavOpen(!navOpen)} aria-label="Menu" aria-expanded={navOpen}><i /><i /></button>
        <button key={bump} className={`order-btn ${bump ? 'bump' : ''}`} onClick={() => setOpen(true)} aria-label={`Open order, ${count} items`}>
          <span>Order</span><b>{count}</b>
        </button>
      </header>

      <main>
        <Street ready={ready} />
        <Signatures menu={menu} add={addB} fmt={fmt} />
        <Ingredients menu={menu} add={addB} fmt={fmt} onPhoto={setPhoto} />
        <Menu menu={menu} cart={cart} add={addB} dec={dec} fmt={fmt} edit={edit} setEdit={setEdit} update={update} resetMenu={resetMenu} settings={settings} setSettings={setSettings} onPhoto={setPhoto} />
        <Experience />
        <Finale onOrder={() => setOpen(true)} />
      </main>

      <Drawer open={open} onClose={() => setOpen(false)} menu={menu} cart={cart} add={add} dec={dec} remove={remove} clear={clear} fmt={fmt} settings={settings} />

      {photo && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${photo.en} original photo`} onClick={() => setPhoto(null)}>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={photo.img} alt={`${photo.en} — original photograph, uncropped`} />
            <figcaption><b lang="ar" dir="rtl">{photo.ar}</b> {photo.en} — original photograph, shown uncropped <button onClick={() => setPhoto(null)}>Close ✕</button></figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
