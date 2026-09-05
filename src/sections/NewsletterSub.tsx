import { useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';
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
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsSubmitting(true);
    try {
      await api.post('/newsletter', { email: email.trim() });
      setIsSubscribed(true);
      toast.success('Subscribed! You will receive all the market reports.');
    } catch (err: any) {
      if (err?.response?.data?.message?.includes('already subscribed')) {
        setIsSubscribed(true);
        toast.success('You are subscribed! You will receive all the market reports.');
      } else {
        const msg = err?.response?.data?.message || 'Subscription failed. Please try again.';
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        {isSubscribed ? (
          <div
            className="flex flex-col items-center justify-center p-6 sm:p-9 rounded-2xl sm:rounded-3xl w-full relative overflow-hidden"
            style={{
              maxWidth: 580,
              background: 'linear-gradient(180deg, rgba(24,24,27,0.95), rgba(9,9,11,0.98))',
              border: '1px solid rgba(34,197,94,0.35)',
              boxShadow: '0 25px 60px -15px rgba(0,0,0,0.8), 0 0 45px rgba(34,197,94,0.16), inset 0 1px 0 rgba(255,255,255,0.08)',
              backdropFilter: 'blur(20px)',
              animation: 'fadeSlideUp .5s ease forwards',
            }}
          >
            {/* Top ambient highlight line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

            {/* Live Indicator Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-semibold tracking-wider text-emerald-400 uppercase mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Dispatch Active · Verified
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2.5">
              You're on the institutional desk.
            </h3>

            <p className="text-sm text-zinc-400 font-light max-w-md mx-auto leading-relaxed mb-6">
              You're officially subscribed. High-probability Nifty/Crypto watchlists, live trade setups, and weekly market breakdowns will land directly in your inbox.
            </p>

            {/* Email Terminal Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-black/60 border border-white/10 text-xs sm:text-sm text-zinc-200 font-mono shadow-inner mb-6 max-w-full">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span className="truncate max-w-[220px] sm:max-w-[280px]">{email || 'your-email@domain.com'}</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 ml-1 flex-shrink-0">
                Subscribed
              </span>
            </div>

            {/* 3 Value Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full pt-5 border-t border-white/10 text-left">
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-emerald-400 text-xs">⚡</span>
                <span className="text-[11px] text-zinc-300 font-medium">Sunday 08:00 IST</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-emerald-400 text-xs">📊</span>
                <span className="text-[11px] text-zinc-300 font-medium">F&O & Crypto Alpha</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/5">
                <span className="text-emerald-400 text-xs">🎯</span>
                <span className="text-[11px] text-zinc-300 font-medium">Zero Noise, Direct Intel</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { setIsSubscribed(false); setEmail(''); }}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-5 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-400 cursor-pointer"
            >
              Subscribe another email address →
            </button>
          </div>
        ) : (
          <form
            ref={form.ref}
            onSubmit={handleSubmit}
            className="flex items-center w-full"
            style={{ ...form.style, gap: 20, maxWidth: 560 }}
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              disabled={isSubmitting}
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
              disabled={isSubmitting}
              aria-label="Subscribe"
              className="flex items-center justify-center flex-shrink-0 cursor-pointer"
              style={{
                width: 62,
                height: 62,
                borderRadius: 999,
                background: 'linear-gradient(135deg,#84cc16,#22c55e)',
                border: 'none',
                boxShadow: '0 0 40px rgba(34,197,94,0.35)',
                opacity: isSubmitting ? 0.7 : 1,
              }}
            >
              {isSubmitting ? (
                <Loader2 size={22} className="animate-spin text-black" />
              ) : (
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              )}
            </button>
          </form>
        )}
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
