import { useEffect, useRef } from 'react';

/**
 * Port of fx.js `initDraw`: measures an SVG path's total length and animates
 * stroke-dashoffset from full-length to 0 once it scrolls into view.
 * Usage: const pathRef = useDrawPath(); <path ref={pathRef} d="..." />
 */
export function useDrawPath<T extends SVGPathElement = SVGPathElement>(durationSeconds = 2.2) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const p = ref.current;
    if (!p) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          let len = 2400;
          try {
            len = p.getTotalLength();
          } catch {
            /* path not yet measurable */
          }
          p.style.strokeDasharray = String(len);
          p.style.strokeDashoffset = String(len);
          // Force reflow so the transition below actually animates.
          p.getBoundingClientRect();
          p.style.transition = `stroke-dashoffset ${durationSeconds}s cubic-bezier(.22,1,.36,1)`;
          p.style.strokeDashoffset = '0';
          io.unobserve(p);
        });
      },
      { threshold: 0.25 }
    );
    io.observe(p);
    return () => io.disconnect();
  }, [durationSeconds]);

  return ref;
}
