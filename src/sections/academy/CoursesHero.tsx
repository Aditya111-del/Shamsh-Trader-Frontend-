import { useParallax } from '../../hooks/useParallax';

export default function CoursesHero() {
  const glowRef = useParallax<HTMLDivElement>(0.24);

  return (
    <section
      className="relative overflow-hidden px-[18px] md:px-10"
      style={{ paddingTop: 170, paddingBottom: 70 }}
    >
      <div
        ref={glowRef}
        style={{
          position: 'absolute',
          top: '-30%',
          right: '-10%',
          width: 900,
          height: 680,
          background: 'radial-gradient(ellipse,rgba(34,197,94,0.15),transparent 68%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
        }}
      />
      <div className="relative mx-auto" style={{ maxWidth: 1200 }}>
        <div
          style={{
            fontSize: 12,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: '#22c55e',
            fontWeight: 600,
            marginBottom: 22,
            animation: 'fadeSlideUp .8s ease forwards',
            opacity: 0,
          }}
        >
          Structured &middot; Mentored &middot; Battle-tested
        </div>
        <h1
          style={{
            fontSize: 'clamp(52px,6.4vw,96px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: '#fff',
            margin: '0 0 26px',
            animation: 'fadeSlideUp .9s ease .1s forwards',
            opacity: 0,
          }}
        >
          The{' '}
          <em
            className="accent-italic"
            style={{ color: '#22c55e', letterSpacing: '-0.01em' }}
          >
            Academy
          </em>
        </h1>
        <p
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 540,
            fontWeight: 300,
            margin: 0,
            animation: 'fadeSlideUp .9s ease .22s forwards',
            opacity: 0,
          }}
        >
          Not a course dump. A guided path from your first candle to your first payout &mdash;
          with checkpoints, live rooms and real accountability.
        </p>
      </div>
    </section>
  );
}
