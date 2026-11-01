import { useState, useEffect } from 'react';

export default function Drawer({ open, onClose, menu, cart, add, dec, remove, clear, fmt, settings }) {
  const [step, setStep] = useState('cart');
  const [mode, setMode] = useState('delivery');
  const [f, setF] = useState({ name: '', phone: '', address: '', notes: '' });
  const [err, setErr] = useState({});
  const [done, setDone] = useState(null);
  const [copied, setCopied] = useState(false);

  const lines = menu.filter((d) => cart[d.id]).map((d) => ({ d, q: cart[d.id], sum: cart[d.id] * d.price }));
  const sub = lines.reduce((a, l) => a + l.sum, 0);
  const fee = mode === 'delivery' && sub > 0 ? settings.deliveryFee : 0;
  const total = sub + fee;
  const count = lines.reduce((a, l) => a + l.q, 0);

  useEffect(() => { if (open && step === 'done' && !done) setStep('cart'); }, [open]); // eslint-disable-line
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && open && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [open, onClose]);

  const build = (no) => {
    const L = lines.map((l) => `${l.q}× ${l.d.en} (${l.d.ar}) — ${fmt(l.sum)}`).join('\n');
    return `*Order #${no} — El Fetar El Masry / فطار الحتة*\n${L}\n\nSubtotal: ${fmt(sub)}\n${mode === 'delivery' ? `Delivery: ${fmt(fee)}` : 'Pickup'}\n*Total: ${fmt(total)}*\n\nName: ${f.name}\nPhone: ${f.phone}${mode === 'delivery' ? `\nAddress: ${f.address}` : ''}${f.notes ? `\nNotes: ${f.notes}` : ''}`;
  };
  const place = (e) => {
    e.preventDefault();
    const er = {};
    if (f.name.trim().length < 2) er.name = 'Please enter your name';
    if (!/^[\d+\s-]{8,16}$/.test(f.phone.trim())) er.phone = 'Enter a valid phone number';
    if (mode === 'delivery' && f.address.trim().length < 5) er.address = 'Enter your address';
    setErr(er);
    if (Object.keys(er).length) return;
    const no = String(Math.floor(1000 + Math.random() * 9000));
    setDone({ no, text: build(no), total, count });
    setStep('done');
  };
  const reset = () => { clear(); setDone(null); setStep('cart'); setF({ name: '', phone: '', address: '', notes: '' }); onClose(); };
  const copy = async () => {
    try { await navigator.clipboard.writeText(done.text); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.prompt('Copy your order:', done.text); }
  };

  return (
    <div className={`drawer-wrap ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="drawer-scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Your order" aria-modal="true">
        <header className="dr-head">
          <div><p className="eyebrow">YOUR ORDER · <span lang="ar" dir="rtl">طلبك</span></p><h2>{step === 'done' ? 'Order ready' : step === 'checkout' ? 'Checkout' : `${count} item${count === 1 ? '' : 's'}`}</h2></div>
          <button className="x" onClick={onClose} aria-label="Close order">✕</button>
        </header>

        {step === 'cart' && (
          <>
            <div className="dr-body">
              {lines.length === 0 && <div className="empty"><b lang="ar" dir="rtl">لسه مفيش حاجة</b><p>Your tray is empty. Pick a plate from the menu.</p><button className="btn btn-solid" onClick={() => { onClose(); document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' }); }}>Open the menu</button></div>}
              {lines.map(({ d, q, sum }) => (
                <div className="line" key={d.id}>
                  <img src={d.thumb} alt="" />
                  <div className="ln-t"><b>{d.en}</b><span lang="ar" dir="rtl">{d.ar}</span><small>{fmt(d.price)} each</small></div>
                  <div className="stepper sm"><button onClick={() => dec(d.id)} aria-label="Less">−</button><b>{q}</b><button onClick={() => add(d.id)} aria-label="More">＋</button></div>
                  <div className="ln-s">{fmt(sum)}<button className="rm" onClick={() => remove(d.id)} aria-label={`Remove ${d.en}`}>remove</button></div>
                </div>
              ))}
            </div>
            {lines.length > 0 && (
              <footer className="dr-foot">
                <div className="seg" role="radiogroup" aria-label="Order type">
                  <button role="radio" aria-checked={mode === 'delivery'} className={mode === 'delivery' ? 'on' : ''} onClick={() => setMode('delivery')}>Delivery</button>
                  <button role="radio" aria-checked={mode === 'pickup'} className={mode === 'pickup' ? 'on' : ''} onClick={() => setMode('pickup')}>Pickup</button>
                </div>
                <dl className="sum"><div><dt>Subtotal</dt><dd>{fmt(sub)}</dd></div><div><dt>{mode === 'delivery' ? 'Delivery' : 'Pickup'}</dt><dd>{fmt(fee)}</dd></div><div className="tot"><dt>Total</dt><dd>{fmt(total)}</dd></div></dl>
                <button className="btn btn-solid wide" onClick={() => setStep('checkout')}>Continue to checkout →</button>
              </footer>
            )}
          </>
        )}

        {step === 'checkout' && (
          <form className="dr-body form" onSubmit={place} noValidate>
            <label>Name<input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} autoComplete="name" />{err.name && <em>{err.name}</em>}</label>
            <label>Phone<input value={f.phone} inputMode="tel" onChange={(e) => setF({ ...f, phone: e.target.value })} autoComplete="tel" />{err.phone && <em>{err.phone}</em>}</label>
            {mode === 'delivery' && <label>Address<textarea rows={2} value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} />{err.address && <em>{err.address}</em>}</label>}
            <label>Notes (optional)<textarea rows={2} value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} placeholder="No chili, extra lemon…" /></label>
            <dl className="sum"><div className="tot"><dt>{count} item{count === 1 ? '' : 's'} · {mode}</dt><dd>{fmt(total)}</dd></div></dl>
            <div className="row"><button type="button" className="btn btn-line" onClick={() => setStep('cart')}>← Back</button><button type="submit" className="btn btn-solid">Place order</button></div>
          </form>
        )}

        {step === 'done' && done && (
          <div className="dr-body dr-done">
            <div className="stamp"><b lang="ar" dir="rtl">تمام!</b><span>ORDER #{done.no}</span></div>
            <p>Your order is built. Send it to the cart on WhatsApp to confirm — total <b>{fmt(done.total)}</b>.</p>
            <pre className="receipt">{done.text.replace(/\*/g, '')}</pre>
            <div className="row">
              <a className="btn btn-solid" href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(done.text)}`} target="_blank" rel="noopener noreferrer">Send on WhatsApp</a>
              <button className="btn btn-line" onClick={copy}>{copied ? 'Copied ✓' : 'Copy order'}</button>
            </div>
            <button className="linkish" onClick={reset}>Start a new order</button>
          </div>
        )}
      </aside>
    </div>
  );
}
