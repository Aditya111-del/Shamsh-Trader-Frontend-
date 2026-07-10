import { useEffect, useRef } from 'react';

/** Port of fx.js `initMagnetic`: element translates toward the cursor, releases on leave. */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(strength = 16) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width - 0.5) * strength;
      const y = ((e.clientY - r.top) / r.height - 0.5) * strength;
      el.style.transition = 'transform .15s ease-out';
      el.style.transform = `translate(${x.toFixed(1)}px,${y.toFixed(1)}px)`;
    };
    const leave = () => {
      el.style.transition = 'transform .55s cubic-bezier(.16,1,.3,1)';
      el.style.transform = 'translate(0,0)';
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [strength]);

  return ref;
}
