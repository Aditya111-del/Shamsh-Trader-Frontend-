import { useState, type CSSProperties } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useDrawPath } from '../../hooks/useDrawPath';
import { useTilt } from '../../hooks/useTilt';
import { type BotData } from '../../components/admin/BotModal';

interface BotCardProps {
  bot: BotData;
  delay?: number;
}

export default function BotCard({ bot, delay = 0 }: BotCardProps) {
  const { ref: revealRef, style: revealStyle } = useReveal<HTMLDivElement>({ delay, y: 40 });
  const tiltRef = useTilt<HTMLDivElement>(3);
  const pathRef = useDrawPath(1.6);
  const [hovered, setHovered] = useState(false);
  const [deployHover, setDeployHover] = useState(false);

  // Merge reveal + tilt refs onto the same node.
  const setRefs = (el: HTMLDivElement | null) => {
    revealRef.current = el;
    tiltRef.current = el;
  };

  const cardStyle: CSSProperties = {
    ...revealStyle,
    display: 'flex',
    flexDirection: 'column',
    padding: 30,
    borderRadius: 22,
    border: `1px solid ${hovered ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    transitionProperty: 'border-color, opacity, transform, filter',
  };

  return (
    <div
      ref={setRefs}
      style={cardStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="flex items-center justify-between" style={{ marginBottom: 18 }}>
        <span style={{ fontSize: 18, fontWeight: 800, color: '#fff', letterSpacing: '-0.01em' }}>
          {bot.name}
        </span>
        <span
          style={{
            padding: '5px 12px',
            borderRadius: 999,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: bot.tagColor,
            background: `${bot.tagColor}1a`,
            border: `1px solid ${bot.tagColor}4d`,
          }}
        >
          {bot.tag}
        </span>
      </div>

      <svg viewBox="0 0 240 60" preserveAspectRatio="none" style={{ width: '100%', height: 60, marginBottom: 20, display: 'block' }}>
        <path
          ref={pathRef}
          d={bot.sparkline}
          fill="none"
          stroke="#22c55e"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ filter: 'drop-shadow(0 0 4px rgba(34,197,94,0.5))' }}
        />
      </svg>

      <div className="flex justify-between" style={{ marginBottom: 22 }}>
        <span className="flex flex-col">
          <span style={{ fontSize: 16, fontWeight: 800, color: '#22c55e' }}>{bot.monthly}</span>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
            Monthly
          </span>
        </span>
        <span className="flex flex-col">
          <span style={{ fontSize: 16, fontWeight: 800, color: '#fff' }}>{bot.winRate}</span>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
            Win rate
          </span>
        </span>
        <span className="flex flex-col">
          <span style={{ fontSize: 16, fontWeight: 800, color: '#ef4444' }}>{bot.maxDD}</span>
          <span style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>
            Max DD
          </span>
        </span>
      </div>

      <div className="flex items-center justify-between" style={{ marginTop: 'auto' }}>
        <span style={{ fontSize: 19, fontWeight: 800, color: '#fff' }}>
          {bot.price}
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>/mo</span>
        </span>
        <a
          href={bot.fileUrl}
          target="_blank"
          rel="noreferrer"
          onMouseEnter={() => setDeployHover(true)}
          onMouseLeave={() => setDeployHover(false)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            padding: '10px 20px',
            borderRadius: 999,
            border: '1px solid rgba(34,197,94,0.45)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 700,
            background: deployHover ? 'rgba(34,197,94,0.12)' : 'transparent',
            transition: 'background .3s',
          }}
        >
          Deploy
        </a>
      </div>
    </div>
  );
}
