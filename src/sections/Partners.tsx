import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { useAuth } from '../contexts/AuthContext';
import { Edit2 } from 'lucide-react';
import api from '../lib/api';
import SettingsModal from '../components/admin/SettingsModal';

const DEFAULT_BRANDS = [
  'Delta exchange',
  'Mudrex',
  'FYERS',
  'COINDCX',
  'COINSWITCH',
  'SPIDER',
  'SUNCRYPTO',
  'SAHI',
  'FIRST DEMAT 5 PAISA',
];

export default function Partners() {
  const { ref, style } = useReveal();
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

  const brands = settings?.marqueeBrands
    ? settings.marqueeBrands.split(',').map((b: string) => b.trim()).filter((b: string) => b.length > 0)
    : DEFAULT_BRANDS;

  return (
    <section
      className="relative"
      style={{
        padding: '44px 0',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: '#0a0a0a',
      }}
    >
      {isAdmin && (
        <div className="absolute top-1/2 -translate-y-1/2 right-6 z-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-full transition-colors font-semibold text-xs"
          >
            <Edit2 size={12} />
            Edit Marquee
          </button>
        </div>
      )}
      <p
        ref={ref}
        style={{
          ...style,
          textAlign: 'center',
          fontSize: 13,
          letterSpacing: '0.35em',
          textTransform: 'uppercase',
          color: '#22c55e',
          margin: '0 0 28px',
          fontWeight: 800,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
      >
        Trading the world's markets across
      </p>
      <div
        className="relative w-full overflow-hidden"
        style={{
          WebkitMaskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)',
          maskImage: 'linear-gradient(90deg,transparent,black 12%,black 88%,transparent)',
        }}
      >
        <div
          className="inline-flex items-center whitespace-nowrap"
          style={{
            gap: 72,
            animation: 'marqueeScroll 32s linear infinite',
            paddingRight: 72,
          }}
        >
          {[...brands, ...brands].map((brand, i) => (
            <span
              key={`${brand}-${i}`}
              style={{
                fontSize: 22,
                fontWeight: 700,
                letterSpacing: '0.05em',
                color: 'rgba(255,255,255,0.75)',
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              }}
            >
              {brand}
            </span>
          ))}
        </div>
      </div>

      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchSettings}
      />
    </section>
  );
}
