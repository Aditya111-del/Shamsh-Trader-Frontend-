import { useEffect, useRef, useState } from 'react';

export interface UseCountUpOptions {
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** ms */
  duration?: number;
}

function format(value: number, opts: UseCountUpOptions) {
  const { decimals = 0, prefix = '', suffix = '' } = opts;
  return (
    prefix +
    value.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) +
    suffix
  );
}

/**
 * Port of fx.js `initCounters`: 1.7s cubic ease-out count-up, fires once when
 * the bound element scrolls into view. Render `display` as the node's text.
 */
export function useCountUp<T extends HTMLElement = HTMLSpanElement>(to: number, options: UseCountUpOptions = {}) {
  const { duration = 1700 } = options;
  const ref = useRef<T>(null);
  const [display, setDisplay] = useState(() => format(0, options));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(el);
          const t0 = performance.now();
          const ease = (t: number) => 1 - Math.pow(1 - t, 3);
          const tick = (now: number) => {
            const p = Math.min((now - t0) / duration, 1);
            setDisplay(format(to * ease(p), options));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, duration]);

  return { ref, display };
}
