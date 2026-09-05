import { useState, type Ref } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReveal } from '../hooks/useReveal';
import { useTilt } from '../hooks/useTilt';
import { useMagnetic } from '../hooks/useMagnetic';

interface GalleryItem {
  image: string;
  title: string;
  meta: string;
}

const GALLERY: GalleryItem[] = [
  { image: '/images/events/patna-event-6.jpg', title: 'Patna Traders Conclave', meta: '2025 · Core Team & Mentors' },
  { image: '/images/events/patna-event-5.jpg', title: 'Audience & Traders Floor', meta: '2025 · 300+ Live Attendees' },
  { image: '/images/events/patna-event-1.jpg', title: 'Conclave Main Stage', meta: '2025 · Keynote & Strategy' },
  { image: '/images/events/patna-event-2.jpg', title: 'Registration & Desk', meta: '2025 · Live Welcome' },
];

function GalleryTile({ item, delay }: { item: GalleryItem; delay: number }) {
  const reveal = useReveal<HTMLAnchorElement>({ delay, y: 40 });
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      ref={reveal.ref}
      to="/events"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative block overflow-hidden"
      style={{
        ...reveal.style,
        borderRadius: 18,
        border: '1px solid rgba(255,255,255,0.08)',
        minHeight: 190,
      }}
    >
      <img
        src={item.image}
        alt={item.title}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          filter: hovered ? 'grayscale(0) brightness(0.85)' : 'grayscale(0.8) brightness(0.7)',
          transform: hovered ? 'scale(1.07)' : 'scale(1.01)',
          transition: 'filter .6s, transform .8s cubic-bezier(.16,1,.3,1)',
        }}
      />
      <span
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(10,10,10,0.9))' }}
      />
      <span className="absolute" style={{ left: 16, bottom: 14, right: 16 }}>
        <span style={{ display: 'block', fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.title}</span>
        <span
          style={{
            display: 'block',
            fontSize: 11,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            marginTop: 3,
          }}
        >
          {item.meta}
        </span>
      </span>
    </Link>
  );
}

export default function EventsSection() {
  const { isAdmin } = useAuth();
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const allEvents = useReveal({ delay: 140 });
  const ticket = useReveal<HTMLDivElement>({ y: 40, duration: 1 });
  const tiltRef = useTilt<HTMLDivElement>(3);
  const magnetRef = useMagnetic<HTMLAnchorElement>(14);

  return (
    <section id="events" className="relative mx-auto" style={{ maxWidth: 1200, paddingBottom: 130 }}>
      <div className="flex items-end justify-between flex-wrap gap-6 px-5 sm:px-10" style={{ marginBottom: 52 }}>
        <div>
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
            Events
          </div>
          <h2
            ref={heading.ref}
            style={{
              ...heading.style,
              fontSize: 'clamp(34px, 3.8vw, 54px)',
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#fff',
            }}
          >
            Where the community <span className="accent-italic" style={{ color: '#22c55e' }}>meets</span>
          </h2>
        </div>
        {isAdmin && (
          <button
            className="inline-flex items-center gap-2 transition-colors hover:bg-white/10"
            style={{
              padding: '10px 18px',
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.14)',
              background: 'rgba(255,255,255,0.04)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            <Plus className="w-3.5 h-3.5" /> Add Event
          </button>
        )}
        <Link
          ref={allEvents.ref as unknown as Ref<HTMLAnchorElement>}
          to="/events"
          className="inline-flex items-center gap-2.5 hover:-translate-y-0.5 transition-transform"
          style={{
            ...allEvents.style,
            padding: '12px 22px',
            borderRadius: 999,
            border: '1px solid rgba(255,255,255,0.14)',
            color: '#fff',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
          }}
        >
          All Events
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[1.05fr_1fr] gap-6 items-stretch px-5 sm:px-10">
        <div
          ref={(node) => {
            ticket.ref.current = node;
            tiltRef.current = node;
          }}
          className="w-full relative overflow-hidden flex flex-col p-6 md:p-10"
          style={{
            ...ticket.style,
            borderRadius: 24,
            border: '1px solid rgba(34,197,94,0.35)',
            background: 'linear-gradient(160deg, rgba(34,197,94,0.10), rgba(255,255,255,0.03) 55%)',
            backdropFilter: 'blur(16px)',
            boxShadow: '0 0 50px rgba(34,197,94,0.10)',
          }}
        >
          <div className="flex justify-between items-start" style={{ marginBottom: 30 }}>
            <div
              className="text-center"
              style={{
                padding: '14px 20px',
                borderRadius: 16,
                background: 'rgba(0,0,0,0.5)',
                border: '1px solid rgba(34,197,94,0.4)',
              }}
            >
              <div style={{ fontSize: 40, fontWeight: 800, lineHeight: 1, color: '#fff', letterSpacing: '-0.02em' }}>
                24
              </div>
              <div style={{ fontSize: 12, letterSpacing: '0.2em', color: '#22c55e', fontWeight: 700, marginTop: 5 }}>
                AUG
              </div>
            </div>
            <span
              className="inline-flex items-center gap-2"
              style={{
                padding: '7px 14px',
                borderRadius: 999,
                background: 'rgba(34,197,94,0.14)',
                border: '1px solid rgba(34,197,94,0.4)',
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: '#22c55e',
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: 999,
                  background: '#22c55e',
                  animation: 'onlinePulse 2s infinite',
                }}
              />
              Upcoming · Live
            </span>
          </div>
          <h3 style={{ fontSize: 'clamp(26px, 2.4vw, 34px)', fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 14px' }}>
            Patna Trading Conclave 2026
          </h3>
          <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(255,255,255,0.6)', margin: '0 0 26px', fontWeight: 300, maxWidth: 440 }}>
            A full day of live market breakdowns, Nifty/Bank Nifty & Crypto workshops, and networking with 300+ traders from the
            community.
          </p>
          <div className="flex gap-6 flex-wrap" style={{ marginBottom: 28 }}>
            <span className="inline-flex items-center gap-2" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
              <MapPin className="w-[15px] h-[15px]" style={{ color: '#22c55e' }} />
              Patna, Bihar
            </span>
            <span className="inline-flex items-center gap-2" style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
              <Clock className="w-[15px] h-[15px]" style={{ color: '#22c55e' }} />
              10:00 — 19:00 IST
            </span>
          </div>
          <div style={{ marginBottom: 26 }}>
            <div
              className="flex items-center"
              style={{
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#22c55e',
              }}
            >
              Available
            </div>
          </div>
          <div className="flex items-center gap-4.5" style={{ marginTop: 'auto', gap: 18 }}>
            <a
              ref={magnetRef}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5"
              style={{
                background: 'linear-gradient(90deg,#84cc16,#22c55e)',
                color: '#000',
                padding: '13px 26px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 14,
                boxShadow: '0 0 30px rgba(34,197,94,0.3)',
              }}
            >
              Reserve a Seat
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>Free for Pro &amp; Elite members</span>
          </div>
        </div>

        <div className="w-full">
          <div className="grid grid-cols-2 grid-rows-2 gap-4 h-full">
          {GALLERY.map((item, i) => (
            <GalleryTile key={item.title} item={item} delay={[0, 90, 160, 230][i]} />
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}
