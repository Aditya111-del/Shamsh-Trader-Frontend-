import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useReveal } from '../hooks/useReveal';
import { useParallax } from '../hooks/useParallax';
import { useMagnetic } from '../hooks/useMagnetic';

export default function NewsletterSub() {
  const { isAdmin } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const desc = useReveal({ delay: 160 });
  const form = useReveal<HTMLFormElement>({ delay: 240 });
  const meta = useReveal({ delay: 320 });
  const parallax1 = useParallax(0.2, sectionRef);
  const parallax2 = useParallax(0.08, sectionRef);
  const magnetRef = useMagnetic<HTMLButtonElement>(20);
  const [focused, setFocused] = useState(false);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden"
      style={{ padding: '150px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        ref={parallax1}
        className="absolute pointer-events-none"
        style={{
          top: '-30%',
          left: '50%',
          marginLeft: -540,
          width: 1080,
          height: 700,
          background: 'radial-gradient(ellipse at center, rgba(34,197,94,0.14), rgba(132,204,22,0.05) 45%, transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        ref={parallax2}
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: 'url(/matrix-map.png)', backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.05 }}
      />
      <div className="relative mx-auto flex flex-col items-center text-center" style={{ maxWidth: 820 }}>
        <div
          ref={eyebrow.ref}
          style={{
            ...eyebrow.style,
            fontSize: 12,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#22c55e',
            fontWeight: 600,
            marginBottom: 24,
          }}
        >
          The Newsletter
        </div>
        <h2
          ref={heading.ref}
          style={{
            ...heading.style,
            fontSize: 'clamp(42px, 5.4vw, 78px)',
            fontWeight: 800,
            lineHeight: 1.04,
            letterSpacing: '-0.035em',
            color: '#fff',
            margin: '0 0 22px',
          }}
        >
          The edge, in your
          <br />
          <span
            className="accent-italic"
            style={{
              background: 'linear-gradient(90deg,#84cc16,#22c55e)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
            }}
          >
            inbox
          </span>
          .
        </h2>
        <p
          ref={desc.ref}
          style={{
            ...desc.style,
            fontSize: 17,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.55)',
            margin: '0 0 48px',
            maxWidth: 520,
            fontWeight: 300,
          }}
        >
          Weekly market breakdowns, high-probability watchlists and behind-the-scenes trade reviews. Written by a
          trader, not a marketing team.
        </p>
        <form
          ref={form.ref}
          onSubmit={(e) => e.preventDefault()}
          className="flex items-center w-full"
          style={{ ...form.style, gap: 20, maxWidth: 560 }}
        >
          <input
            type="email"
            placeholder="your@email.com"
            required
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="flex-1"
            style={{
              background: 'transparent',
              border: 'none',
              borderBottom: focused ? '1px solid #22c55e' : '1px solid rgba(255,255,255,0.25)',
              padding: '16px 4px',
              color: '#fff',
              fontFamily: "'Fira Sans'",
              fontSize: 19,
              fontWeight: 300,
              outline: 'none',
              transition: 'border-color .3s',
              letterSpacing: '0.01em',
            }}
          />
          <button
            ref={magnetRef}
            type="submit"
            aria-label="Subscribe"
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 62,
              height: 62,
              borderRadius: 999,
              background: 'linear-gradient(135deg,#84cc16,#22c55e)',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 0 40px rgba(34,197,94,0.35)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </button>
        </form>
        <div ref={meta.ref} className="flex items-center gap-4.5" style={{ ...meta.style, gap: 18, marginTop: 30 }}>
          <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 300 }}>
            Join 12,000+ traders · Weekly · Unsubscribe anytime
          </span>
          <span style={{ width: 4, height: 4, borderRadius: 999, background: 'rgba(255,255,255,0.25)' }} />
          <Link to="/blog" style={{ fontSize: 13, fontWeight: 600, color: '#22c55e' }}>
            Read past issues →
          </Link>
        </div>

        {isAdmin && (
          <div className="mt-10 pt-8 border-t border-white/10 w-full flex justify-center">
            <button
              type="button"
              className="inline-flex items-center gap-2 hover:border-[#22c55e]/60 transition-colors"
              style={{
                padding: '8px 18px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.14)',
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(255,255,255,0.7)',
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              Manage Subscribers
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
