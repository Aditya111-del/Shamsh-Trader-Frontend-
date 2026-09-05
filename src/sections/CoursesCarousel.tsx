import { useState, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { CoverFlowCarousel } from '../components/ui/CoverFlowCarousel';
import { Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReveal } from '../hooks/useReveal';

interface Tier {
  name: string;
  price: string;
  period?: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Indian Stock Market Foundations',
    price: '₹3,999',
    period: 'One-Time',
    description: 'Complete foundations of Indian Equities, Nifty/Bank Nifty setups, and price action principles.',
    features: [
      'NSE Equities & Index Price Action Blueprint',
      'Nifty 50 & Bank Nifty Opening Range Setups',
      'Option Buying & Selling Risk Protocols',
      'Community Discord & Daily Market Briefings',
    ],
    cta: 'Enroll Now',
  },
  {
    name: 'Crypto Futures & Orderflow Mastery',
    price: '₹5,999',
    period: 'One-Time',
    description: 'Master high-probability crypto trades, funding rate exploitation, and advanced liquidation mapping.',
    features: [
      'Delta Exchange & Binance Orderflow Setups',
      'Liquidation Heatmaps & Cumulative Volume Delta (CVD)',
      'BTC & Altcoin High-Beta Breakout Systems',
      'Weekly Live Trading Room & Desk Alerts',
    ],
    cta: 'Enroll Now',
    featured: true,
  },
  {
    name: 'Elite Indian & Crypto Mentorship',
    price: '₹8,999',
    period: 'Full Access',
    description: 'The definitive institutional trading program covering both Indian F&O and high-volatility Crypto markets.',
    features: [
      'Both Indian Stock Market & Crypto Curriculums',
      'Flagship Master Swing Trade Strategy Logic',
      'Proprietary Strategy Pine Scripts & Backtest Models',
      'Direct Desk Mentorship with Shamsh & 1:1 Reviews',
    ],
    cta: 'Join Mentorship',
  },
];

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col relative w-full h-full p-6 sm:p-8 rounded-[24px] backdrop-blur-md transition-all duration-300 ${
        tier.featured
          ? 'border border-[#22c55e]/60 bg-gradient-to-b from-[#18181b] to-[#09090b]'
          : 'border border-white/10 hover:border-white/20 bg-gradient-to-b from-[#161618] to-[#09090b]'
      }`}
      style={{
        minHeight: 510,
        boxShadow: tier.featured
          ? hovered
            ? '0 0 60px rgba(34,197,94,0.32)'
            : '0 0 35px rgba(34,197,94,0.18), inset 0 1px 0 rgba(255,255,255,0.06)'
          : hovered
          ? '0 0 30px rgba(255,255,255,0.08), inset 0 1px 0 rgba(255,255,255,0.05)'
          : '0 0 15px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
      }}
    >
      {tier.featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase text-black bg-gradient-to-r from-[#84cc16] to-[#22c55e] shadow-[0_0_20px_rgba(34,197,94,0.5)] z-10 whitespace-nowrap">
          Most Popular
        </div>
      )}

      <div
        className={`text-xs tracking-widest uppercase font-semibold mb-2 ${
          tier.featured ? 'text-[#22c55e]' : 'text-zinc-400'
        }`}
      >
        {tier.name}
      </div>

      <div className="flex items-baseline gap-1.5 my-3">
        <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
          {tier.price}
        </span>
        {tier.period && (
          <span className="text-sm text-zinc-400 ml-1">/{tier.period}</span>
        )}
      </div>

      <p className="text-sm text-zinc-400 font-light leading-relaxed mb-6">
        {tier.description}
      </p>

      <div className="flex flex-col gap-3.5 mb-8">
        {tier.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <CheckIcon />
            <span className={`text-sm ${tier.featured ? 'text-zinc-200' : 'text-zinc-300'}`}>
              {f}
            </span>
          </div>
        ))}
      </div>

      <Link
        to="/courses"
        className={`mt-auto text-center py-3.5 px-4 rounded-xl font-semibold text-sm transition-all duration-200 block ${
          tier.featured
            ? 'bg-gradient-to-r from-[#84cc16] to-[#22c55e] text-black font-bold shadow-[0_0_24px_rgba(34,197,94,0.35)] hover:shadow-[0_0_35px_rgba(34,197,94,0.55)] hover:brightness-105'
            : 'bg-white/[0.07] hover:bg-white/[0.14] text-white border border-white/10 hover:border-white/20'
        }`}
      >
        {tier.cta}
      </Link>
    </div>
  );
}

export default function CoursesCarousel() {
  const { isAdmin } = useAuth();
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const sub = useReveal({ delay: 140 });
  const link = useReveal({ delay: 200 });

  return (
    <section id="programs" className="relative mx-auto overflow-visible" style={{ maxWidth: 1240, paddingTop: 100, paddingBottom: 100 }}>
      <div className="text-center relative px-5 sm:px-10" style={{ marginBottom: 30 }}>
        {isAdmin && (
          <a
            href="#"
            className="absolute inline-flex items-center gap-1.5 hover:border-[#22c55e]/60 transition-colors"
            style={{
              top: 0,
              right: 0,
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.14)',
            }}
          >
            <Settings className="w-3 h-3" /> Manage Programs
          </a>
        )}
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
          Programs
        </div>
        <h2
          ref={heading.ref}
          style={{
            ...heading.style,
            fontSize: 'clamp(34px, 3.8vw, 54px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            margin: '0 0 16px',
            color: '#fff',
          }}
        >
          Choose how you want to grow
        </h2>
        <p
          ref={sub.ref}
          className="mx-auto"
          style={{
            ...sub.style,
            fontSize: 16,
            color: 'rgba(255,255,255,0.55)',
            margin: '0 auto 18px',
            maxWidth: 520,
            fontWeight: 300,
          }}
        >
          From your first trade in Nifty & Crypto to one-on-one mentorship. Every path is built on the same disciplined
          framework.
        </p>
        <Link
          ref={link.ref as unknown as Ref<HTMLAnchorElement>}
          to="/courses"
          className="inline-flex items-center gap-2"
          style={{
            ...link.style,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#22c55e',
          }}
        >
          Browse the full Academy
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>
      <div className="w-full mt-6">
        <CoverFlowCarousel
          initialIndex={1}
          mobileItemWidth={300}
          desktopItemWidth={375}
          mobileHeight={550}
          desktopHeight={560}
          mobileSpacing={40}
          desktopSpacing={175}
        >
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} />
          ))}
        </CoverFlowCarousel>
      </div>
    </section>
  );
}
