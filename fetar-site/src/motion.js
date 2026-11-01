import { useLayoutEffect, useRef } from 'react';

if (window.gsap && window.ScrollTrigger) window.gsap.registerPlugin(window.ScrollTrigger);
export const G = () => window.gsap;
export const ST = () => window.ScrollTrigger;
export const isMobile = () => window.innerWidth < 760;
export const vw = (n) => (window.innerWidth * n) / 100;
export const vh = (n) => (window.innerHeight * n) / 100;
export const reduced = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Keyframe chain on one property: frames = [[time, value, ease?], ...]. Every tween has explicit from/to so
 *  scrubbing in either direction is deterministic. */
export function K(tl, el, prop, frames) {
  if (!el || (el.length === 0)) return;
  const gsap = G();
  gsap.set(el, { [prop]: frames[0][1] });
  for (let i = 1; i < frames.length; i++) {
    const [t0, v0] = frames[i - 1];
    const [t1, v1, ease] = frames[i];
    if (t1 <= t0) continue;
    tl.fromTo(el, { [prop]: v0 }, { [prop]: v1, duration: t1 - t0, ease: ease || 'none', immediateRender: false }, t0);
  }
}

/** Build GSAP animations inside a context, and rebuild when the viewport WIDTH changes (mobile url-bar
 *  resizes only change the height, so they are ignored). */
export function useScene(build, scopeRef) {
  const fn = useRef(build);
  fn.current = build;
  useLayoutEffect(() => {
    const gsap = G();
    if (!gsap || !ST()) { document.documentElement.classList.add('no-gsap'); return undefined; }
    let ctx = null;
    let w = window.innerWidth, mob = isMobile();
    const make = () => { ctx = gsap.context(() => fn.current(), scopeRef.current); };
    make();
    let t;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => {
        if (Math.abs(window.innerWidth - w) > 40 || mob !== isMobile()) {
          w = window.innerWidth; mob = isMobile();
          ctx.revert(); make(); ST().refresh();
        }
      }, 250);
    };
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(t); window.removeEventListener('resize', onResize); ctx && ctx.revert(); };
  }, []); // eslint-disable-line
}

/** Smooth jump to a named section (pinned sections are addressed through their ScrollTrigger). */
export function jump(key, progress = 0) {
  const st = ST() && ST().getById && ST().getById(key);
  let y;
  if (st) y = st.start + (st.end - st.start) * progress;
  else {
    const el = document.getElementById(key);
    if (!el) return;
    y = el.getBoundingClientRect().top + window.scrollY;
  }
  window.scrollTo({ top: Math.max(0, y), behavior: reduced() ? 'auto' : 'smooth' });
}

export const money = (n, cur = 'EGP') => `${Math.round(n)} ${cur}`;
