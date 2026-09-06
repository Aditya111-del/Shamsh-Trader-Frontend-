import { useReveal } from '../hooks/useReveal';

export default function About() {
  const image = useReveal<HTMLDivElement>({ y: 50, duration: 1 });
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const p1 = useReveal({ delay: 160 });
  const p2 = useReveal({ delay: 240 });
  const stats = useReveal({ delay: 320 });

  return (
    <section
      id="about"
      className="relative mx-auto"
      style={{ maxWidth: 1200, paddingTop: 130, paddingBottom: 130 }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[0.85fr_1fr] gap-12 md:gap-[72px] items-center">
        <div ref={image.ref} className="relative px-5 sm:px-10" style={image.style}>
          <div
            className="absolute pointer-events-none"
            style={{
              inset: -24,
              borderRadius: 28,
              background: 'radial-gradient(circle at 50% 40%, rgba(34,197,94,0.28), transparent 68%)',
              filter: 'blur(24px)',
              zIndex: 0,
            }}
          />
          <div
            className="relative overflow-hidden"
            style={{
              zIndex: 1,
              borderRadius: 22,
              border: '1px solid rgba(255,255,255,0.1)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
              animation: 'floatY 8s ease-in-out infinite',
            }}
          >
            <img
              src="/images/research-1.jpg"
              alt="Shamsh Trader"
              style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block' }}
            />
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(10,10,10,0.85))' }}
            />
            <div className="absolute z-[2]" style={{ left: 24, bottom: 22 }}>
              <div style={{ fontWeight: 700, fontSize: 22, color: '#fff', letterSpacing: '-0.01em' }}>
                Shamsh
              </div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.2em',
                  textTransform: 'uppercase',
                  color: '#22c55e',
                  fontWeight: 600,
                  marginTop: 2,
                }}
              >
                Founder &amp; Head Trader
              </div>
            </div>
          </div>
          <div
            className="absolute z-[2]"
            style={{
              right: -18,
              top: 36,
              padding: '14px 18px',
              borderRadius: 14,
              background: 'rgba(10,10,10,0.8)',
              border: '1px solid rgba(34,197,94,0.35)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.5), 0 0 24px rgba(34,197,94,0.15)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.45)',
                fontWeight: 600,
              }}
            >
              Since
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: '#fff', lineHeight: 1 }}>2019</div>
          </div>
        </div>

        <div>
          <div className="px-5 sm:px-10 md:px-0">
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
              The Trader
            </div>
          <h2
            ref={heading.ref}
            style={{
              ...heading.style,
              fontSize: 'clamp(34px, 3.6vw, 52px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: '0 0 28px',
              color: '#fff',
            }}
          >
            I don't predict the market.
            <br />
            <span style={{ color: '#22c55e' }}>I read it.</span>
          </h2>
          <p
            ref={p1.ref}
            style={{
              ...p1.style,
              fontSize: 17,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.62)',
              margin: '0 0 20px',
              maxWidth: 540,
              fontWeight: 300,
            }}
          >
            For over five years I've traded crypto and the Indian stock market (Nifty, Bank Nifty & Equities) through every kind of market — euphoria,
            panic, and everything between. What separates the traders who last from the ones who blow up isn't
            a secret indicator. It's process, patience, and ruthless risk control.
          </p>
          <p
            ref={p2.ref}
            style={{
              ...p2.style,
              fontSize: 17,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.62)',
              margin: '0 0 36px',
              maxWidth: 540,
              fontWeight: 300,
            }}
          >
            Now I teach that same framework to a community of 10,000+ traders — no hype, no signals to blindly
            copy. Just the discipline to build a real, repeatable edge.
          </p>
          </div>
          <div ref={stats.ref} className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6" style={stats.style}>
            {[
              { value: '₹4 Cr+', label: 'Volume Traded' },
              { value: '10K+', label: 'Active Traders' },
              { value: '24/7', label: 'Community' },
            ].map((s, i) => (
              <div
                key={s.label}
                className={`p-4 sm:p-6 relative overflow-hidden group ${i === 2 ? 'col-span-2 sm:col-span-1' : ''}`}
                style={{
                  borderRadius: 16,
                  background: '#0f1115',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
                  transition: 'border-color .4s, transform .4s, box-shadow .4s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)';
                  e.currentTarget.style.boxShadow = '0 15px 40px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)';
                }}
              >
                <div 
                  className="absolute inset-0 pointer-events-none opacity-[0.03]"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                  }}
                />
                <div 
                  className="relative z-10 transition-colors duration-300 group-hover:text-green-400"
                  style={{ fontSize: 28, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: 8 }}
                >
                  {s.value}
                </div>
                <div
                  className="relative z-10 transition-colors duration-300"
                  style={{
                    fontSize: 11,
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'rgba(255,255,255,0.45)',
                    fontWeight: 700,
                  }}
                >
                  {s.label}
                </div>
              </div>

            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
