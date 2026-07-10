import { useEffect, useState, type MutableRefObject, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../lib/api';
import { MapPin, Clock, Plus, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useReveal } from '../hooks/useReveal';
import { useParallax } from '../hooks/useParallax';
import { useTilt } from '../hooks/useTilt';
import { useMagnetic } from '../hooks/useMagnetic';
import { useCountUp } from '../hooks/useCountUp';
import EventModal, { type EventData } from '../components/admin/EventModal';
import { toast } from 'sonner';

/* ── Film strip images (reused site assets) ── */
const FILM_STRIP_IMAGES = [
  '/images/capability-1.jpg',
  '/images/research-2.jpg',
  '/images/capability-3.jpg',
  '/images/research-4.jpg',
  '/images/capability-2.jpg',
  '/images/research-1.jpg',
];

/* ── Past events archive mosaic data ── */
interface MosaicItem {
  _id: string;
  image: string;
  title: string;
  meta: string;
  badge?: string;
  big?: boolean;
  tall?: boolean;
  delay?: number;
}

const MOSAIC_ITEMS: MosaicItem[] = [
  {
    _id: 'static-archive-1',
    image: '/images/research-1.jpg',
    title: 'Dubai Traders Meetup',
    meta: '2025 · 180 attendees · Keynote night',
    badge: '2025',
    big: true,
  },
  {
    _id: 'static-archive-2',
    image: '/images/capability-2.jpg',
    title: 'Risk Workshop',
    meta: '2025 · Delhi',
    delay: 80,
  },
  {
    _id: 'static-archive-3',
    image: '/images/capability-3.jpg',
    title: 'Psychology Bootcamp',
    meta: '2025 · Online · 2.4K live',
    delay: 140,
  },
  {
    _id: 'static-archive-4',
    image: '/images/research-3.jpg',
    title: 'Funded Trader Awards',
    meta: '2024 · Bangalore',
    badge: '2024',
    tall: true,
    delay: 200,
  },
  {
    _id: 'static-archive-5',
    image: '/images/research-2.jpg',
    title: 'Scalping Night',
    meta: '2024 · Mumbai',
    delay: 120,
  },
  {
    _id: 'static-archive-6',
    image: '/images/capability-4.jpg',
    title: 'Live Trading Arena',
    meta: '2024 · Goa retreat',
    delay: 180,
  },
];

/* ── Film strip: seamless auto-scrolling marquee ── */
function FilmStrip() {
  const strip = [...FILM_STRIP_IMAGES, ...FILM_STRIP_IMAGES];
  return (
    <section className="relative" style={{ padding: '26px 0 90px' }}>
      <div className="edge-fade-x w-full overflow-hidden">
        <div
          className="inline-flex"
          style={{ gap: 18, animation: 'marqueeScroll 44s linear infinite', paddingRight: 18 }}
        >
          {strip.map((src, i) => (
            <img
              key={i}
              src={src}
              alt="Event"
              className="flex-shrink-0"
              style={{
                width: 340,
                height: 210,
                objectFit: 'cover',
                borderRadius: 16,
                border: '1px solid rgba(255,255,255,0.08)',
                filter: 'grayscale(0.5) brightness(0.8)',
                transition: 'filter .5s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.filter = 'grayscale(0) brightness(1)')}
              onMouseLeave={(e) => (e.currentTarget.style.filter = 'grayscale(0.5) brightness(0.8)')}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ── Upcoming event card ── */
interface UpcomingEvent {
  _id: string;
  image: string;
  badgeIcon: ReactNode;
  badgeText: string;
  badgeColor: string;
  day: string;
  month: string;
  title: string;
  description: string;
  metaLocation: string;
  metaTime: string;
  status: 'AVAILABLE' | 'FULL';
  ticketLink?: string;
  ctaText: string;
  ctaVariant: 'primary' | 'secondary';
  borderColor: string;
  cardBg: string;
  glow?: string;
  revealDelay?: number;
}

interface BackendEvent {
  _id: string;
  type: 'UPCOMING' | 'ARCHIVE';
  title: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  images: string[];
  section?: string;
  ticketLink?: string;
  status?: 'AVAILABLE' | 'FULL';
}

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    _id: 'static-upcoming-1',
    image: '/images/capability-1.jpg',
    badgeIcon: (
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: '#22c55e',
          animation: 'onlinePulseEvt 2s infinite',
          display: 'inline-block',
        }}
      />
    ),
    badgeText: 'In Person',
    badgeColor: '#22c55e',
    day: '24',
    month: 'AUG',
    title: 'Mumbai Trading Summit 2026',
    description:
      'Live market breakdowns, prop-firm workshops and an evening of networking with 300+ traders.',
    metaLocation: 'Grand Hyatt, Mumbai',
    metaTime: '10:00 — 19:00 IST',
    status: 'AVAILABLE',
    ticketLink: '#',
    ctaText: 'Reserve a Seat',
    ctaVariant: 'primary',
    borderColor: 'rgba(34,197,94,0.35)',
    cardBg: 'linear-gradient(160deg,rgba(34,197,94,0.10),rgba(255,255,255,0.03) 55%)',
    glow: '0 0 50px rgba(34,197,94,0.10)',
  },
  {
    _id: 'static-upcoming-2',
    image: '/images/capability-4.jpg',
    badgeIcon: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="23 7 16 12 23 17 23 7" />
        <rect x="1" y="5" width="15" height="14" rx="2" />
      </svg>
    ),
    badgeText: 'Online · Live',
    badgeColor: '#60a5fa',
    day: '12',
    month: 'SEP',
    title: 'Backtesting Masterclass',
    description:
      'A 3-hour deep dive: build, validate and stress-test a strategy live — then take the template home.',
    metaLocation: 'Zoom · link on signup',
    metaTime: '18:00 — 21:00 IST',
    status: 'AVAILABLE',
    ticketLink: '#',
    ctaText: 'Reserve a Seat',
    ctaVariant: 'secondary',
    borderColor: 'rgba(255,255,255,0.1)',
    cardBg: 'rgba(255,255,255,0.03)',
    revealDelay: 120,
  },
];

function UpcomingCard({ event, onEdit, onDelete }: { event: UpcomingEvent, onEdit: (e: EventData) => void, onDelete: (id: string) => void }) {
  const { ref: revealRef, style: revealStyle } = useReveal<HTMLDivElement>({ delay: event.revealDelay ?? 0, y: 40 });
  const tiltRef = useTilt<HTMLDivElement>(2.5);
  const magnetRef = useMagnetic<HTMLAnchorElement>(14);

  const setRefs = (el: HTMLDivElement | null) => {
    (revealRef as MutableRefObject<HTMLDivElement | null>).current = el;
    (tiltRef as MutableRefObject<HTMLDivElement | null>).current = el;
  };

  const isPrimary = event.ctaVariant === 'primary';

  const { isAdmin } = useAuth();

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(event as unknown as EventData);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event._id);
    }
  };

  return (
    <div
      ref={setRefs}
      className="group"
      style={{
        ...revealStyle,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 24,
        border: `1px solid ${event.borderColor}`,
        background: event.cardBg,
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        boxShadow: event.glow,
      }}
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleEditClick} className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={handleDeleteClick} className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-full backdrop-blur-md border border-red-500/20 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      )}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img
          src={event.image}
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.65)' }}
        />
        <span
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg,transparent,rgba(10,14,10,0.9))',
          }}
        />
        <span
          style={{
            position: 'absolute',
            top: 18,
            left: 18,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '7px 14px',
            borderRadius: 999,
            background: 'rgba(10,10,10,0.7)',
            border: `1px solid ${event.badgeColor}66`,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: event.badgeColor,
            backdropFilter: 'blur(8px)',
          }}
        >
          {event.badgeIcon}
          {event.badgeText}
        </span>
        <span
          style={{
            position: 'absolute',
            right: 18,
            bottom: -34,
            textAlign: 'center',
            padding: '14px 20px',
            borderRadius: 16,
            background: 'rgba(5,7,5,0.9)',
            border: `1px solid ${event.badgeColor}66`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <span style={{ display: 'block', fontSize: 34, fontWeight: 800, lineHeight: 1, color: '#fff' }}>
            {event.day}
          </span>
          <span
            style={{
              display: 'block',
              fontSize: 11,
              letterSpacing: '0.2em',
              color: event.badgeColor,
              fontWeight: 700,
              marginTop: 4,
            }}
          >
            {event.month}
          </span>
        </span>
      </div>
      <div className="p-6 sm:p-[34px]">
        <h3 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.02em', color: '#fff', margin: '0 0 12px' }}>
          {event.title}
        </h3>
        <p
          style={{
            fontSize: 14,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.58)',
            margin: '0 0 22px',
            fontWeight: 300,
          }}
        >
          {event.description}
        </p>
        <div className="flex flex-wrap" style={{ gap: 20, marginBottom: 24 }}>
          <span className="inline-flex items-center" style={{ gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            <MapPin size={14} color={event.badgeColor} strokeWidth={2} />
            {event.metaLocation}
          </span>
          <span className="inline-flex items-center" style={{ gap: 8, fontSize: 13, color: 'rgba(255,255,255,0.6)' }}>
            <Clock size={14} color={event.badgeColor} strokeWidth={2} />
            {event.metaTime}
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
              color: event.status === 'FULL' ? '#ef4444' : '#22c55e',
            }}
          >
            {event.status === 'FULL' ? 'House Full' : 'Available'}
          </div>
        </div>
        <div className="flex items-center flex-wrap" style={{ gap: 16 }}>
          <a
            ref={magnetRef}
            href={event.status === 'FULL' ? '#' : (event.ticketLink || '#')}
            target={event.ticketLink && event.status !== 'FULL' ? "_blank" : undefined}
            rel={event.ticketLink && event.status !== 'FULL' ? "noopener noreferrer" : undefined}
            className="inline-flex items-center"
            style={
              isPrimary
                ? {
                    gap: 10,
                    background: event.status === 'FULL' ? 'rgba(255,255,255,0.1)' : 'linear-gradient(90deg,#84cc16,#22c55e)',
                    color: event.status === 'FULL' ? 'rgba(255,255,255,0.3)' : '#000',
                    padding: '13px 26px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 14,
                    boxShadow: event.status === 'FULL' ? 'none' : '0 0 30px rgba(34,197,94,0.3)',
                    pointerEvents: event.status === 'FULL' ? 'none' : 'auto',
                  }
                : {
                    gap: 10,
                    background: event.status === 'FULL' ? 'rgba(255,255,255,0.05)' : 'rgba(96,165,250,0.14)',
                    border: event.status === 'FULL' ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(96,165,250,0.45)',
                    color: event.status === 'FULL' ? 'rgba(255,255,255,0.3)' : '#fff',
                    padding: '12px 26px',
                    borderRadius: 999,
                    fontWeight: 700,
                    fontSize: 14,
                    transition: 'background .3s',
                    pointerEvents: event.status === 'FULL' ? 'none' : 'auto',
                  }
            }
            onMouseEnter={(e) => {
              if (!isPrimary && event.status !== 'FULL') e.currentTarget.style.background = 'rgba(96,165,250,0.24)';
            }}
            onMouseLeave={(e) => {
              if (!isPrimary && event.status !== 'FULL') e.currentTarget.style.background = 'rgba(96,165,250,0.14)';
            }}
          >
            {event.status === 'FULL' ? 'House Full' : event.ctaText}
            {event.status !== 'FULL' && (
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isPrimary ? '#000' : '#60a5fa'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            )}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── Past events archive mosaic ── */
function MosaicCard({ item, onEdit, onDelete }: { item: MosaicItem, onEdit: (e: EventData) => void, onDelete: (id: string) => void }) {
  const { ref, style } = useReveal<HTMLAnchorElement>({ delay: item.delay ?? 0, y: 40 });
  const { isAdmin } = useAuth();
  
  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit(item as unknown as EventData);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.confirm('Are you sure you want to delete this event?')) {
      onDelete(item._id);
    }
  };
  
  return (
    <a
      ref={ref}
      href="#"
      onClick={(e) => e.preventDefault()}
      className={`group relative block overflow-hidden ${item.big ? 'col-span-2 row-span-2' : ''} ${
        item.tall ? 'row-span-2' : ''
      }`}
      style={{
        ...style,
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {isAdmin && (
        <div className="absolute top-4 left-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={handleEditClick} className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button onClick={handleDeleteClick} className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-full backdrop-blur-md border border-red-500/20 transition-colors">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      )}
      <img
        src={item.image}
        alt={item.title}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(0.9)',
          transform: 'scale(1.01)',
          transition: 'filter .6s, transform .9s cubic-bezier(.16,1,.3,1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.filter = 'brightness(1.05)';
          e.currentTarget.style.transform = item.big ? 'scale(1.05)' : 'scale(1.06)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.filter = 'brightness(0.9)';
          e.currentTarget.style.transform = 'scale(1.01)';
        }}
      />
      <span
        style={{
          position: 'absolute',
          inset: 0,
          background: `linear-gradient(180deg,transparent ${item.big ? '50%' : '45%'},rgba(10,10,10,0.92))`,
          pointerEvents: 'none',
        }}
      />
      {item.badge && (
        <span
          style={{
            position: 'absolute',
            top: 18,
            right: 18,
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(10,10,10,0.7)',
            border: '1px solid rgba(255,255,255,0.15)',
            fontSize: 11,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(8px)',
          }}
        >
          {item.badge}
        </span>
      )}
      <span
        style={{
          position: 'absolute',
          left: item.big ? 22 : 18,
          bottom: item.big ? 20 : 16,
          right: item.big ? 22 : 18,
        }}
      >
        <span
          style={{
            display: 'block',
            fontSize: item.big ? 20 : item.tall ? 16 : 15,
            fontWeight: item.big ? 800 : 700,
            color: '#fff',
            letterSpacing: item.big ? '-0.01em' : undefined,
          }}
        >
          {item.title}
        </span>
        <span
          style={{
            display: 'block',
            fontSize: item.big ? 12 : 11,
            letterSpacing: item.big ? '0.14em' : '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.55)',
            marginTop: item.big ? 5 : 3,
          }}
        >
          {item.meta}
        </span>
      </span>
    </a>
  );
}

