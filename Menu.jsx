import { useState } from 'react';
import { SETTINGS_DEFAULT } from './data.js';

function Field({ edit, value, onChange, multiline, className, lang, dir, type }) {
  if (!edit) return <span className={className} lang={lang} dir={dir}>{value}</span>;
  const common = { className: 'ed ' + (className || ''), value, lang, dir, onChange: (e) => onChange(e.target.value), 'aria-label': 'edit' };
  return multiline ? <textarea rows={3} {...common} /> : <input type={type || 'text'} {...common} />;
}

export default function Menu({ menu, cart, add, dec, fmt, edit, setEdit, update, resetMenu, settings, setSettings, onPhoto }) {
  return (
    <section id="menu" className="menu">
      <div className="menu-head">
        <div>
          <p className="eyebrow">05 — THE MENU · <span lang="ar" dir="rtl">المنيو</span></p>
          <h2 className="menu-title"><span lang="ar" dir="rtl">اختار طبقك</span><b>PICK YOUR PLATE</b></h2>
        </div>
        <div className="menu-tools">
          <button className={`btn btn-line ${edit ? 'is-on' : ''}`} onClick={() => setEdit(!edit)} aria-pressed={edit}>
            {edit ? '✓ Done editing' : '✎ Edit menu & prices'}
          </button>
        </div>
      </div>

      {edit && (
        <div className="edit-panel" role="region" aria-label="Menu settings">
          <p><b>Edit mode.</b> Change any name, description or price below — it saves in this browser instantly. Prices are example values.</p>
          <label>Delivery fee ({settings.currency})
            <input type="number" min="0" value={settings.deliveryFee} onChange={(e) => setSettings({ ...settings, deliveryFee: Math.max(0, Number(e.target.value) || 0) })} />
          </label>
          <label>WhatsApp number for orders (with country code)
            <input type="tel" value={settings.whatsapp} onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value.replace(/[^\d]/g, '') })} />
          </label>
          <button className="btn btn-line" onClick={resetMenu}>Reset everything to defaults</button>
        </div>
      )}

      <div className="mgrid">
        {menu.map((d) => {
          const q = cart[d.id] || 0;
          return (
            <article className="mcard" key={d.id} style={{ '--c': d.bg, '--ink': d.ink }}>
              <button className="mc-img" onClick={() => onPhoto(d)} aria-label={`View original photo of ${d.en}`}>
                <img src={d.thumb} alt={`${d.en} — ${d.arFull}`} loading="lazy" decoding="async" style={{ objectPosition: d.pos }} />
                <span className="mc-no">{d.no}</span>
                <span className="mc-orig">Original photo ↗</span>
              </button>
              <div className="mc-body">
                <h3 className="mc-ar"><Field edit={edit} value={d.ar} onChange={(v) => update(d.id, 'ar', v)} lang="ar" dir="rtl" /></h3>
                <div className="mc-en"><Field edit={edit} value={d.en} onChange={(v) => update(d.id, 'en', v)} /></div>
                <p className="mc-desc"><Field edit={edit} multiline value={d.desc.en} onChange={(v) => update(d.id, 'descEn', v)} /></p>
                {edit && <p className="mc-desc ar"><Field edit multiline value={d.desc.ar} lang="ar" dir="rtl" onChange={(v) => update(d.id, 'descAr', v)} /></p>}
                {!edit && <p className="mc-desc ar" lang="ar" dir="rtl">{d.desc.ar}</p>}
                <div className="mc-foot">
                  <div className="mc-price">
                    {edit ? <><input className="ed price-in" type="number" min="0" value={d.price} onChange={(e) => update(d.id, 'price', Math.max(0, Number(e.target.value) || 0))} aria-label={`${d.en} price`} /><small>{settings.currency}</small></> : <><b>{Math.round(d.price)}</b><small>{settings.currency}</small></>}
                  </div>
                  {q === 0 ? (
                    <button className="btn btn-solid" onClick={() => add(d.id)}>Add to order <i>＋</i></button>
                  ) : (
                    <div className="stepper" role="group" aria-label={`${d.en} quantity`}>
                      <button onClick={() => dec(d.id)} aria-label="Remove one">−</button>
                      <b>{q}</b>
                      <button onClick={() => add(d.id)} aria-label="Add one">＋</button>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <p className="menu-note">All prices in {settings.currency}, example values — editable above. Product photos are originals; floating ingredients elsewhere on the site are illustrations.</p>
    </section>
  );
}
