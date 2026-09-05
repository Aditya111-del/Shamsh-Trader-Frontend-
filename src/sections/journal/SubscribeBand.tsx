import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { useReveal } from '../../hooks/useReveal';
import { useParallax } from '../../hooks/useParallax';
import { useMagnetic } from '../../hooks/useMagnetic';

export default function SubscribeBand() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const sectionGlow = useParallax<HTMLDivElement>(0.2);
  const eyebrow = useReveal<HTMLDivElement>();
  const heading = useReveal<HTMLHeadingElement>({ delay: 80 });
  const form = useReveal<HTMLFormElement>({ delay: 160 });
  const note = useReveal<HTMLSpanElement>({ delay: 240 });
  const magnetRef = useMagnetic<HTMLButtonElement>(20);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await api.post('/newsletter', { email: email.trim() });
      setSubmitted(true);
      toast.success('Subscribed! You will receive all the market reports.');
    } catch (err: any) {
      if (err?.response?.data?.message?.includes('already subscribed')) {
        setSubmitted(true);
        toast.success('You are subscribed! You will receive all the market reports.');
      } else {
        const msg = err?.response?.data?.message || 'Subscription failed';
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="subscribe"
      className="relative overflow-hidden"
      style={{ padding: '140px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div
        ref={sectionGlow}
        className="pointer-events-none absolute"
        style={{
          top: '-30%',
          left: '50%',
          marginLeft: -540,
          width: 1080,
          height: 700,
          background: 'radial-gradient(ellipse,rgba(34,197,94,0.14),transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="relative mx-auto flex flex-col items-center text-center"
        style={{ maxWidth: 820 }}
      >
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
          Free &middot; Every Sunday
        </div>
        <h2
          ref={heading.ref}
          className="m-0"
          style={{
            ...heading.style,
            fontSize: 'clamp(38px,4.8vw,68px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            color: '#fff',
            marginBottom: 22,
          }}
        >
          Get every issue{' '}
          <em
            className="accent-italic"
            style={{
              background: 'linear-gradient(90deg,#84cc16,#22c55e)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              WebkitTextFillColor: 'transparent',
              letterSpacing: 0,
            }}
          >
            first
          </em>
        </h2>
        {submitted ? (
          <div
            className="flex flex-col items-center justify-center p-6 sm:p-8 rounded-3xl w-full"
            style={{
              maxWidth: 540,
              marginTop: 20,
              background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(255,255,255,0.03))',
              border: '1px solid rgba(34,197,94,0.4)',
              boxShadow: '0 0 40px rgba(34,197,94,0.18)',
              animation: 'fadeSlideUp .5s ease forwards',
            }}
          >
            <div className="w-10 h-10 rounded-full bg-green-500/20 border border-green-500/40 flex items-center justify-center text-green-400 mb-2 shadow-[0_0_16px_rgba(34,197,94,0.4)]">
              <CheckCircle2 size={22} />
            </div>
            <div className="text-xl font-extrabold text-white tracking-tight mb-1.5">
              Status: <span className="text-green-400">Subscribed</span>
            </div>
            <p className="text-sm text-zinc-300 font-medium max-w-md mx-auto leading-relaxed">
              You will receive all the market reports and weekly research directly in your inbox.
            </p>
          </div>
        ) : (
          <form
            ref={form.ref}
            onSubmit={handleSubmit}
            className="flex w-full items-center"
            style={{ ...form.style, gap: 20, maxWidth: 540, marginTop: 16 }}
          >
            <input
              type="email"
              required
              disabled={loading}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1"
              style={{
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
                padding: '16px 4px',
                color: '#fff',
                fontFamily: "'Fira Sans', sans-serif",
                fontSize: 19,
                fontWeight: 300,
                outline: 'none',
                transition: 'border-color .3s',
              }}
              onFocus={(e) => (e.currentTarget.style.borderBottomColor = '#22c55e')}
              onBlur={(e) => (e.currentTarget.style.borderBottomColor = 'rgba(255,255,255,0.25)')}
            />
            <button
              ref={magnetRef}
              type="submit"
              disabled={loading}
              aria-label="Subscribe"
              className="cursor-pointer"
              style={{
                width: 62,
                height: 62,
                borderRadius: 999,
                background: 'linear-gradient(135deg,#84cc16,#22c55e)',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 40px rgba(34,197,94,0.35)',
                flexShrink: 0,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <Loader2 size={22} className="animate-spin text-black" />
              ) : (
                <ArrowRight size={22} strokeWidth={2.5} color="#000" />
              )}
            </button>
          </form>
        )}
        <span
          ref={note.ref}
          style={{
            ...note.style,
            fontSize: 13,
            color: 'rgba(255,255,255,0.4)',
            fontWeight: 300,
            marginTop: 26,
          }}
        >
          Join 12,000+ traders &middot; No spam, unsubscribe anytime
        </span>
      </div>
    </section>
  );
}
