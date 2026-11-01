/* TEST-ONLY stand-in for GSAP + ScrollTrigger (the sandbox had no network to fetch the real files).
   Implements only the API subset the site uses. Production loads the real libraries from cdnjs. */
(function () {
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const states = new WeakMap();
  let ctxStack = [];
  const tweens = new Set();
  const tickers = new Set();
  const autos = new Set();

  /* ---------- eases ---------- */
  const E = {
    none: (p) => p, linear: (p) => p,
    in: (n) => (p) => Math.pow(p, n), out: (n) => (p) => 1 - Math.pow(1 - p, n),
    inOut: (n) => (p) => (p < 0.5 ? 0.5 * Math.pow(p * 2, n) : 1 - 0.5 * Math.pow((1 - p) * 2, n)),
  };
  function getEase(name) {
    if (typeof name === 'function') return name;
    if (!name) return E.out(2);
    const m = /^(\w+)\.(in|out|inOut)(?:\((.*)\))?$/.exec(name);
    if (!m) return E.none;
    const [, k, t, arg] = m;
    const pw = { power1: 2, power2: 3, power3: 4, power4: 5, sine: 1.7, expo: 6, quad: 2, cubic: 3 }[k];
    if (k === 'back') {
      const s = parseFloat(arg || 1.7);
      const out = (p) => 1 + (s + 1) * Math.pow(p - 1, 3) + s * Math.pow(p - 1, 2);
      if (t === 'out') return out;
      if (t === 'in') return (p) => 1 - out(1 - p);
      return (p) => (p < 0.5 ? (1 - out(1 - p * 2)) / 2 : 0.5 + out(p * 2 - 1) / 2);
    }
    return E[t](pw || 2);
  }

  /* ---------- element state ---------- */
  const TF = ['x', 'y', 'xPercent', 'yPercent', 'rotation', 'scale', 'scaleX', 'scaleY', 'skewX'];
  const DEF = { x: 0, y: 0, xPercent: 0, yPercent: 0, rotation: 0, scale: 1, scaleX: 1, scaleY: 1, skewX: 0 };
  function st(el) {
    let s = states.get(el);
    if (!s) {
      s = { tf: Object.assign({}, DEF), css: {}, orig: el.nodeType ? el.getAttribute('style') : null };
      states.set(el, s);
      const c = ctxStack[ctxStack.length - 1];
      if (c && el.nodeType) c.els.add(el);
    }
    return s;
  }
  function apply(el, prop, v) {
    if (!el || !el.nodeType) { el[prop] = v; return; }
    const s = st(el);
    if (TF.includes(prop)) {
      s.tf[prop] = v;
      const t = s.tf;
      const sx = t.scale * t.scaleX, sy = t.scale * t.scaleY;
      el.style.transform = `translate(${t.xPercent}%, ${t.yPercent}%) translate(${t.x}px, ${t.y}px) rotate(${t.rotation}deg)${t.skewX ? ` skewX(${t.skewX}deg)` : ''} scale(${sx}, ${sy})`;
      return;
    }
    if (prop === 'autoAlpha') { el.style.opacity = v; el.style.visibility = v <= 0 ? 'hidden' : 'inherit'; s.css.autoAlpha = v; return; }
    s.css[prop] = v;
    if (prop.startsWith('--')) { el.style.setProperty(prop, typeof v === 'number' ? v + 'px' : v); return; }
    const unitless = ['opacity', 'zIndex', 'strokeDashoffset', 'strokeDasharray', 'flexGrow'];
    el.style[prop] = typeof v === 'number' && !unitless.includes(prop) ? v + 'px' : v;
  }
  function read(el, prop) {
    if (!el || !el.nodeType) return el[prop] ?? 0;
    const s = st(el);
    if (TF.includes(prop)) return s.tf[prop];
    if (prop === 'autoAlpha') return s.css.autoAlpha ?? (parseFloat(getComputedStyle(el).opacity) || 0);
    if (s.css[prop] !== undefined) return s.css[prop];
    const cs = getComputedStyle(el)[prop];
    const f = parseFloat(cs);
    return /^-?[\d.]+(px)?$/.test(cs) && !isNaN(f) ? f : cs;
  }
  const numRe = /-?\d*\.?\d+(?:e-?\d+)?/g;
  function lerpVal(a, b, p) {
    if (typeof a === 'number' && typeof b === 'number') return a + (b - a) * p;
    const A = String(a), B = String(b);
    const na = A.match(numRe) || [], nb = B.match(numRe) || [];
    if (na.length && na.length === nb.length) {
      let i = 0;
      return B.replace(numRe, () => { const k = i++; return (+na[k] + (+nb[k] - +na[k]) * p).toFixed(3); });
    }
    return p < 1 ? a : b;
  }
  function targetsOf(t) {
    if (t == null) return [];
    if (typeof t === 'string') return Array.from(document.querySelectorAll(t));
    if (t.nodeType) return [t];
    if (Array.isArray(t) || t instanceof NodeList || t instanceof HTMLCollection) return Array.from(t).flatMap(targetsOf);
    return [t];
  }

  /* ---------- tween ---------- */
  const RESERVED = ['duration', 'delay', 'ease', 'onComplete', 'onUpdate', 'onStart', 'stagger', 'immediateRender', 'overwrite', 'repeat', 'yoyo', 'paused', 'scrollTrigger', 'defaults', 'force3D', 'lazy', 'keyframes', 'id', 'transformOrigin', 'invalidateOnRefresh', 'repeatDelay'];
  class Tween {
    constructor(targets, from, to, vars, start) {
      this.items = targetsOf(targets);
      this.from = from; this.to = to; this.vars = vars;
      this.dur = vars.duration != null ? vars.duration : 0.5;
      this.start = start; this.ease = getEase(vars.ease); this._p = -1;
      this.stagger = typeof vars.stagger === 'number' ? vars.stagger : 0;
      this.rec = new Map();
      const c = ctxStack[ctxStack.length - 1];
      if (c) c.items.push(this);
    }
    get end() { return this.start + this.dur + this.stagger * Math.max(0, this.items.length - 1); }
    keys() { return Object.keys(this.to).filter((k) => !RESERVED.includes(k)); }
    render(t) {
      const total = this.dur;
      this.items.forEach((el, i) => {
        const off = i * this.stagger;
        let p = total > 0 ? clamp((t - this.start - off) / total, 0, 1) : t >= this.start + off ? 1 : 0;
        const key = Math.round(p * 1e5);
        if (this._lastKey && this._lastKey[i] === key) return;
        if (!this.rec.get(el) && p <= 0 && total > 0) return;
        (this._lastKey = this._lastKey || [])[i] = key;
        let r = this.rec.get(el);
        if (!r) { if (p <= 0 && total > 0) return; r = {}; this.rec.set(el, r); }
        const eased = this.ease(p);
        for (const k of this.keys()) {
          if (r[k] === undefined) r[k] = this.from && this.from[k] !== undefined ? this.from[k] : read(el, k);
          apply(el, k, p >= 1 ? this.to[k] : p <= 0 ? r[k] : lerpVal(r[k], this.to[k], eased));
        }
      });
    }
    kill() { tweens.delete(this); this.dead = true; }
  }

  /* ---------- standalone tweens ---------- */
  function standalone(targets, from, to, vars) {
    const tw = new Tween(targets, from, to, vars, 0);
    tw.delay = vars.delay || 0; tw.t0 = null; tw.iter = 0;
    if (from && vars.immediateRender !== false) tw.items.forEach((el) => tw.keys().forEach((k) => apply(el, k, from[k])));
    if (vars.overwrite) { tweens.forEach((o) => { if (o !== tw && o.items.some((e) => tw.items.includes(e))) o.dead = true; }); }
    tweens.add(tw);
    return tw;
  }
  function tickTweens(now) {
    tweens.forEach((tw) => {
      if (tw.dead) { tweens.delete(tw); return; }
      if (tw.t0 == null) tw.t0 = now;
      let t = (now - tw.t0) / 1000 - tw.delay;
      if (t < 0) return;
      if (!tw.started) { tw.started = true; tw.vars.onStart && tw.vars.onStart(); }
      const total = tw.end;
      let local = t;
      if (tw.vars.repeat && t >= total) {
        const cyc = Math.floor(t / total);
        if (tw.vars.repeat === -1 || cyc <= tw.vars.repeat) {
          local = t % total;
          if (tw.vars.yoyo && cyc % 2 === 1) local = total - local;
        } else local = total;
      }
      tw.render(local);
      tw.vars.onUpdate && tw.vars.onUpdate();
      if (t >= total && !(tw.vars.repeat)) { tweens.delete(tw); tw.vars.onComplete && tw.vars.onComplete(); }
    });
  }

  /* ---------- timeline ---------- */
  class Timeline {
    constructor(vars = {}) {
      this.vars = vars; this.kids = []; this.t = 0; this.defaults = vars.defaults || {};
      const c = ctxStack[ctxStack.length - 1]; if (c) c.items.push(this);
      if (vars.scrollTrigger) this.scrollTrigger = ScrollTrigger.create(Object.assign({ animation: this }, vars.scrollTrigger));
      else { this.t0 = null; autos.add(this); }
    }
    duration() { return this.kids.reduce((m, k) => Math.max(m, k.end), 0); }
    _pos(pos, dur) {
      const last = this.duration();
      if (typeof pos === 'number') return pos;
      if (pos == null) return last;
      if (pos === '>') return last;
      if (pos === '<') { const k = this.kids[this.kids.length - 1]; return k ? k.start : 0; }
      const m = /^([+-])=(.+)$/.exec(pos); if (m) return last + (m[1] === '-' ? -1 : 1) * parseFloat(m[2]);
      return last;
    }
    _add(targets, from, to, pos) {
      const vars = Object.assign({}, this.defaults, to);
      const tw = new Tween(targets, from, vars, vars, this._pos(pos));
      // unregister from ctx list duplication (Tween ctor pushes) – fine
      this.kids.push(tw);
      if (from && vars.immediateRender !== false) {
        tw.items.forEach((el) => tw.keys().forEach((k) => apply(el, k, from[k])));
      }
      if (!from && vars.duration === 0 && false) tw.render(0);
      return this;
    }
    to(t, v, pos) { return this._add(t, null, v, pos); }
    fromTo(t, f, v, pos) {
      return this._add(t, f, v, pos);
    }
    set(t, v, pos) { return this._add(t, null, Object.assign({}, v, { duration: 0 }), pos); }
    progress(p) {
      if (p === undefined) return this.t / (this.duration() || 1);
      const d = this.duration();
      this.render(p * d); return this;
    }
    render(time) {
      const rev = time < this.t; this.t = time;
      const ks = rev ? this.kids.slice().reverse() : this.kids;
      for (const k of ks) k.render(time);
    }
    kill() { this.dead = true; autos.delete(this); if (this.scrollTrigger) this.scrollTrigger.kill(); }
  }

  /* ---------- gsap ---------- */
  const gsap = {
    registerPlugin() {}, config() {}, defaults() {},
    set(t, v) { targetsOf(t).forEach((el) => { for (const k of Object.keys(v)) if (!RESERVED.includes(k)) apply(el, k, v[k]); }); },
    to(t, v) { return standalone(t, null, v, v); },
    from(t, v) { const to = {}; targetsOf(t).forEach((el) => Object.keys(v).forEach((k) => { if (!RESERVED.includes(k)) to[k] = read(el, k); })); const vv = Object.assign({}, v); Object.assign(to, { duration: v.duration, ease: v.ease, delay: v.delay, stagger: v.stagger, onComplete: v.onComplete }); return standalone(t, vv, to, to); },
    fromTo(t, f, v) { return standalone(t, f, v, v); },
    timeline(v) { return new Timeline(v); },
    delayedCall(s, fn) { return standalone({}, null, { duration: s, onComplete: fn }, { duration: s, onComplete: fn }); },
    killTweensOf(t) { const els = targetsOf(t); tweens.forEach((tw) => { if (tw.items.some((e) => els.includes(e))) tw.dead = true; }); },
    quickTo(el, prop, vars = {}) { return (v) => standalone(el, null, { [prop]: v, duration: vars.duration || 0.4, ease: vars.ease || 'power3.out' }, { overwrite: true, duration: vars.duration || 0.4, ease: vars.ease || 'power3.out', [prop]: v }); },
    utils: { toArray: (s, scope) => (typeof s === 'string' ? Array.from((scope || document).querySelectorAll(s)) : targetsOf(s)), clamp: (a, b, v) => clamp(v, a, b) },
    ticker: { add: (f) => tickers.add(f), remove: (f) => tickers.delete(f) },
    context(fn, scope) {
      const c = { items: [], els: new Set(), fns: [] };
      const run = (f) => { ctxStack.push(c); try { return f(c); } finally { ctxStack.pop(); } };
      run(fn);
      return {
        add: (f) => (typeof f === 'function' ? run(f) : undefined),
        revert() {
          c.items.forEach((i) => i.kill && i.kill());
          c.items.length = 0;
          ScrollTrigger.refresh(true);
          c.els.forEach((el) => { const s = states.get(el); if (s) { if (s.orig == null) el.removeAttribute('style'); else el.setAttribute('style', s.orig); states.delete(el); } });
          c.els.clear();
        },
        kill() { this.revert(); },
      };
    },
  };

  /* ---------- ScrollTrigger ---------- */
  const all = [];
  let refreshing = false;
  const docTop = (el) => el.getBoundingClientRect().top + window.scrollY;
  function parsePos(str, size) {
    str = String(str).trim();
    if (str === 'top') return 0; if (str === 'center') return size / 2; if (str === 'bottom') return size;
    if (str.endsWith('%')) return (parseFloat(str) / 100) * size;
    return parseFloat(str) || 0;
  }
  class ST {
    constructor(cfg) {
      this.cfg = cfg; this.trigger = typeof cfg.trigger === 'string' ? document.querySelector(cfg.trigger) : cfg.trigger;
      this.animation = cfg.animation; this.progress = 0; this.direction = 1; this.isActive = false; this.prev = 0;
      this.smooth = typeof cfg.scrub === 'number' ? cfg.scrub : 0; this.shown = 0;
      all.push(this); const c = ctxStack[ctxStack.length - 1]; if (c) c.items.push(this);
      this.order = all.length;
      if (!refreshing) ScrollTrigger.refresh();
    }
    measure() {
      const cfg = this.cfg, vh = window.innerHeight, el = this.trigger;
      const rect = el.getBoundingClientRect(); const top = rect.top + window.scrollY, h = rect.height;
      const [tp = 'top', sp = 'top'] = String(cfg.start || 'top bottom').split(/\s+/);
      this.start = top + parsePos(tp, h) - parsePos(sp, vh);
      if (typeof cfg.end === 'string' && cfg.end.startsWith('+=')) this.end = this.start + parseFloat(cfg.end.slice(2));
      else { const [te = 'bottom', se = 'top'] = String(cfg.end || 'bottom top').split(/\s+/); this.end = top + parsePos(te, h) - parsePos(se, vh); }
      if (this.end <= this.start) this.end = this.start + 1;
    }
    pin() {
      const el = this.trigger, r = el.getBoundingClientRect();
      const sp = document.createElement('div'); sp.className = 'pin-spacer';
      sp.style.cssText = `position:relative;display:block;width:${r.width}px;height:${r.height + (this.end - this.start)}px;`;
      el.parentNode.insertBefore(sp, el); sp.appendChild(el);
      this.spacer = sp; this.pw = r.width; this.ph = r.height; this.pleft = r.left;
      this.pstate = ''; this.origStyle = el.getAttribute('style');
      el.style.height = r.height + 'px'; el.style.width = r.width + 'px'; el.style.boxSizing = 'border-box';
    }
    unpin() {
      if (!this.spacer) return;
      const el = this.trigger; this.spacer.parentNode.insertBefore(el, this.spacer); this.spacer.remove(); this.spacer = null;
      if (this.origStyle == null) el.removeAttribute('style'); else el.setAttribute('style', this.origStyle);
    }
    place(y) {
      if (!this.spacer) return;
      const el = this.trigger; const state = y < this.start ? 'before' : y <= this.end ? 'during' : 'after';
      if (state === this.pstate) return; this.pstate = state;
      if (state === 'before') { el.style.position = 'relative'; el.style.top = '0'; el.style.left = '0'; }
      else if (state === 'during') { el.style.position = 'fixed'; el.style.top = '0'; el.style.left = this.spacer.getBoundingClientRect().left + 'px'; }
      else { el.style.position = 'absolute'; el.style.top = this.end - this.start + 'px'; el.style.left = '0'; }
    }
    update(y, dt = 16) {
      if (this.start == null) return;
      this.place(y);
      const p = clamp((y - this.start) / (this.end - this.start), 0, 1);
      const active = y >= this.start && y <= this.end;
      this.direction = p >= this.prev ? 1 : -1;
      const cfg = this.cfg;
      if (active && !this.isActive) { this.isActive = true; (this.direction === 1 ? cfg.onEnter : cfg.onEnterBack) && (this.direction === 1 ? cfg.onEnter : cfg.onEnterBack)(this); cfg.onToggle && cfg.onToggle(this); }
      else if (!active && this.isActive) { this.isActive = false; const f = p >= 1 ? cfg.onLeave : cfg.onLeaveBack; f && f(this); cfg.onToggle && cfg.onToggle(this); }
      this.progress = p; this.prev = p;
      if (this.animation && cfg.scrub != null && cfg.scrub !== false) {
        if (this.smooth) { const k = 1 - Math.exp(-dt / (this.smooth * 280)); this.shown += (p - this.shown) * k; if (Math.abs(p - this.shown) < 0.0005) this.shown = p; this.animation.progress(this.shown); }
        else this.animation.progress(p);
      }
      cfg.onUpdate && cfg.onUpdate(this);
    }
    scroll() { return this.start; }
    kill() { this.unpin(); const i = all.indexOf(this); if (i > -1) all.splice(i, 1); this.dead = true; }
  }
  const ScrollTrigger = {
    create: (cfg) => new ST(cfg),
    getById: (id) => all.find((s) => s.cfg.id === id),
    getAll: () => all.slice(),
    refresh(force) {
      if (refreshing) return; refreshing = true;
      all.forEach((s) => s.unpin());
      const list = all.filter((s) => s.trigger && s.trigger.isConnected).map((s) => { s.__t = docTop(s.trigger); return s; }).sort((a, b) => a.__t - b.__t || a.order - b.order);
      list.forEach((s) => { s.measure(); if (s.cfg.pin) s.pin(); });
      // pins installed in order; re-measure subsequent triggers after earlier spacers exist
      list.forEach((s) => { s.unpin(); });
      list.forEach((s) => { s.measure(); if (s.cfg.pin) s.pin(); });
      refreshing = false;
      list.forEach((s) => { s.prev = 0; s.pstate = ''; s.update(window.scrollY, 16); });
    },
    update() { loopOnce(); },
    config() {}, clearScrollMemory() {}, normalizeScroll() {}, isTouch: 0,
    addEventListener() {}, removeEventListener() {},
  };

  let last = performance.now();
  function loopOnce() { const now = performance.now(); const dt = now - last; last = now; const y = window.scrollY; all.forEach((s) => s.update(y, dt)); }
  function loop(now) { tickTweens(now); autos.forEach((tl) => { if (tl.t0 == null) tl.t0 = now; const el = (now - tl.t0) / 1000; tl.render(Math.min(el, tl.duration())); if (el > tl.duration() + 0.1) autos.delete(tl); }); loopOnce(); tickers.forEach((f) => f(now / 1000)); requestAnimationFrame(loop); }
  requestAnimationFrame(loop);
  let rt; window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => ScrollTrigger.refresh(), 200); });
  window.addEventListener('load', () => setTimeout(() => ScrollTrigger.refresh(), 50));
  window.gsap = gsap; window.ScrollTrigger = ScrollTrigger; window.__SHIM__ = true;
})();
