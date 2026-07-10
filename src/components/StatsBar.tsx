import { Users, ShieldCheck, Clock } from 'lucide-react';

const stats = [
  { icon: Users,       value: '10K+', label: 'Traders' },
  { icon: ShieldCheck, value: '95%+', label: 'Success Rate' },
  { icon: Clock,       value: '5+',   label: 'Years Experience' },
];

export default function StatsBar() {
  return (
    <div
      className="w-full flex items-center justify-between premium-glass rounded-2xl px-6 py-5 overflow-hidden relative"
      style={{
        animation: 'fadeSlideUp 0.8s ease forwards 1.2s',
        opacity: 0,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(34,197,94,0.03)] to-transparent pointer-events-none" />

      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="flex items-center gap-4 flex-1 justify-center relative group cursor-pointer">
            {index !== 0 && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-10 w-[1px] bg-white/10" />
            )}
            <div className="relative z-10 w-10 h-10 rounded-full flex items-center justify-center bg-black/40 border border-white/5 group-hover:border-[#22c55e]/30 transition-colors duration-300">
              <Icon size={18} className="text-[#22c55e] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-bold text-lg sm:text-xl leading-tight group-hover:text-[#22c55e] transition-colors duration-300">
                {stat.value}
              </span>
              <span className="text-gray-400 text-[10px] sm:text-xs font-medium uppercase tracking-widest leading-tight">
                {stat.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
