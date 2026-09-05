import { useState, type CSSProperties } from 'react';
import { ArrowRight } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { useDrawPath } from '../../hooks/useDrawPath';
import { useTilt } from '../../hooks/useTilt';
import { useCountUp } from '../../hooks/useCountUp';
import { useMagnetic } from '../../hooks/useMagnetic';
import { type BotData } from '../../components/admin/BotModal';
import ActionNoticeModal from '../../components/ui/ActionNoticeModal';

export default function FlagshipBot({ bot }: { bot?: BotData }) {
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const { ref: revealRef, style: revealStyle } = useReveal<HTMLDivElement>({ y: 40, duration: 1 });
  const tiltRef = useTilt<HTMLDivElement>(2);
  const pathRef = useDrawPath(2.2);
  const magnetRef = useMagnetic<HTMLButtonElement>(14);
  
  // Extract numeric part from monthly string, e.g. "+9.4%" -> 9.4
  const monthlyNum = bot?.monthly ? parseFloat(bot.monthly.replace(/[^0-9.-]+/g,"")) : 0;
  const winRateNum = bot?.winRate ? parseFloat(bot.winRate.replace(/[^0-9.-]+/g,"")) : 0;

  const avgMonthly = useCountUp(monthlyNum, { decimals: 1, prefix: '+', suffix: '%' });
  const winRate = useCountUp(winRateNum, { suffix: '%' });

  if (!bot) return null;

  const setRefs = (el: HTMLDivElement | null) => {
    revealRef.current = el;
    tiltRef.current = el;
  };

  const cardStyle: CSSProperties = {
    ...revealStyle,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 26,
    border: '1px solid rgba(34,197,94,0.4)',
    background: 'linear-gradient(150deg,rgba(34,197,94,0.09),rgba(255,255,255,0.03) 50%)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 0 60px rgba(34,197,94,0.12)',
    display: 'grid',
    transitionProperty: 'opacity, transform, filter',
  };

  return (
    <div ref={setRefs} style={cardStyle} className="grid-cols-1 md:grid-cols-[1fr_1.2fr]">
      <div className="flex flex-col" style={{ padding: 44 }}>
        <div className="flex items-center flex-wrap" style={{ gap: 10, marginBottom: 24 }}>
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              background: 'linear-gradient(90deg,#84cc16,#22c55e)',
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#000',
            }}
          >
            Flagship
          </span>
          <span
            className="inline-flex items-center"
            style={{
              gap: 7,
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(34,197,94,0.12)',
              border: '1px solid rgba(34,197,94,0.35)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#22c55e',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: 999,
                background: '#22c55e',
                animation: 'onlinePulse 2s infinite',
              }}
            />
            Live &middot; Active
          </span>
        </div>

        <h2
          style={{
            fontSize: 'clamp(30px,3.2vw,44px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#fff',
            margin: '0 0 14px',
          }}
        >
          {bot.name}
        </h2>
        <p
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.6)',
            margin: '0 0 30px',
            fontWeight: 300,
            maxWidth: 400,
          }}
        >
          {bot.description || 'Premium flagship bot with verified live trading history.'}
        </p>

        <div className="grid grid-cols-3" style={{ gap: 14, marginBottom: 34 }}>
          <div style={{ padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#22c55e' }}>
              <span ref={avgMonthly.ref}>{avgMonthly.display}</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 4 }}>
              Avg Monthly
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>
              <span ref={winRate.ref}>{winRate.display}</span>
            </div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 4 }}>
              Win Rate
            </div>
          </div>
          <div style={{ padding: 16, borderRadius: 14, background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: '#ef4444' }}>{bot.maxDD}</div>
            <div style={{ fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600, marginTop: 4 }}>
              Max Drawdown
            </div>
          </div>
        </div>

        <div className="flex items-center flex-wrap" style={{ marginTop: 'auto', gap: 20 }}>
          <button
            ref={magnetRef}
            onClick={() => setIsNoticeOpen(true)}
            className="cursor-pointer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'linear-gradient(90deg,#84cc16,#22c55e)',
              color: '#000',
              padding: '14px 28px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 0 30px rgba(34,197,94,0.3)',
            }}
          >
            Deploy {bot.name.split(' ')[0]} <ArrowRight size={15} strokeWidth={3} color="#000" />
          </button>
          <span className="flex flex-col">
            <span style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
              {bot.price}<span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/mo</span>
            </span>
          </span>
        </div>
      </div>

      <ActionNoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        title="Deploy Flagship Bot Coming Soon"
        type="coming-soon"
        itemName={bot.name}
        subtitle="Broker execution integration and automated high-frequency order routing are in final phase testing. Join the waiting list to get early alpha access."
      />

      <div className="relative flex flex-col" style={{ padding: '0 44px 44px' }}>
        <div className="flex justify-between items-baseline" style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 12, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
            Live equity &middot; verified
          </span>
          <span style={{ fontSize: 28, fontWeight: 800, color: '#22c55e', letterSpacing: '-0.02em' }}>{bot.totalEquity || '+0%'}</span>
        </div>
        <svg viewBox="0 0 800 320" preserveAspectRatio="none" style={{ width: '100%', flex: 1, minHeight: 260, display: 'block' }}>
          <defs>
            <linearGradient id="botFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(34,197,94,0.3)" />
              <stop offset="100%" stopColor="rgba(34,197,94,0)" />
            </linearGradient>
          </defs>
          <line x1="0" y1="80" x2="800" y2="80" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <line x1="0" y1="160" x2="800" y2="160" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <line x1="0" y1="240" x2="800" y2="240" stroke="rgba(255,255,255,0.05)" strokeWidth={1} />
          <path
            d={bot.sparkline ? `${bot.sparkline} L800,320 L0,320 Z` : "M0,290 L60,280 L120,284 L180,258 L240,266 L300,232 L360,242 L420,196 L480,210 L540,158 L600,170 L660,110 L720,126 L800,58 L800,320 L0,320 Z"}
            fill="url(#botFill)"
          />
          <path
            ref={pathRef}
            d={bot.sparkline || "M0,290 L60,280 L120,284 L180,258 L240,266 L300,232 L360,242 L420,196 L480,210 L540,158 L600,170 L660,110 L720,126 L800,58"}
            fill="none"
            stroke="#22c55e"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ filter: 'drop-shadow(0 0 6px rgba(34,197,94,0.5))' }}
          />
        </svg>
      </div>
    </div>
  );
}
