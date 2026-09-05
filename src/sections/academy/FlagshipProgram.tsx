import { useState } from 'react';
import { Clock, ArrowRight, Check, Edit2, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';
import { useMagnetic } from '../../hooks/useMagnetic';
import { useParallax } from '../../hooks/useParallax';
import { type CourseData } from '../../components/admin/CourseModal';
import ActionNoticeModal from '../../components/ui/ActionNoticeModal';

interface FlagshipProgramProps {
  course?: CourseData;
  isAdmin?: boolean;
  onEdit?: (course: CourseData) => void;
  onDelete?: (id: string) => void;
}

export default function FlagshipProgram({ course, isAdmin, onEdit, onDelete }: FlagshipProgramProps) {
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [isNoticeOpen, setIsNoticeOpen] = useState(false);
  const { ref: revealRef, style: revealStyle } = useReveal<HTMLDivElement>({ y: 40, duration: 1 });
  const tiltRef = useTilt<HTMLDivElement>(2);
  const magnetRef = useMagnetic<HTMLButtonElement>(14);
  const imgParallaxRef = useParallax<HTMLDivElement>(0.08);

  if (!course) return null;

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || '';
  const imageUrl = course.image?.startsWith('http') ? course.image : `${backendUrl}${course.image}`;

  return (
    <section className="relative mx-auto px-[18px] md:px-10" style={{ maxWidth: 1200, paddingBottom: 80 }}>
      <div className="relative group">
        {isAdmin && onEdit && onDelete && (
          <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(course)}
              className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm border border-white/10"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => course._id && onDelete(course._id)}
              className="p-2 bg-black/60 hover:bg-red-500/20 text-red-400 rounded-full backdrop-blur-sm border border-white/10"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
        <div
          ref={(el) => {
            revealRef.current = el;
            tiltRef.current = el;
          }}
          className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr]"
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 26,
            border: '1px solid rgba(34,197,94,0.4)',
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            boxShadow: '0 0 60px rgba(34,197,94,0.10)',
            ...revealStyle,
          }}
        >
          <div className="relative overflow-hidden" style={{ minHeight: 280 }}>
            <div style={{ position: 'absolute', inset: '-10% 0' }}>
              <div ref={imgParallaxRef} style={{ width: '100%', height: '100%' }}>
                <img
                  src={imageUrl}
                  alt={course.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'brightness(0.6)',
                  }}
                />
              </div>
            </div>
            <span
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg,transparent 55%,rgba(10,10,10,0.95))',
              }}
            />
            <span
              style={{
                position: 'absolute',
                top: 24,
                left: 24,
                padding: '7px 16px',
                borderRadius: 999,
                background: 'linear-gradient(90deg,#84cc16,#22c55e)',
                fontSize: 11,
                fontWeight: 800,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: '#000',
              }}
            >
              Flagship Program
            </span>
            <span
              className="flex items-center gap-4 flex-wrap"
              style={{ position: 'absolute', left: 24, bottom: 24 }}
            >
              <span
                className="inline-flex items-center gap-[7px]"
                style={{
                  padding: '8px 14px',
                  borderRadius: 999,
                  background: 'rgba(10,10,10,0.7)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontSize: 12,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.75)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Clock size={13} color="#22c55e" strokeWidth={2} />
                {course.meta}
              </span>
            </span>
          </div>

          <div className="flex flex-col relative" style={{ padding: 44, zIndex: 1 }}>
            {/* Dotted grid background */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1.5px, transparent 1.5px)',
                backgroundSize: '22px 22px',
                zIndex: -2,
              }}
            />
            {/* Gradient overlay to fade the grid nicely at the edges */}
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, transparent 20%, rgba(10,10,10,0.8) 100%)',
                zIndex: -1,
                borderLeft: '1px solid rgba(255,255,255,0.05)'
              }}
            />
            
            <h2
              style={{
                fontSize: 'clamp(28px,3vw,40px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                color: '#fff',
                margin: '0 0 14px',
              }}
            >
              {course.title}
            </h2>
            <p
              style={{
                fontSize: 15,
                lineHeight: 1.65,
                color: 'rgba(255,255,255,0.6)',
                margin: '0 0 28px',
                fontWeight: 300,
              }}
            >
              {course.description}
            </p>
            {course.includes && course.includes.length > 0 && (
              <div className="flex flex-col gap-[13px]" style={{ marginBottom: 32 }}>
                {course.includes.map((line, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-[10px]"
                    style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}
                  >
                    <Check size={17} color="#22c55e" strokeWidth={2.5} style={{ flexShrink: 0 }} />
                    {line}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center gap-[22px] flex-wrap" style={{ marginTop: 'auto' }}>
              <button
                ref={magnetRef}
                onClick={() => {
                  setIsWaitlisted(true);
                  setIsNoticeOpen(true);
                  toast.success(`Joined the Waiting List for ${course.title}!`);
                }}
                className="inline-flex items-center gap-[10px] cursor-pointer"
                style={{
                  background: isWaitlisted ? 'rgba(34,197,94,0.15)' : 'linear-gradient(90deg,#84cc16,#22c55e)',
                  color: isWaitlisted ? '#22c55e' : '#000',
                  border: isWaitlisted ? '1px solid rgba(34,197,94,0.5)' : 'none',
                  padding: '14px 28px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: 15,
                  boxShadow: isWaitlisted ? '0 0 20px rgba(34,197,94,0.2)' : '0 0 30px rgba(34,197,94,0.3)',
                  transition: 'all .3s ease',
                }}
              >
                {isWaitlisted ? (
                  <>
                    <CheckCircle2 size={18} color="#22c55e" strokeWidth={2.5} />
                    In the Waiting List
                  </>
                ) : (
                  <>
                    Enroll Now <ArrowRight size={15} color="#000" strokeWidth={3} />
                  </>
                )}
              </button>
              <span className="flex flex-col">
                <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>{course.price}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <ActionNoticeModal
        isOpen={isNoticeOpen}
        onClose={() => setIsNoticeOpen(false)}
        title="Joined the Waiting List"
        type="waiting-list"
        itemName={course.title}
        subtitle="You are now on the priority reservation list for Master Swing Trade. You'll receive enrollment access as soon as cohorts open."
      />
    </section>
  );
}
