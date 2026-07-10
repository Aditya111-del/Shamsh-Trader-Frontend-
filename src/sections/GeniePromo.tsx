import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useReveal } from '../hooks/useReveal';
import { useParallax } from '../hooks/useParallax';
import { useTilt } from '../hooks/useTilt';
import { useMagnetic } from '../hooks/useMagnetic';

type ChatMsg =
  | { kind: 'user'; text: string }
  | { kind: 'bot'; text: string; tags?: { label: string; color: string; bg: string; border: string }[] };

const SCRIPT: ChatMsg[] = [
  { kind: 'user', text: 'BTC swept the 4H low into demand — is a long valid here?' },
  {
    kind: 'bot',
    text: 'Structure is constructive — 15m CHoCH confirmed with rising delta. A long is valid while price holds above the sweep.',
    tags: [
      { label: 'Bias: Long', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
      { label: 'R:R 1 : 3.2', color: '#22c55e', bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)' },
      { label: 'Confluence 78%', color: 'rgba(255,255,255,0.7)', bg: 'rgba(255,255,255,0.06)', border: 'rgba(255,255,255,0.12)' },
    ],
  },
  { kind: 'user', text: "Where's my invalidation?" },
  { kind: 'bot', text: 'Below $60,980 — the sweep low. Size for 0.5% risk max. First target sits at $63,450 liquidity.' },
];

const FEATURES = [
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline>
        <polyline points="16 7 22 7 22 13"></polyline>
      </svg>
    ),
    text: 'Instant multi-timeframe chart reads',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    text: 'Pre-trade risk & invalidation checks',
  },
  {
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="16 18 22 12 16 6"></polyline>
        <polyline points="8 6 2 12 8 18"></polyline>
      </svg>
    ),
    text: 'Strategy & backtest code on demand',
  },
];

/** Mirrors fx.js `initChatDemo`/`runChat`: reveal messages sequentially,
 * showing a 1.2s typing indicator before each bot turn. Loops once the
 * script completes. Only runs once the demo card is in view. */
function useChatDemo(active: boolean) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    const runStep = (index: number) => {
      if (cancelled) return;
      if (index >= SCRIPT.length) {
        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          setVisibleCount(0);
          setTyping(false);
          runStep(0);
        }, 2600));
        return;
      }
      const msg = SCRIPT[index];
      if (msg.kind === 'bot') {
        setTyping(true);
        timeouts.push(setTimeout(() => {
          if (cancelled) return;
          setTyping(false);
          setVisibleCount(index + 1);
          timeouts.push(setTimeout(() => runStep(index + 1), 900));
        }, 1200));
      } else {
        setVisibleCount(index + 1);
        timeouts.push(setTimeout(() => runStep(index + 1), 700));
      }
    };

    timeouts.push(setTimeout(() => runStep(0), 500));

    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, [active]);

  return { visibleCount, typing };
}

