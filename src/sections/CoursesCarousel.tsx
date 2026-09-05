import { useState, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { CoverFlowCarousel } from '../components/ui/CoverFlowCarousel';
import { Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReveal } from '../hooks/useReveal';

interface Tier {
  name: string;
  price: string;
  description: string;
  features: string[];
  cta: string;
  featured?: boolean;
}

const TIERS: Tier[] = [
  {
    name: 'Starter',
    price: '$49',
    description: 'Self-paced foundations for the new trader finding their feet.',
    features: ['Core video curriculum', 'Community Discord access', 'Weekly market recap'],
    cta: 'Get Started',
  },
  {
    name: 'Pro Trader',
    price: '$149',
    description: 'The complete system for serious traders ready to go full-time.',
    features: [
      'Everything in Starter',
      'Live daily trading room',
      'Real-time trade breakdowns',
      'Indian Market F&O & Crypto playbooks',
    ],
    cta: 'Join Pro Trader',
    featured: true,
  },
  {
    name: 'Elite Mentorship',
    price: '$599',
    description: 'One-on-one coaching with a fully personalised trading plan.',
    features: ['Everything in Pro Trader', 'Weekly 1:1 with Shamsh', 'Personal risk review'],
    cta: 'Apply Now',
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
      style={{ flexShrink: 0, marginTop: 1 }}
    >
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  );
}

function TierCard({ tier, delay }: { tier: Tier; delay: number }) {
  const reveal = useReveal<HTMLDivElement>({ delay, y: 40 });
  const [hovered, setHovered] = useState(false);

  const baseStyle = tier.featured
    ? {
        border: '1px solid rgba(34,197,94,0.5)',
        background: 'linear-gradient(145deg, #18181b, #09090b)',
        boxShadow: hovered ? '0 0 60px rgba(34,197,94,0.28)' : '0 0 15px rgba(34,197,94,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
      }
    : {
        border: hovered ? '1px solid rgba(255,255,255,0.16)' : '1px solid rgba(255,255,255,0.08)',
        background: 'linear-gradient(145deg, #18181b, #09090b)',
        boxShadow: '0 0 15px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
      };

  return (
    <div
      ref={reveal.ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex flex-col relative shrink-0 snap-center w-full p-6 md:p-9"
      style={{
        ...reveal.style,
        minHeight: 460,
        height: '100%',
        borderRadius: 24,
        backdropFilter: 'blur(12px)',
        transition: 'transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s, opacity .9s',
        transform: hovered ? (tier.featured ? 'translateY(-8px)' : 'translateY(-6px)') : reveal.style.transform,
        ...baseStyle,
      }}
    >
      {tier.featured && (
        <div
          style={{
            position: 'absolute',
            top: -13,
            left: '50%',
            transform: 'translateX(-50%)',
            padding: '5px 16px',
            borderRadius: 999,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#000',
            background: 'linear-gradient(90deg,#84cc16,#22c55e)',
            boxShadow: '0 0 20px rgba(34,197,94,0.5)',
          }}
        >
          Most Popular
        </div>
      )}
      <div
        style={{
          fontSize: 13,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: tier.featured ? '#22c55e' : 'rgba(255,255,255,0.5)',
          fontWeight: 600,
        }}
      >
        {tier.name}
      </div>
      <div className="flex items-baseline gap-1.5" style={{ margin: '18px 0 6px' }}>
        <span style={{ fontSize: 44, fontWeight: 800, color: '#fff', letterSpacing: '-0.03em' }}>{tier.price}</span>
        <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)' }}>/month</span>
      </div>
      <p
        style={{
          fontSize: 14,
          color: tier.featured ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.5)',
          margin: '0 0 26px',
          fontWeight: 300,
        }}
      >
        {tier.description}
      </p>
      <div className="flex flex-col gap-3.5" style={{ marginBottom: 32 }}>
        {tier.features.map((f) => (
          <div key={f} className="flex items-start gap-2.5">
            <CheckIcon />
            <span style={{ fontSize: 14, color: tier.featured ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.72)' }}>
              {f}
            </span>
          </div>
        ))}
      </div>
      <a
        href="#contact"
        style={{
          marginTop: 'auto',
          textAlign: 'center',
          padding: 14,
          borderRadius: 12,
          fontWeight: tier.featured ? 700 : 600,
          fontSize: 14,
          color: tier.featured ? '#000' : '#fff',
          background: tier.featured ? 'linear-gradient(90deg,#84cc16,#22c55e)' : hovered ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)',
          border: tier.featured ? 'none' : '1px solid rgba(255,255,255,0.12)',
          boxShadow: tier.featured ? '0 0 24px rgba(34,197,94,0.35)' : 'none',
          transition: 'background .25s, transform .2s',
          transform: tier.featured && hovered ? 'translateY(-2px)' : 'none',
        }}
      >
        {tier.cta}
      </a>
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
    <section id="programs" className="relative mx-auto" style={{ maxWidth: 1200, paddingTop: 120, paddingBottom: 120 }}>
      <div className="text-center relative px-5 sm:px-10" style={{ marginBottom: 60 }}>
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
        <CoverFlowCarousel mobileHeight={380} desktopHeight={500} mobileItemWidth={290} desktopItemWidth={350}>
          {TIERS.map((tier) => (
            <TierCard key={tier.name} tier={tier} delay={0} />
          ))}
        </CoverFlowCarousel>
      </div>
    </section>
  );
}
