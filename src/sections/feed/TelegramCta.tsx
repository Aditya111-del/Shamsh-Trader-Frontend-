import { useState, useEffect } from 'react';
import { useParallax } from '../../hooks/useParallax';
import { useReveal } from '../../hooks/useReveal';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useAuth } from '../../contexts/AuthContext';
import { Edit2 } from 'lucide-react';
import api from '../../lib/api';
import SettingsModal from '../../components/admin/SettingsModal';

export default function TelegramCta() {
  const glowRef = useParallax<HTMLDivElement>(0.2);
  const { ref: headingRef, style: headingStyle } = useReveal<HTMLHeadingElement>();
  const { ref: bodyRef, style: bodyStyle } = useReveal<HTMLParagraphElement>({ delay: 100 });
  const { ref: ctaRevealRef, style: ctaRevealStyle } = useReveal<HTMLAnchorElement>({ delay: 180 });
  const magnetRef = useMagnetic<HTMLAnchorElement>(16);

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

  const setCtaRefs = (el: HTMLAnchorElement | null) => {
    ctaRevealRef.current = el;
    magnetRef.current = el;
  };

  return (
    <section
      className="relative overflow-hidden text-center"
      style={{ padding: '130px 40px', borderTop: '1px solid rgba(255,255,255,0.06)' }}
    >
      {isAdmin && (
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/30 rounded-full transition-colors font-semibold text-sm"
          >
            <Edit2 size={14} />
            Edit Socials
          </button>
        </div>
      )}
      <div
        ref={glowRef}
        className="pointer-events-none absolute"
        style={{
          top: '-25%',
          left: '50%',
          marginLeft: -480,
          width: 960,
          height: 640,
          background: 'radial-gradient(ellipse,rgba(59,130,246,0.14),transparent 70%)',
          filter: 'blur(50px)',
        }}
      />
      <div className="relative mx-auto flex flex-col items-center" style={{ maxWidth: 720 }}>
        <h2
          ref={headingRef}
          className="m-0"
          style={{
            ...headingStyle,
            fontSize: 'clamp(36px,4.6vw,64px)',
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: '-0.035em',
            color: '#fff',
            marginBottom: 20,
          }}
        >
          The real talk happens in{' '}
          <em className="accent-italic" style={{ color: '#3b82f6', letterSpacing: 0 }}>
            Telegram
          </em>
        </h2>
        <p
          ref={bodyRef}
          className="m-0"
          style={{
            ...bodyStyle,
            fontSize: 16,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.55)',
            marginBottom: 36,
            maxWidth: 460,
            fontWeight: 300,
          }}
        >
          Pre-market notes every morning, live trade alerts and a community that actually answers questions.
        </p>
        <a
          ref={setCtaRefs}
          href={settings?.telegramLink || '#'}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center"
          style={{
            ...ctaRevealStyle,
            gap: 12,
            background: 'linear-gradient(90deg,#3b82f6,#2563eb)',
            color: '#fff',
            padding: '15px 15px 15px 30px',
            borderRadius: 999,
            fontWeight: 700,
            fontSize: 15,
            boxShadow: '0 0 40px rgba(59,130,246,0.35)',
          }}
        >
          Join the Telegram
          <span
            className="flex items-center justify-center"
            style={{ width: 34, height: 34, borderRadius: 999, background: 'rgba(0,0,0,0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff">
              <path d="M9.04 16.62l-.38 5.36c.54 0 .78-.23 1.06-.51l2.55-2.44 5.28 3.87c.97.53 1.65.25 1.91-.9L22.9 3.8c.31-1.43-.52-1.99-1.46-1.64L2.4 9.5c-1.4.54-1.38 1.32-.24 1.67l4.87 1.52L18.35 5.6c.53-.35 1.02-.16.62.19L9.04 16.62z" />
            </svg>
          </span>
        </a>
      </div>

      <SettingsModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={fetchSettings}
      />
    </section>
  );
}
