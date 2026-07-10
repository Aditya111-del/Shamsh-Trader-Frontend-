import { useEffect, useRef, useState, type CSSProperties } from 'react';

export interface UseRevealOptions {
  /** ms to wait after intersecting before revealing (stagger) */
  delay?: number;
  /** px the element travels while hidden (translateY) */
  y?: number;
  /** IntersectionObserver threshold */
  threshold?: number;
  /** duration in seconds */
  duration?: number;
}

/**
 * Port of fx.js `initReveals`: elements start faded/offset and flip to
 * visible once they cross the viewport threshold, with an optional stagger delay.
 * Usage: const { ref, style } = useReveal({ delay: 160 });
 *        <div ref={ref} style={style}>...</div>
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(options: UseRevealOptions = {}) {
  const { delay = 0, y = 40, threshold = 0.12, duration = 0.9 } = options;
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          timeoutId = setTimeout(() => setShown(true), delay);
          io.unobserve(el);
        });
      },
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(timeoutId);
    };
  }, [delay, threshold]);

  const style: CSSProperties = {
    transition: `opacity ${duration}s cubic-bezier(.16,1,.3,1), transform ${duration}s cubic-bezier(.16,1,.3,1), filter ${duration}s cubic-bezier(.16,1,.3,1)`,
    opacity: shown ? 1 : 0,
    transform: shown ? 'none' : `translateY(${y}px)`,
    filter: shown ? 'none' : undefined,
  };

  return { ref, style, shown };
}
