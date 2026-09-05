import { useState, useEffect, type CSSProperties } from 'react';
import { ShieldCheck, Plus, Edit2, Trash2 } from 'lucide-react';
import { useReveal } from '../hooks/useReveal';
import { useParallax } from '../hooks/useParallax';
import FlagshipBot from '../sections/marketplace/FlagshipBot';
import BotCard from '../sections/marketplace/BotCard';
import BotModal, { type BotData } from '../components/admin/BotModal';
import { useAuth } from '../contexts/AuthContext';
import api from '../lib/api';
import { toast } from 'sonner';

const FILTERS = ['All', 'Crypto', 'Indian Market', 'Indices'] as const;

function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  const activeStyle: CSSProperties = {
    padding: '8px 18px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#22c55e',
    background: 'rgba(34,197,94,0.12)',
    border: '1px solid rgba(34,197,94,0.35)',
    cursor: 'pointer',
  };
  const inactiveStyle: CSSProperties = {
    padding: '8px 18px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: hovered ? '#fff' : 'rgba(255,255,255,0.5)',
    border: `1px solid ${hovered ? 'rgba(34,197,94,0.5)' : 'rgba(255,255,255,0.12)'}`,
    cursor: 'pointer',
    transition: 'border-color .3s, color .3s',
  };
  return (
    <span
      style={active ? activeStyle : inactiveStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {label}
    </span>
  );
}

export default function Marketplace() {
  const complianceReveal = useReveal<HTMLDivElement>({ y: 30 });
  const glowParallax = useParallax<HTMLDivElement>(0.24);
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [bots, setBots] = useState<BotData[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBot, setEditingBot] = useState<BotData | null>(null);

  const fetchBots = async () => {
    try {
      const res = await api.get('/bots');
      setBots(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load bots');
    }
  };

  useEffect(() => {
    fetchBots();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this bot?')) return;
    try {
      await api.delete(`/bots/${id}`);
      toast.success('Bot deleted');
      fetchBots();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete bot');
    }
  };

  const flagshipBot = bots.find(b => b.isFlagship);
  const regularBots = bots.filter(b => !b.isFlagship && (activeFilter === 'All' || b.tag.toLowerCase() === activeFilter.toLowerCase()));

  return (
    <div style={{ position: 'relative', width: '100%', background: '#0a0a0a', overflow: 'hidden' }}>
      {/* HERO */}
      <section className="px-[18px] md:px-10" style={{ position: 'relative', paddingTop: 150, paddingBottom: 70, overflow: 'hidden' }}>
        <div
          ref={glowParallax}
          style={{
            position: 'absolute',
            top: '-30%',
            left: '-8%',
            width: 900,
            height: 680,
            background: 'radial-gradient(ellipse,rgba(34,197,94,0.15),transparent 68%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'relative', maxWidth: 1200, margin: '0 auto' }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#22c55e',
              fontWeight: 600,
              marginBottom: 22,
              opacity: 0,
              animation: 'fadeSlideUp .8s ease forwards',
            }}
          >
            Verified Live Stats &middot; Updated Daily
          </div>
          <h1
            style={{
              fontSize: 'clamp(52px,6.4vw,96px)',
              fontWeight: 800,
              lineHeight: 1.0,
              letterSpacing: '-0.04em',
              color: '#fff',
              margin: '0 0 26px',
              opacity: 0,
              animation: 'fadeSlideUp .9s ease .1s forwards',
            }}
          >
            The Algo <em className="accent-italic" style={{ color: '#22c55e', letterSpacing: '-0.01em', fontStyle: 'italic' }}>Market</em>
          </h1>
          <div
            className="flex flex-wrap items-center justify-between"
            style={{ gap: 20, opacity: 0, animation: 'fadeSlideUp .9s ease .22s forwards' }}
          >
            <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(255,255,255,0.55)', maxWidth: 520, fontWeight: 300, margin: 0 }}>
              Battle-tested trading bots, every stat pulled from live accounts. No backtest-only
              fantasies &mdash; if it&apos;s listed, it&apos;s running money.
            </p>
            <div className="flex flex-wrap items-center" style={{ gap: 8 }}>
              {FILTERS.map((f) => (
                <FilterPill key={f} label={f} active={f === activeFilter} onClick={() => setActiveFilter(f)} />
              ))}
              {isAdmin && (
                <button
                  onClick={() => {
                    setEditingBot(null);
                    setIsModalOpen(true);
                  }}
                  className="ml-2 flex items-center justify-center w-10 h-10 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-full transition-colors"
                >
                  <Plus size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BOT */}
      {flagshipBot && (activeFilter === 'All' || flagshipBot.tag.toLowerCase() === activeFilter.toLowerCase()) && (
        <section className="px-[18px] md:px-10" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', paddingTop: 20, paddingBottom: 80 }}>
          <div className="relative group">
            {isAdmin && (
              <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingBot(flagshipBot);
                    setIsModalOpen(true);
                  }}
                  className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm border border-white/10"
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(flagshipBot._id!)}
                  className="p-2 bg-black/60 hover:bg-red-500/20 text-red-400 rounded-full backdrop-blur-sm border border-white/10"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            <FlagshipBot bot={flagshipBot} />
          </div>
        </section>
      )}

      {/* BOT GRID */}
      <section className="px-[18px] md:px-10" style={{ position: 'relative', maxWidth: 1200, margin: '0 auto', paddingBottom: 110 }}>
        <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
          {regularBots.map((bot, i) => (
            <div key={bot._id} className="relative group">
              {isAdmin && (
                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => {
                      setEditingBot(bot);
                      setIsModalOpen(true);
                    }}
                    className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm border border-white/10"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(bot._id!)}
                    className="p-2 bg-black/60 hover:bg-red-500/20 text-red-400 rounded-full backdrop-blur-sm border border-white/10"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}
              <BotCard bot={bot} delay={i * 90} />
            </div>
          ))}
        </div>

        {bots.length === 0 && (
          <div className="text-center py-20">
            <p className="text-white/40 text-lg">No trading bots available yet.</p>
          </div>
        )}

        <div
          ref={complianceReveal.ref}
          style={{
            ...complianceReveal.style,
            marginTop: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            padding: 22,
            borderRadius: 18,
            border: '1px solid rgba(255,255,255,0.08)',
            background: 'rgba(255,255,255,0.02)',
            textAlign: 'center',
          }}
          className="flex-col sm:flex-row"
        >
          <ShieldCheck size={18} color="#22c55e" strokeWidth={2} />
          <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 300 }}>
            Every bot links to a verified live account. Past performance never guarantees future
            results &mdash; trade responsibly.
          </span>
        </div>
      </section>

      <BotModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBot(null);
        }}
        bot={editingBot}
        onSaved={fetchBots}
      />
    </div>
  );
}
