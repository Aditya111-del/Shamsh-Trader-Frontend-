import { useParallax } from '../../hooks/useParallax';
import { useSearchParams } from 'react-router-dom';

const CATEGORIES = ['All', 'Markets', 'Psychology', 'Playbooks'];

export default function JournalHero() {
  const glowRef = useParallax<HTMLDivElement>(0.22);
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get('category') || 'All';

  return (
    <section className="relative overflow-hidden" style={{ padding: '170px 40px 80px' }}>
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: '-30%',
          right: '-8%',
          width: 840,
          height: 640,
          background: 'radial-gradient(ellipse,rgba(34,197,94,0.13),transparent 68%)',
          filter: 'blur(50px)',
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
          Shamsh Trader &middot; Research Desk
        </div>
        <h1
          className="m-0"
          style={{
            fontSize: 'clamp(52px,6.8vw,104px)',
            fontWeight: 800,
            lineHeight: 0.98,
            letterSpacing: '-0.045em',
            color: '#fff',
            marginBottom: 26,
            animation: 'fadeSlideUp .9s ease .1s forwards',
            opacity: 0,
          }}
        >
          The <em className="accent-italic" style={{ color: '#22c55e', letterSpacing: '-0.01em' }}>Journal</em>
        </h1>
        <div
          className="flex flex-wrap items-center justify-between"
          style={{
            gap: 20,
            animation: 'fadeSlideUp .9s ease .22s forwards',
            opacity: 0,
          }}
        >
          <p
            className="m-0"
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.55)',
              maxWidth: 520,
              fontWeight: 300,
            }}
          >
            Weekly market reports, deep dives and trade post-mortems. Written like a private research desk &mdash;
            because it is one.
          </p>
          <div className="flex flex-wrap" style={{ gap: 8 }}>
            {CATEGORIES.map((cat) => {
              const isActive = cat === active;
              return (
                <span
                  key={cat}
                  onClick={() => setSearchParams({ category: cat })}
                  style={{
                    padding: '8px 18px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: isActive ? 700 : 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: isActive ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    background: isActive ? 'rgba(34,197,94,0.12)' : 'transparent',
                    border: isActive ? '1px solid rgba(34,197,94,0.35)' : '1px solid rgba(255,255,255,0.12)',
                    cursor: 'pointer',
                    transition: 'border-color .3s, color .3s',
                  }}
                  onMouseEnter={(e) => {
                    if (isActive) return;
                    e.currentTarget.style.borderColor = 'rgba(34,197,94,0.5)';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    if (isActive) return;
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  }}
                >
                  {cat}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
