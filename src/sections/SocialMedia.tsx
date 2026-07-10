import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CoverFlowCarousel } from '../components/ui/CoverFlowCarousel';
import { useReveal } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';
import { useDrawPath } from '../hooks/useDrawPath';

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function BotIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"></polyline>
      <polyline points="8 6 2 12 8 18"></polyline>
    </svg>
  );
}

function FeedIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
    </svg>
  );
}

function PlatformIcons() {
  return (
    <span className="flex" style={{ gap: 10, marginTop: 18 }}>
      <span
        className="flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#ef4444">
          <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.6 12 3.6 12 3.6s-4.4 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.4 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.3l6.4 3.4-6.4 3.4z" />
        </svg>
      </span>
      <span
        className="flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.3)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5"></rect>
          <circle cx="12" cy="12" r="4"></circle>
          <circle cx="17.5" cy="6.5" r="1" fill="#ec4899" stroke="none"></circle>
        </svg>
      </span>
      <span
        className="flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.3)' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      </span>
      <span
        className="flex items-center justify-center"
        style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)' }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="#3b82f6">
          <path d="M9.04 16.62l-.38 5.36c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.65.25 1.91-.9L22.9 3.8c.31-1.43-.52-1.99-1.46-1.64L2.4 9.5c-1.4.54-1.38 1.32-.24 1.67l4.87 1.52L18.35 5.6c.53-.35 1.02-.16.62.19L9.04 16.62z" />
        </svg>
      </span>
    </span>
  );
}

function JournalTile({ delay }: { delay: number }) {
  const reveal = useReveal<HTMLAnchorElement>({ delay, y: 40 });
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={(node) => {
        reveal.ref.current = node;
        tiltRef.current = node;
      }}
      to="/blog"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden p-6 md:p-9 shrink-0 snap-center w-full"
      style={{
        ...reveal.style,
        minHeight: 320,
        height: '100%',
        borderRadius: 20,
        border: hovered ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(145deg, #18181b, #09090b)',
        boxShadow: '0 0 15px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'border-color .4s, opacity .9s, transform .9s',
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: 24 }}
      >
        <BookIcon />
      </span>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: 10 }}>
        The Journal
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
        Weekly market reports, deep-dive analysis and trade reviews — written like a private research desk.
      </span>
      <span
        className="inline-flex items-center gap-2"
        style={{ marginTop: 'auto', paddingTop: 24, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22c55e' }}
      >
        Read the Journal
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
      <span
        className="absolute pointer-events-none accent-italic"
        style={{ right: -40, bottom: -46, fontSize: 170, lineHeight: 1, color: 'rgba(34,197,94,0.07)' }}
      >
        J
      </span>
    </Link>
  );
}

function MarketTile({ delay }: { delay: number }) {
  const reveal = useReveal<HTMLAnchorElement>({ delay, y: 40 });
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const pathRef = useDrawPath(2.2);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={(node) => {
        reveal.ref.current = node;
        tiltRef.current = node;
      }}
      to="/marketplace"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden p-5 md:p-9 shrink-0 snap-center w-full"
      style={{
        ...reveal.style,
        minHeight: 320,
        height: '100%',
        borderRadius: 20,
        border: hovered ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(145deg, #18181b, #09090b)',
        boxShadow: '0 0 15px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'border-color .4s, opacity .9s, transform .9s',
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: 24 }}
      >
        <BotIcon />
      </span>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: 10 }}>
        Algo Market
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
        Battle-tested trading bots with verified live stats. Deploy a strategy in one click.
      </span>
      <svg viewBox="0 0 200 44" preserveAspectRatio="none" style={{ width: '70%', height: 44, marginTop: 18, opacity: 0.8 }}>
        <path
          ref={pathRef}
          d="M0,38 L22,32 L44,35 L66,24 L88,28 L110,16 L132,20 L154,10 L176,14 L200,4"
          fill="none"
          stroke="#22c55e"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ strokeDasharray: 400, strokeDashoffset: 400, filter: 'drop-shadow(0 0 5px rgba(34,197,94,0.5))' }}
        />
      </svg>
      <span
        className="inline-flex items-center gap-2"
        style={{ marginTop: 'auto', paddingTop: 24, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22c55e' }}
      >
        Browse Bots
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </Link>
  );
}

function FeedTile({ delay }: { delay: number }) {
  const reveal = useReveal<HTMLAnchorElement>({ delay, y: 40 });
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={(node) => {
        reveal.ref.current = node;
        tiltRef.current = node;
      }}
      to="/social"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative flex flex-col overflow-hidden p-6 md:p-9 shrink-0 snap-center w-full"
      style={{
        ...reveal.style,
        minHeight: 320,
        height: '100%',
        borderRadius: 20,
        border: hovered ? '1px solid rgba(34,197,94,0.45)' : '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(145deg, #18181b, #09090b)',
        boxShadow: '0 0 15px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'border-color .4s, opacity .9s, transform .9s',
      }}
    >
      <span
        className="flex items-center justify-center"
        style={{ width: 46, height: 46, borderRadius: 14, background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: 24 }}
      >
        <FeedIcon />
      </span>
      <span style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', marginBottom: 10 }}>
        The Feed
      </span>
      <span style={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
        Daily updates across YouTube, Instagram, X and Telegram — one community, 270K strong.
      </span>
      <PlatformIcons />
      <span
        className="inline-flex items-center gap-2"
        style={{ marginTop: 'auto', paddingTop: 24, fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#22c55e' }}
      >
        Join the Feed
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </span>
    </Link>
  );
}

export default function SocialMedia() {
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });

  return (
    <section id="explore" className="relative mx-auto" style={{ maxWidth: 1200, paddingTop: 120, paddingBottom: 130 }}>
      <style>{`
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <div className="text-center px-5 sm:px-10" style={{ marginBottom: 60 }}>
        <div
          ref={eyebrow.ref}
          style={{
            ...eyebrow.style,
            fontSize: 12,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#22c55e',
            fontWeight: 600,
            marginBottom: 18,
          }}
        >
          Explore the Ecosystem
        </div>
        <h2
          ref={heading.ref}
          style={{
            ...heading.style,
            fontSize: 'clamp(34px, 3.8vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            margin: 0,
            color: '#fff',
          }}
        >
          One membership. <span className="accent-italic" style={{ color: '#22c55e' }}>Every</span> edge.
        </h2>
      </div>
      <div className="w-full">
        <CoverFlowCarousel mobileHeight={300} desktopHeight={400} mobileItemWidth={280} desktopItemWidth={340}>
          <JournalTile delay={0} />
          <MarketTile delay={0} />
          <FeedTile delay={0} />
        </CoverFlowCarousel>
      </div>
    </section>
  );
}
