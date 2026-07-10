import { type ReactNode, useState, useEffect } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useCountUp } from '../../hooks/useCountUp';
import { useTilt } from '../../hooks/useTilt';
import { useAuth } from '../../contexts/AuthContext';
import { Edit2 } from 'lucide-react';
import api from '../../lib/api';
import SettingsModal from '../../components/admin/SettingsModal';

interface PlatformStat {
  key: string;
  color: string;
  icon: ReactNode;
  countTo: number;
  suffix: string;
  label: string;
  cta: string;
  delay: number;
}

function hexToRgba(hex: string, alpha: number) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}

function StatCard({ stat, link }: { stat: PlatformStat; link: string }) {
  const { ref: revealRef, style: revealStyle } = useReveal<HTMLAnchorElement>({ delay: stat.delay });
  const tiltRef = useTilt<HTMLAnchorElement>(4);
  const { ref: countRef, display } = useCountUp<HTMLSpanElement>(stat.countTo, { suffix: stat.suffix });
  const [hovered, setHovered] = useState(false);

  const setRefs = (el: HTMLAnchorElement | null) => {
    revealRef.current = el;
    tiltRef.current = el;
  };

  return (
    <a
      ref={setRefs}
      href={link}
      target="_blank"
      rel="noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col items-center text-center relative overflow-hidden group"
      style={{
        ...revealStyle,
        padding: '34px 20px',
        borderRadius: 22,
        background: '#0f1115',
        border: `1px solid ${hovered ? hexToRgba(stat.color, 0.5) : 'rgba(255,255,255,0.08)'}`,
        boxShadow: hovered 
          ? `0 10px 40px ${hexToRgba(stat.color, 0.2)}, inset 0 1px 0 rgba(255,255,255,0.05)`
          : '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
        transition: 'border-color .4s, box-shadow .4s, transform .5s cubic-bezier(.16,1,.3,1)',
        transform: hovered && revealStyle.opacity === 1 ? 'translateY(-8px) scale(1.02)' : revealStyle.transform,
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
      <span
        style={{
          width: 56,
          height: 56,
          borderRadius: 16,
          background: stat.key === 'instagram' && hovered 
            ? 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' 
            : stat.key === 'youtube' && hovered
            ? '#ff0000'
            : stat.key === 'telegram' && hovered
            ? '#2AABEE'
            : stat.key === 'x' && hovered
            ? '#fff'
            : hexToRgba(stat.color, 0.1),
          border: hovered ? 'none' : `1px solid ${hexToRgba(stat.color, 0.2)}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: hovered ? 'scale(1.2) translateY(-4px)' : 'scale(1)',
          boxShadow: hovered ? `0 15px 30px ${hexToRgba(stat.color, 0.4)}` : 'none',
          color: hovered && stat.key === 'x' ? '#000' : (hovered ? '#fff' : stat.color)
        }}
      >
        {stat.icon}
      </span>
      <span style={{ fontSize: 32, fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', zIndex: 1 }}>
        <span ref={countRef}>{display}</span>
      </span>
      <span
        style={{
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 600,
          marginTop: 6,
          zIndex: 1,
        }}
      >
        {stat.label}
      </span>
      <span
        style={{
          marginTop: 16,
          fontSize: 12,
          fontWeight: 700,
          color: stat.color,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          transition: 'transform 0.3s cubic-bezier(0.16,1,.3,1)',
          transform: hovered ? 'translateX(4px)' : 'translateX(0)',
          zIndex: 1,
        }}
      >
        {stat.cta}
      </span>
    </a>
  );
}

const STATS: PlatformStat[] = [
  {
    key: 'youtube',
    color: '#ff0000',
    countTo: 128,
    suffix: 'K',
    label: 'YouTube Subscribers',
    cta: 'Subscribe →',
    delay: 0,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  {
    key: 'instagram',
    color: '#E1306C',
    countTo: 86,
    suffix: 'K',
    label: 'Instagram Followers',
    cta: 'Follow →',
    delay: 80,
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
      </svg>
    ),
  },
  {
    key: 'x',
    color: '#e7e9ea',
    countTo: 42,
    suffix: 'K',
    label: 'X Followers',
    cta: 'Follow →',
    delay: 160,
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    key: 'telegram',
    color: '#2AABEE',
    countTo: 15,
    suffix: 'K',
    label: 'Telegram Members',
    cta: 'Join →',
    delay: 240,
    icon: (
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
];

export default function PlatformStats() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [settings, setSettings] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/settings');
      setSettings(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const statsWithData = STATS.map(stat => {
    let countTo = stat.countTo;
    let suffix = stat.suffix;
    let link = '#';

    if (settings) {
      let rawStats = '';
      if (stat.key === 'youtube') { rawStats = settings.youtubeStats; link = settings.youtubeLink; }
      if (stat.key === 'instagram') { rawStats = settings.instagramStats; link = settings.instagramLink; }
      if (stat.key === 'x') { rawStats = settings.xStats; link = settings.xLink; }
      if (stat.key === 'telegram') { rawStats = settings.telegramStats; link = settings.telegramLink; }

      const numMatch = rawStats?.match(/[\d.]+/);
      const suffixMatch = rawStats?.match(/[a-zA-Z]+/);
      
      if (numMatch) countTo = parseFloat(numMatch[0]);
      if (suffixMatch) suffix = suffixMatch[0];
    }

    return { ...stat, countTo, suffix, link };
  });

  return (
    <section className="relative px-5 py-24 mx-auto border-t" style={{ maxWidth: 1080, borderColor: 'rgba(255,255,255,0.06)' }}>
      {isAdmin && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-full transition-colors font-semibold text-sm"
          >
            <Edit2 size={14} />
            Edit Socials
          </button>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {statsWithData.map((stat) => (
          <StatCard key={stat.key} stat={stat} link={stat.link} />
        ))}
      </div>

      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchSettings}
      />
    </section>
  );
}
