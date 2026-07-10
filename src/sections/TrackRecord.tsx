import { useState } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useDrawPath } from '../hooks/useDrawPath';
import { useCountUp } from '../hooks/useCountUp';

const TABS = ['1Y', '3Y', 'All'] as const;

const STATS = [
  { to: 95, suffix: '%', label: 'Setup Win Rate' },
  { to: 10, suffix: 'K+', label: 'Active Traders' },
  { to: 250, suffix: 'K+', label: 'Trades Analyzed' },
  { to: 5, suffix: '+', label: 'Years Live' },
];

function StatPill({ to, suffix, label, delay }: { to: number; suffix: string; label: string; delay: number }) {
  const reveal = useReveal<HTMLDivElement>({ delay, y: 40 });
  const { ref: countRef, display } = useCountUp(to, { suffix });

  return (
    <div
      ref={reveal.ref}
      style={{
        ...reveal.style,
        textAlign: 'center',
        padding: '32px 20px',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1 }}>
        <span ref={countRef}>{display}</span>
      </div>
      <div
        style={{
          fontSize: 12,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.45)',
          fontWeight: 600,
          marginTop: 12,
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default function TrackRecord() {
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const chart = useReveal<HTMLDivElement>({ y: 40, duration: 1 });
  const pathRef = useDrawPath(2.2);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('1Y');

  return (
    <section
      className="relative"
      style={{
        padding: '110px 0',
        background: 'linear-gradient(180deg, #0a0a0a, #050705, #0a0a0a)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
      }}
    >
      <div
        className="absolute pointer-events-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 900,
          height: 520,
          background: 'radial-gradient(ellipse, rgba(34,197,94,0.12), transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div className="relative mx-auto" style={{ maxWidth: 1200, padding: '0 40px' }}>
        <div className="text-center" style={{ marginBottom: 56 }}>
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
            Track Record
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
            Numbers that speak for themselves
          </h2>
        </div>

        <div
          ref={chart.ref}
          style={{
            ...chart.style,
            position: 'relative',
            borderRadius: 24,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(16px)',
            padding: 32,
            marginBottom: 32,
            overflow: 'hidden',
          }}
        >
          <div className="flex items-start justify-between flex-wrap gap-4" style={{ marginBottom: 8 }}>
            <div>
              <div
                style={{
                  fontSize: 12,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  fontWeight: 600,
                }}
              >
                Community Equity Curve · Cumulative
              </div>
              <div className="flex items-baseline gap-3" style={{ marginTop: 6 }}>
                <span style={{ fontSize: 34, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
                  +312%
                </span>
                <span
                  className="inline-flex items-center gap-1"
                  style={{ fontSize: 13, fontWeight: 700, color: '#22c55e' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="18 15 12 9 6 15"></polyline>
                  </svg>
                  36 months
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 999,
                    fontSize: 12,
                    fontWeight: 600,
                    color: activeTab === tab ? '#22c55e' : 'rgba(255,255,255,0.5)',
                    background: activeTab === tab ? 'rgba(34,197,94,0.12)' : 'transparent',
                    border: activeTab === tab ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <svg viewBox="0 0 1000 300" preserveAspectRatio="none" style={{ width: '100%', height: 240, display: 'block' }}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(34,197,94,0.35)" />
                <stop offset="100%" stopColor="rgba(34,197,94,0)" />
              </linearGradient>
            </defs>
            <line x1="0" y1="75" x2="1000" y2="75" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="150" x2="1000" y2="150" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <line x1="0" y1="225" x2="1000" y2="225" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
            <path
              d="M0,260 L70,248 L140,255 L210,225 L280,235 L350,200 L420,210 L490,165 L560,180 L630,140 L700,150 L770,110 L840,120 L910,70 L1000,40 L1000,300 L0,300 Z"
              fill="url(#chartFill)"
              opacity={0.9}
            />
            <path
              ref={pathRef}
              d="M0,260 L70,248 L140,255 L210,225 L280,235 L350,200 L420,210 L490,165 L560,180 L630,140 L700,150 L770,110 L840,120 L910,70 L1000,40"
              fill="none"
              stroke="#22c55e"
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 2400,
                strokeDashoffset: 2400,
                filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.5))',
              }}
            />
          </svg>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {STATS.map((s, i) => (
            <StatPill key={s.label} to={s.to} suffix={s.suffix} label={s.label} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
