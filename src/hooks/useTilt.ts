import { useEffect, useRef } from 'react';

/** Port of fx.js `initTilt`: 3D tilt toward cursor, spring-back on leave. */
export function useTilt<T extends HTMLElement = HTMLDivElement>(max = 5) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transition = 'transform .12s ease-out';
      el.style.transform = `perspective(950px) rotateX(${(-y * max).toFixed(2)}deg) rotateY(${(x * max).toFixed(2)}deg) translateZ(0)`;
    };
    const leave = () => {
      el.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)';
      el.style.transform = 'perspective(950px) rotateX(0deg) rotateY(0deg)';
    };

    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => {
      el.removeEventListener('mousemove', move);
      el.removeEventListener('mouseleave', leave);
    };
  }, [max]);

  return ref;
}
