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
            className="flex flex-col items-center justify-center p-8 rounded-3xl w-full"
            style={{
              maxWidth: 560,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(255,255,255,0.03))',
              border: '1px solid rgba(34,197,94,0.4)',
              boxShadow: '0 0 50px rgba(34,197,94,0.18)',
              animation: 'fadeSlideUp .5s ease forwards',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 mb-3 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
              <CheckCircle2 size={24} />
            </div>
            <div className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
              Status: <span className="text-green-400">Subscribed</span>
            </div>
            <p className="text-sm text-zinc-300 font-medium max-w-md mx-auto leading-relaxed mb-4">
              You will receive all the market reports, high-probability watchlists, and research deep dives directly in your inbox.
            </p>
            <span className="text-xs text-zinc-500 font-mono">
              Active address: <span className="text-zinc-300 font-semibold">{email}</span>
            </span>
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
