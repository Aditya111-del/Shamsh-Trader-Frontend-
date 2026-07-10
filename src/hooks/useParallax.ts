import { useEffect, useRef, type RefObject } from 'react';

/**
 * Port of fx.js `initParallax`: damped (lerp 0.09) parallax against scroll.
 * Position is measured from `scopeRef` (or the element's parent if omitted)
 * so the applied transform never feeds back into the measurement.
 * speed: 0.08–0.25 typical (fraction of scroll delta applied).
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed = 0.15,
  scopeRef?: RefObject<HTMLElement | null>
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    el.style.willChange = 'transform';
    let py = 0;
    let raf = 0;
    let running = true;

    const loop = () => {
      if (!running) return;
      const vh = window.innerHeight || 800;
      const scope = scopeRef?.current || el.parentElement;
      if (scope) {
        const r = scope.getBoundingClientRect();
        if (!(r.bottom < -300 || r.top > vh + 300)) {
          const target = -(r.top + r.height / 2 - vh / 2) * speed;
          py += (target - py) * 0.09;
          el.style.transform = `translate3d(0,${py.toFixed(2)}px,0)`;
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [speed, scopeRef]);

  return ref;
}
