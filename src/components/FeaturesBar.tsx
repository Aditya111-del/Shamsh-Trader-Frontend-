import { Target, TrendingUp, Shield, Trophy, Info, Zap, Calendar, BookOpen, ShoppingBag, GraduationCap, Activity } from 'lucide-react';
import { navigationConfig } from '../config';
import { useNavigate, useLocation } from 'react-router-dom';

const features = [
  { icon: Target,     title: 'FOCUS',       subtitle: 'Clear Mindset' },
  { icon: TrendingUp, title: 'STRATEGY',    subtitle: 'Proven Systems' },
  { icon: Shield,     title: 'RISK',        subtitle: 'Capital Protection' },
  { icon: Trophy,     title: 'CONSISTENCY', subtitle: 'Long-term Success' },
];

const getNavDetails = (label: string) => {
  switch (label) {
    case 'About': return { icon: Info, subtitle: 'Platform' };
    case 'Genie AI': return { icon: Zap, subtitle: 'Assistant' };
    case 'Events': return { icon: Calendar, subtitle: 'Live' };
    case 'Journal': return { icon: BookOpen, subtitle: 'Blog' };
    case 'Market': return { icon: ShoppingBag, subtitle: 'Store' };
    case 'Academy': return { icon: GraduationCap, subtitle: 'Learn' };
    case 'Feed': return { icon: Activity, subtitle: 'Social' };
    default: return { icon: Target, subtitle: 'Link' };
  }
};

export default function FeaturesBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const goToLink = (href: string) => {
    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/${href}`);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <>
      {/* Desktop View: Original Features */}
      <div className="hidden sm:grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
        {features.map((feature, idx) => (
          <div
            key={`desktop-${idx}`}
            className="premium-glass relative overflow-hidden rounded-2xl p-5 flex items-center gap-4 group cursor-pointer hover-lift border border-[#22c55e]/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:border-[#22c55e]/70 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300"
            style={{
              animation: `fadeSlideUp 0.6s ease forwards ${0.8 + idx * 0.1}s`,
              opacity: 0,
            }}
          >
            {/* Subtle Hover Glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(34,197,94,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            <div className="relative z-10 w-12 h-12 rounded-xl flex items-center justify-center bg-black/50 border border-white/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]">
              <feature.icon size={20} className="text-[#22c55e] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
              <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_15px_rgba(34,197,94,0.15)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>

            <div className="relative z-10 flex flex-col">
              <span className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-semibold mb-1">
                {feature.subtitle}
              </span>
              <span className="text-white font-bold tracking-wide text-[13px] group-hover:text-[#22c55e] transition-colors duration-300">
                {feature.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile View: Navigation Links as Quick Action Buttons (Same Aesthetic) */}
      <div className="grid sm:hidden w-full grid-cols-2 gap-3">
        {navigationConfig.links.map((link, idx) => {
          const { icon: Icon, subtitle } = getNavDetails(link.label);
          // If there's an odd number of items, make the last one span both columns
          const isLastAndOdd = idx === navigationConfig.links.length - 1 && navigationConfig.links.length % 2 !== 0;
          
          return (
            <div
              key={`mobile-${idx}`}
              onClick={() => goToLink(link.href)}
              className={`premium-glass relative overflow-hidden rounded-2xl group cursor-pointer hover-lift border border-[#22c55e]/30 shadow-[0_0_15px_rgba(34,197,94,0.15)] hover:border-[#22c55e]/70 hover:shadow-[0_0_25px_rgba(34,197,94,0.4)] transition-all duration-300 active:scale-95 flex ${
                isLastAndOdd ? 'col-span-2 flex-row items-center justify-center p-4 gap-4' : 'col-span-1 flex-col items-center text-center p-4 gap-3'
              }`}
              style={{
                animation: `fadeSlideUp 0.6s ease forwards ${0.2 + idx * 0.1}s`,
                opacity: 0,
              }}
            >
              {/* Subtle Hover Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(34,197,94,0.05)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className={`relative z-10 rounded-xl flex items-center justify-center bg-black/50 border border-white/5 shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)] ${
                isLastAndOdd ? 'w-12 h-12' : 'w-10 h-10'
              }`}>
                <Icon size={isLastAndOdd ? 20 : 18} className="text-[#22c55e] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                <div className="absolute inset-0 rounded-xl shadow-[inset_0_0_15px_rgba(34,197,94,0.15)] pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="relative z-10 flex flex-col">
                <span className={`text-gray-500 uppercase font-semibold mb-1 ${
                  isLastAndOdd ? 'text-[10px] tracking-[0.2em]' : 'text-[9px] tracking-[0.15em]'
                }`}>
                  {subtitle}
                </span>
                <span className={`text-white font-bold tracking-wide group-hover:text-[#22c55e] transition-colors duration-300 ${
                  isLastAndOdd ? 'text-[13px]' : 'text-[12px]'
                }`}>
                  {link.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