function ArchiveStat({ to, suffix, label }: { to: number; suffix?: string; label: string }) {
  const { ref, display } = useCountUp<HTMLSpanElement>(to, { suffix });
  return (
    <span className="text-right">
      <span style={{ display: 'block', fontSize: 26, fontWeight: 800, color: '#fff' }}>
        <span ref={ref}>{display}</span>
      </span>
      <span
        style={{
          display: 'block',
          fontSize: 11,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.4)',
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </span>
  );
}

export default function Events() {
  const { isAdmin } = useAuth();
  const heroGlowRef = useParallax<HTMLDivElement>(0.25);
  const archiveGlowRef = useParallax<HTMLDivElement>(0.15);
  const ctaGlowRef = useParallax<HTMLDivElement>(0.2);
  const ctaMagnetRef = useMagnetic<HTMLAnchorElement>(16);

  const ctaReveal = useReveal<HTMLHeadingElement>({ y: 30 });
  const ctaPReveal = useReveal<HTMLParagraphElement>({ delay: 100, y: 30 });
  const ctaAReveal = useReveal<HTMLAnchorElement>({ delay: 180, y: 30 });
  const upcomingH2 = useReveal<HTMLHeadingElement>({ y: 30 });
  const upcomingSpan = useReveal<HTMLSpanElement>({ delay: 80, y: 30 });
  const archiveH2 = useReveal<HTMLHeadingElement>({ y: 30 });
  const archiveStats = useReveal<HTMLDivElement>({ delay: 100, y: 30 });

  const setCtaRefs = (el: HTMLAnchorElement | null) => {
    (ctaAReveal.ref as MutableRefObject<HTMLAnchorElement | null>).current = el;
    (ctaMagnetRef as MutableRefObject<HTMLAnchorElement | null>).current = el;
  };

  const [dbEvents, setDbEvents] = useState<BackendEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEventToEdit, setCurrentEventToEdit] = useState<EventData | null>(null);
  const [modalType, setModalType] = useState<'UPCOMING' | 'ARCHIVE'>('UPCOMING');

  const fetchEvents = async () => {
    try {
      const { data } = await api.get('/events');
      setDbEvents(data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleEdit = (eventData: EventData) => {
    setCurrentEventToEdit(eventData);
    setModalType(eventData.type || 'UPCOMING');
    setIsModalOpen(true);
  };

  const handleAdd = (type: 'UPCOMING' | 'ARCHIVE') => {
    setCurrentEventToEdit(null);
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/events/${id}`);
      toast.success('Event deleted');
      fetchEvents();
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const upcomingDbEvents = dbEvents.filter(e => e.type === 'UPCOMING');
  const archiveDbEvents = dbEvents.filter(e => e.type === 'ARCHIVE');

  // Map BackendEvents to UpcomingEvents format for UI
  const mappedUpcoming = upcomingDbEvents.length > 0 ? upcomingDbEvents.map((evt, i) => {
    const dateObj = new Date(evt.date || Date.now());
    return {
      image: getImageUrl(evt.images?.[0]) || '/images/capability-1.jpg',
      badgeIcon: i % 2 === 0 ? (
        <span style={{ width: 7, height: 7, borderRadius: 999, background: '#22c55e', animation: 'onlinePulseEvt 2s infinite', display: 'inline-block' }} />
      ) : (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7" /><rect x="1" y="5" width="15" height="14" rx="2" /></svg>
      ),
      badgeText: i % 2 === 0 ? 'In Person' : 'Online · Live',
      badgeColor: i % 2 === 0 ? '#22c55e' : '#60a5fa',
      day: dateObj.getDate().toString(),
      month: dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase(),
      description: evt.description || '',
      metaLocation: evt.location || 'Online',
      metaTime: evt.time || '10:00 — 19:00 IST',
      status: evt.status || 'AVAILABLE',
      ticketLink: evt.ticketLink || '#',
      ctaText: 'Reserve a Seat',
      ctaVariant: i % 2 === 0 ? 'primary' as const : 'secondary' as const,
      borderColor: i % 2 === 0 ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.1)',
      cardBg: i % 2 === 0 ? 'linear-gradient(160deg,rgba(34,197,94,0.10),rgba(255,255,255,0.03) 55%)' : 'rgba(255,255,255,0.03)',
      glow: i % 2 === 0 ? '0 0 50px rgba(34,197,94,0.10)' : undefined,
      ...evt, // Keep original data for the edit modal (includes _id)
    }
  }) : UPCOMING_EVENTS;

  // Map BackendEvents to MosaicItem format for UI
  const mappedArchives = archiveDbEvents.length > 0 ? archiveDbEvents.map((evt, i) => {
    return {
      ...evt,
      image: evt.images?.[0] || '/images/research-1.jpg',
      meta: evt.section || '2025',
      badge: i === 0 || i === 3 ? (evt.section?.split(' ')[0] || '2025') : undefined,
      big: i === 0,
      tall: i === 3,
      delay: i * 60,
    }
  }) : MOSAIC_ITEMS;

  return (
    <div className="relative w-full" style={{ background: '#0a0a0a', overflow: 'hidden' }}>
      <style>{`
        @keyframes onlinePulseEvt { 0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,.5); } 70% { box-shadow: 0 0 0 8px rgba(34,197,94,0); } }
        @keyframes eventsFadeSlideUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      {/* HERO */}
      <section className="relative overflow-hidden px-5 sm:px-10" style={{ padding: '150px 20px 60px' }}>
        <div
          ref={heroGlowRef}
          style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            marginLeft: -500,
            width: 1000,
            height: 640,
            background: 'radial-gradient(ellipse,rgba(34,197,94,0.16),transparent 68%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <div
          className="relative mx-auto flex flex-wrap items-end justify-between"
          style={{ maxWidth: 1200, gap: 28 }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                color: '#22c55e',
                fontWeight: 600,
                marginBottom: 22,
                animation: 'eventsFadeSlideUp .8s ease forwards',
                opacity: 0,
              }}
            >
              Shamsh Trader · Events
            </div>
            <h1
              style={{
                fontSize: 'clamp(38px,6.4vw,96px)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.04em',
                color: '#fff',
                margin: 0,
                animation: 'eventsFadeSlideUp .9s ease .1s forwards',
                opacity: 0,
              }}
            >
              Trade together.
              <br />
              <em className="accent-italic" style={{ color: '#22c55e', letterSpacing: '-0.01em' }}>
                Grow
              </em>{' '}
              together.
            </h1>
          </div>
          <div
            className="flex flex-col items-start sm:items-end"
            style={{ gap: 18, animation: 'eventsFadeSlideUp .9s ease .25s forwards', opacity: 0 }}
          >
            <p
              style={{
                fontSize: 16,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.55)',
                maxWidth: 380,
                fontWeight: 300,
                margin: 0,
              }}
              className="text-left sm:text-right"
            >
              Live summits, online masterclasses and city meetups — curated by Shamsh, hosted for the community.
            </p>
            {isAdmin && (
              <span
                onClick={() => handleAdd('UPCOMING')}
                className="inline-flex items-center cursor-pointer"
                style={{
                  gap: 8,
                  padding: '9px 18px',
                  borderRadius: 999,
                  border: '1px dashed rgba(255,255,255,0.2)',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                  transition: 'border-color .3s, color .3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(34,197,94,0.6)';
                  e.currentTarget.style.color = '#22c55e';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.45)';
                }}
              >
                <Plus size={13} strokeWidth={2.5} />
                Add Event · Admin
              </span>
            )}
          </div>
        </div>
      </section>

      {/* FILM STRIP */}
      <FilmStrip />

      {/* UPCOMING */}
      <section className="relative mx-auto px-5 sm:px-10" style={{ maxWidth: 1200, paddingBottom: 110 }}>
        <div className="flex items-baseline flex-wrap" style={{ gap: 18, marginBottom: 44 }}>
          <h2
            ref={upcomingH2.ref}
            style={{
              ...upcomingH2.style,
              fontSize: 'clamp(28px,3vw,42px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fff',
              margin: 0,
            }}
          >
            Upcoming
          </h2>
          <span
            ref={upcomingSpan.ref}
            style={{
              ...upcomingSpan.style,
              fontSize: 13,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.4)',
              fontWeight: 600,
            }}
          >
            {UPCOMING_EVENTS.length} sessions open
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 24 }}>
          {loading ? (
            <div className="col-span-2 text-center text-white/50 py-10">Loading events...</div>
          ) : (
            mappedUpcoming.map((evt) => (
              <UpcomingCard key={evt._id} event={evt as any} onEdit={handleEdit} onDelete={handleDelete} />
            ))
          )}
        </div>
      </section>

      {/* PAST GALLERY / ARCHIVE */}
      <section
        className="relative"
        style={{
          padding: '90px 0 100px',
          background: 'linear-gradient(180deg,#0a0a0a,#050705,#0a0a0a)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div
          ref={archiveGlowRef}
          style={{
            position: 'absolute',
            top: '20%',
            right: '-10%',
            width: 700,
            height: 700,
            background: 'radial-gradient(circle,rgba(34,197,94,0.09),transparent 65%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <div className="relative mx-auto px-5 sm:px-10" style={{ maxWidth: 1200 }}>
          <div
            className="flex flex-wrap items-end justify-between"
            style={{ gap: 24, marginBottom: 40 }}
          >
            <h2
              ref={archiveH2.ref}
              style={{
                ...archiveH2.style,
                fontSize: 'clamp(28px,3vw,42px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#fff',
                margin: 0,
              }}
            >
              The <em className="accent-italic" style={{ color: '#22c55e' }}>archive</em>
            </h2>
            <div ref={archiveStats.ref} className="flex" style={{ ...archiveStats.style, gap: 36 }}>
              <ArchiveStat to={40} suffix="+" label="Meetups" />
              <ArchiveStat to={6} label="Cities" />
              <ArchiveStat to={12} suffix="K+" label="Attendees" />
            </div>
          </div>
          {isAdmin && (
            <div className="flex justify-end mb-8">
              <button onClick={() => handleAdd('ARCHIVE')} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 text-white/50 hover:text-white hover:border-green-500/50 transition-colors text-sm font-semibold uppercase tracking-wider">
                <Plus size={16} /> Add Archive Event
              </button>
            </div>
          )}
          
          <div className="grid grid-cols-2 md:grid-cols-4" style={{ gridAutoRows: 200, gap: 16 }}>
            {loading ? (
              <div className="col-span-4 text-center text-white/50 py-10">Loading archives...</div>
            ) : (
              mappedArchives.map((item) => (
                <MosaicCard key={item._id} item={item as any} onEdit={handleEdit} onDelete={handleDelete} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* NEWSLETTER CTA */}
      <section className="relative overflow-hidden px-5 sm:px-10 text-center" style={{ padding: '110px 20px' }}>
        <div
          ref={ctaGlowRef}
          style={{
            position: 'absolute',
            top: '-20%',
            left: '50%',
            marginLeft: -460,
            width: 920,
            height: 600,
            background: 'radial-gradient(ellipse,rgba(34,197,94,0.13),transparent 70%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />
        <div className="relative mx-auto flex flex-col items-center" style={{ maxWidth: 760 }}>
          <h2
            ref={ctaReveal.ref}
            style={{
              ...ctaReveal.style,
              fontSize: 'clamp(32px,4.6vw,64px)',
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: '-0.035em',
              color: '#fff',
              margin: '0 0 20px',
            }}
          >
            Never miss a <em className="accent-italic" style={{ color: '#22c55e', letterSpacing: 0 }}>session</em>
          </h2>
          <p
            ref={ctaPReveal.ref}
            style={{
              ...ctaPReveal.style,
              fontSize: 16,
              lineHeight: 1.65,
              color: 'rgba(255,255,255,0.55)',
              margin: '0 0 36px',
              maxWidth: 480,
              fontWeight: 300,
            }}
          >
            Event invites land in the newsletter first — members get priority seats before public release.
          </p>
          <Link
            ref={setCtaRefs}
            to="/#contact"
            className="inline-flex items-center"
            style={{
              ...ctaAReveal.style,
              gap: 12,
              background: 'linear-gradient(90deg,#84cc16,#22c55e)',
              color: '#000',
              padding: '15px 15px 15px 30px',
              borderRadius: 999,
              fontWeight: 700,
              fontSize: 15,
              boxShadow: '0 0 40px rgba(34,197,94,0.3)',
            }}
          >
            Get Event Invites
            <span
              style={{
                width: 34,
                height: 34,
                borderRadius: 999,
                background: '#050505',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ArrowRight size={16} color="#22c55e" strokeWidth={3} />
            </span>
          </Link>
        </div>
      </section>
      
      {/* Event Modal for Admin */}
      <EventModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        event={currentEventToEdit}
        onSaved={fetchEvents}
        type={modalType}
      />
    </div>
  );
}
