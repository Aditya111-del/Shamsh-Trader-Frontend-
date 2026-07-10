import { useParallax } from '../../hooks/useParallax';

export default function FeedHero() {
  const glowRef = useParallax<HTMLDivElement>(0.24);

  return (
    <section className="relative overflow-hidden text-center" style={{ padding: '170px 40px 60px' }}>
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: '-35%',
          left: '50%',
          marginLeft: -540,
          width: 1080,
          height: 760,
          background: 'radial-gradient(ellipse,rgba(34,197,94,0.14),rgba(96,165,250,0.06) 55%,transparent 72%)',
          filter: 'blur(50px)',
        }}
      />
      <div className="relative mx-auto" style={{ maxWidth: 840 }}>
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
          One community &middot; Four platforms
        </div>
        <h1
          className="m-0"
          style={{
            fontSize: 'clamp(52px,6.4vw,96px)',
            fontWeight: 800,
            lineHeight: 1.0,
            letterSpacing: '-0.04em',
            color: '#fff',
            marginBottom: 24,
            animation: 'fadeSlideUp .9s ease .1s forwards',
            opacity: 0,
          }}
        >
          The <em className="accent-italic" style={{ color: '#22c55e', letterSpacing: '-0.01em' }}>Feed</em>
        </h1>
        <p
          className="m-0 mx-auto"
          style={{
            fontSize: 17,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.55)',
            maxWidth: 520,
            fontWeight: 300,
            animation: 'fadeSlideUp .9s ease .22s forwards',
            opacity: 0,
          }}
        >
          Daily setups, market thoughts and behind-the-scenes — wherever you scroll. 270K traders already follow
          along.
        </p>
      </div>
    </section>
  );
}
