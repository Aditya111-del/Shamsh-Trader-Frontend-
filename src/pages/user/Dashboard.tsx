import { useAuth } from '../../contexts/AuthContext';
import BotCard from '../../sections/marketplace/BotCard';
import { Mail, ShieldCheck, Download, Settings, LogOut } from 'lucide-react';
import { useReveal } from '../../hooks/useReveal';
import { useNavigate } from 'react-router-dom';

const MOCK_DOWNLOADED_BOTS: any[] = [
  {
    name: 'Range Hunter',
    tag: 'Crypto',
    tagColor: '#eab308',
    sparkline: 'M0,50 L26,44 L52,48 L78,36 L104,40 L130,26 L156,32 L182,18 L208,24 L240,8',
    monthly: '+6.1%',
    winRate: '74%',
    maxDD: '−4.8%',
    price: 'Purchased',
  },
  {
    name: 'Momentum One',
    tag: 'Indices',
    tagColor: '#60a5fa',
    sparkline: 'M0,52 L26,48 L52,40 L78,44 L104,30 L130,36 L156,22 L182,28 L208,14 L240,10',
    monthly: '+7.8%',
    winRate: '61%',
    maxDD: '−8.9%',
    price: 'Purchased',
  },
];

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const revealProfile = useReveal<HTMLDivElement>({ y: 30, delay: 0 });
  const revealBots = useReveal<HTMLDivElement>({ y: 30, delay: 100 });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen pt-32 pb-24 relative overflow-hidden">
      {/* Background Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '10%',
          width: 800,
          height: 600,
          background: 'radial-gradient(ellipse,rgba(34,197,94,0.08),transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
        }}
      />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight">
          System <span className="text-green-500 italic">Terminal</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2.5fr] gap-10">
          {/* PROFILE SIDEBAR */}
          <div
            ref={revealProfile.ref}
            style={{
              ...revealProfile.style,
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: 32,
              backdropFilter: 'blur(16px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 24,
              height: 'fit-content'
            }}
          >
            <div className="flex items-center gap-4 border-b border-white/10 pb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-green-500 to-green-300 flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                <span className="text-2xl font-bold text-black uppercase">
                  {user?.name?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{user?.name || 'Trader'}</h2>
                <div className="text-xs text-green-500 font-semibold tracking-widest uppercase mt-1">
                  {user?.role || 'User'}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 text-zinc-400">
                <Mail size={16} />
                <span className="text-sm">{user?.email || 'email@example.com'}</span>
              </div>
              <div className="flex items-center gap-3 text-zinc-400">
                <ShieldCheck size={16} />
                <span className="text-sm">Account Verified</span>
              </div>
            </div>

            <div className="mt-4 pt-6 border-t border-white/10 flex flex-col gap-3">
              <button className="flex items-center gap-3 text-sm font-medium text-white/70 hover:text-white transition-colors py-2 px-3 rounded-lg hover:bg-white/5">
                <Settings size={16} /> Account Settings
              </button>
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 text-sm font-medium text-red-500/70 hover:text-red-500 transition-colors py-2 px-3 rounded-lg hover:bg-red-500/10"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col gap-10">
            {/* DOWNLOADED BOTS */}
            <div ref={revealBots.ref} style={revealBots.style}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Download className="text-green-500" /> Active Deployments
                </h3>
                <span className="text-sm text-zinc-500">{MOCK_DOWNLOADED_BOTS.length} Bots Running</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_DOWNLOADED_BOTS.map((bot, i) => (
                  <BotCard key={bot.name} bot={bot} delay={i * 100} />
                ))}
              </div>

              {MOCK_DOWNLOADED_BOTS.length === 0 && (
                <div className="w-full p-10 rounded-2xl border border-dashed border-white/10 text-center flex flex-col items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                    <Download size={20} className="text-white/30" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">No bots deployed</h4>
                    <p className="text-sm text-zinc-500">Visit the marketplace to discover your next edge.</p>
                  </div>
                  <button onClick={() => navigate('/marketplace')} className="mt-2 px-6 py-2 rounded-full bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors border border-white/10">
                    Browse Marketplace
                  </button>
                </div>
              )}
            </div>

            {/* UPCOMING SUBSCRIPTIONS / SYSTEM STATUS (Mocked) */}
            <div className="p-8 rounded-3xl border border-white/5 bg-white/[0.01]">
               <h3 className="text-xl font-bold text-white mb-4">System Status</h3>
               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                   <div className="text-zinc-500 text-xs tracking-widest uppercase mb-1">API Latency</div>
                   <div className="text-green-500 font-mono text-xl">12ms</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                   <div className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Active Trades</div>
                   <div className="text-white font-mono text-xl">4</div>
                 </div>
                 <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                   <div className="text-zinc-500 text-xs tracking-widest uppercase mb-1">Uptime</div>
                   <div className="text-white font-mono text-xl">99.99%</div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