function ChatBubble({ msg }: { msg: ChatMsg }) {
  if (msg.kind === 'user') {
    return (
      <div className="flex justify-end" style={{ opacity: 1 }}>
        <span
          style={{
            maxWidth: '78%',
            padding: '12px 16px',
            borderRadius: '16px 16px 4px 16px',
            background: 'rgba(34,197,94,0.14)',
            border: '1px solid rgba(34,197,94,0.3)',
            fontSize: 14,
            lineHeight: 1.55,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          {msg.text}
        </span>
      </div>
    );
  }
  return (
    <div className="flex justify-start">
      <span
        className="flex flex-col gap-2.5"
        style={{
          maxWidth: '85%',
          padding: '12px 16px',
          borderRadius: '16px 16px 16px 4px',
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(168,85,247,0.25)',
          fontSize: 14,
          lineHeight: 1.55,
          color: 'rgba(255,255,255,0.85)',
        }}
      >
        <span>{msg.text}</span>
        {msg.tags && (
          <span className="flex gap-2 flex-wrap">
            {msg.tags.map((tag) => (
              <span
                key={tag.label}
                style={{
                  padding: '4px 10px',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  color: tag.color,
                  background: tag.bg,
                  border: `1px solid ${tag.border}`,
                }}
              >
                {tag.label}
              </span>
            ))}
          </span>
        )}
      </span>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div
      className="flex items-center"
      style={{
        gap: 5,
        padding: '10px 16px',
        borderRadius: '16px 16px 16px 4px',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(168,85,247,0.25)',
        width: 'fit-content',
      }}
    >
      {[0, 0.18, 0.36].map((d) => (
        <span
          key={d}
          style={{
            width: 6,
            height: 6,
            borderRadius: 999,
            background: '#c084fc',
            animation: `typingDot 1.1s infinite ${d}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function GeniePromo() {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const desc = useReveal({ delay: 160 });
  const featureList = useReveal({ delay: 240 });
  const cta = useReveal<HTMLAnchorElement>({ delay: 320 });
  const demoReveal = useReveal<HTMLDivElement>({ delay: 150, y: 50, duration: 1 });
  const tiltRef = useTilt<HTMLDivElement>(3.5);
  const magnetRef = useMagnetic<HTMLAnchorElement>(16);
  const parallax1 = useParallax(0.22, sectionRef);
  const parallax2 = useParallax(0.12, sectionRef);
  const { visibleCount, typing } = useChatDemo(demoReveal.shown);

  return (
    <section
      ref={sectionRef}
      id="genie"
      className="relative overflow-hidden"
      style={{
        padding: '120px 0',
        background: 'linear-gradient(180deg, #0a0a0a, #0b0812, #0a0a0a)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div
        ref={parallax1}
        className="absolute pointer-events-none"
        style={{
          top: '-10%',
          right: '-10%',
          width: 760,
          height: 760,
          background: 'radial-gradient(circle, rgba(34,197,94,0.16), transparent 65%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        ref={parallax2}
        className="absolute pointer-events-none"
        style={{
          bottom: '-20%',
          left: '-12%',
          width: 640,
          height: 640,
          background: 'radial-gradient(circle, rgba(34,197,94,0.10), transparent 65%)',
          filter: 'blur(50px)',
        }}
      />
      <div
        className="relative mx-auto grid grid-cols-1 md:grid-cols-2"
        style={{ maxWidth: 1200, padding: '0 40px', gap: 64, alignItems: 'center' }}
      >
        <div>
          <div
            ref={eyebrow.ref}
            style={{
              ...eyebrow.style,
              fontSize: 12,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: '#22c55e',
              fontWeight: 600,
              marginBottom: 20,
            }}
          >
            Genie AI
          </div>
          <h2
            ref={heading.ref}
            style={{
              ...heading.style,
              fontSize: 'clamp(34px, 3.8vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 24px',
              color: '#fff',
            }}
          >
            A trading brain that <span className="accent-italic" style={{ color: '#22c55e' }}>never sleeps</span>
          </h2>
          <p
            ref={desc.ref}
            style={{
              ...desc.style,
              fontSize: 17,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.6)',
              margin: '0 0 34px',
              maxWidth: 480,
              fontWeight: 300,
            }}
          >
            Genie reads structure, checks your risk and challenges your bias in seconds — trained on the exact
            framework taught inside the community.
          </p>
          <div ref={featureList.ref} className="flex flex-col gap-4" style={{ ...featureList.style, marginBottom: 38 }}>
            {FEATURES.map((f) => (
              <div key={f.text} className="flex items-center gap-3.5" style={{ gap: 14 }}>
                <span
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: 'rgba(34,197,94,0.14)',
                    border: '1px solid rgba(34,197,94,0.3)',
                  }}
                >
                  {f.icon}
                </span>
                <span style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)' }}>{f.text}</span>
              </div>
            ))}
          </div>
          <Link
            ref={(node) => {
              cta.ref.current = node;
              magnetRef.current = node;
            }}
            to="/ai-chat"
            className="inline-flex items-center gap-3"
            style={{
              ...cta.style,
              background: 'linear-gradient(90deg,#22c55e,#4ade80)',
              color: '#000',
              padding: '15px 15px 15px 30px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 0 40px rgba(34,197,94,0.35)',
            }}
          >
            Start Chatting
            <span
              className="flex items-center justify-center"
              style={{ width: 34, height: 34, borderRadius: 999, background: 'rgba(0,0,0,0.5)' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </span>
          </Link>
        </div>

        <div ref={demoReveal.ref} style={demoReveal.style}>
          <div
            ref={tiltRef}
            className="relative overflow-hidden"
            style={{
              borderRadius: 24,
              border: '1px solid rgba(34,197,94,0.3)',
              background: 'rgba(12,10,18,0.85)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 90px rgba(0,0,0,0.6), 0 0 60px rgba(34,197,94,0.12)',
            }}
          >
            <div
              className="flex items-center gap-3.5"
              style={{ gap: 14, padding: '18px 22px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span
                className="relative flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 999,
                  background: 'conic-gradient(from 0deg, #22c55e, #a855f7, #22c55e)',
                  animation: 'orbSpin 6s linear infinite',
                }}
              >
                <span
                  className="flex items-center justify-center"
                  style={{ width: 32, height: 32, borderRadius: 999, background: '#0c0a12' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3l1.9 5.7L19 10l-5.1 1.3L12 17l-1.9-5.7L5 10l5.1-1.3L12 3z"></path>
                  </svg>
                </span>
              </span>
              <span className="flex flex-col">
                <span style={{ fontSize: 15, fontWeight: 700, color: '#fff' }}>Genie AI</span>
                <span className="inline-flex items-center gap-1.5" style={{ gap: 6, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: 999,
                      background: '#22c55e',
                      animation: 'onlinePulse 2.4s infinite',
                    }}
                  />
                  Online · reads live charts
                </span>
              </span>
              <span
                style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                }}
              >
                Preview
              </span>
            </div>
            <div
              className="flex flex-col gap-3.5"
              style={{ height: 330, overflow: 'hidden', padding: 22, gap: 14 }}
            >
              {SCRIPT.slice(0, visibleCount).map((msg, i) => (
                <ChatBubble key={i} msg={msg} />
              ))}
              {typing && <TypingIndicator />}
            </div>
            <div
              className="flex items-center gap-3"
              style={{ padding: '16px 22px', borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span
                className="flex-1"
                style={{
                  padding: '12px 18px',
                  borderRadius: 999,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.35)',
                }}
              >
                Ask Genie anything…
              </span>
              <span
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  background: 'linear-gradient(135deg,#22c55e,#4ade80)',
                  boxShadow: '0 0 20px rgba(34,197,94,0.4)',
                }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
