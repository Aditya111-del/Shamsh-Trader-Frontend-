import { useState } from 'react';
import { CoverFlowCarousel } from '../components/ui/CoverFlowCarousel';
import { useReveal } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';

interface EdgeCard {
  num: string;
  title: string;
  description: string;
  image: string;
}

const CARDS: EdgeCard[] = [
  {
    num: '01',
    title: 'Market Analysis',
    description:
      'Deep technical and fundamental analysis to spot high-probability setups. We read market structure — not just indicators.',
    image: '/images/capability-1.jpg',
  },
  {
    num: '02',
    title: 'Risk Management',
    description:
      'Protect capital with disciplined position sizing, strategic stops and portfolio heat control. Preservation always comes first.',
    image: '/images/capability-2.jpg',
  },
  {
    num: '03',
    title: 'Psychology Mastery',
    description:
      'Master the mental game. Build unshakeable discipline, emotional control and the patience to wait for your setup.',
    image: '/images/capability-3.jpg',
  },
  {
    num: '04',
    title: 'Strategy Backtesting',
    description:
      'Rigorously test and refine strategies on historical data. Validate a real, statistical edge before risking live capital.',
    image: '/images/capability-4.jpg',
  },
];

function EdgeTile({ card, delay }: { card: EdgeCard; delay: number }) {
  const reveal = useReveal<HTMLDivElement>({ delay, y: 40 });
  const tiltRef = useTilt<HTMLDivElement>(4);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={(node) => {
        reveal.ref.current = node;
        tiltRef.current = node;
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative overflow-hidden flex flex-col justify-end p-6 md:p-9 shrink-0 snap-center w-full"
      style={{
        ...reveal.style,
        borderRadius: 20,
        border: hovered ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(145deg, #18181b, #09090b)',
        boxShadow: '0 0 15px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
        minHeight: 380,
        height: '100%',
        cursor: 'pointer',
        transition: 'border-color .5s, opacity .9s, filter .9s',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${card.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.18,
          filter: 'grayscale(0.4)',
          transition: 'opacity .6s, filter .6s',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(10,10,10,0.4), rgba(10,10,10,0.92))',
        }}
      />
      <div className="relative z-[2] flex flex-col h-full" style={{ padding: 36 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: '#22c55e', letterSpacing: '0.08em' }}>
          {card.num}
        </span>
        <div style={{ marginTop: 'auto' }}>
          <h3 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 12px' }}>
            {card.title}
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: 'rgba(255,255,255,0.6)', margin: 0, maxWidth: 420, fontWeight: 300 }}>
            {card.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function TradingEdge() {
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });

  return (
    <section id="edge" className="relative mx-auto" style={{ maxWidth: 1200, paddingTop: 70, paddingBottom: 110 }}>
      <div className="text-center px-5 sm:px-10" style={{ marginBottom: 64 }}>
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
          Trading Edge
        </div>
        <h2
          ref={heading.ref}
          className="mx-auto"
          style={{
            ...heading.style,
            fontSize: 'clamp(34px, 3.8vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            margin: 0,
            color: '#fff',
            maxWidth: '100%',
          }}
        >
          Four pillars behind every profitable trade
        </h2>
      </div>
      <div className="w-full mt-6">
        <CoverFlowCarousel mobileHeight={320} desktopHeight={440} mobileItemWidth={280} desktopItemWidth={340}>
          {CARDS.map((card) => (
            <EdgeTile key={card.title} card={card} delay={0} />
          ))}
        </CoverFlowCarousel>
      </div>
    </section>
  );
}
