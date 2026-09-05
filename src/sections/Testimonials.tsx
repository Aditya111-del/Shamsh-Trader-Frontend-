import { useState, useEffect } from 'react';
import { useReveal } from '../hooks/useReveal';
import { Plus, Edit2, Trash2, Star } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TestimonialModal, { type TestimonialData } from '../components/admin/TestimonialModal';
import api from '../lib/api';
import { toast } from 'sonner';

const X_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#60a5fa">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const INSTAGRAM_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth={2}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

function Stars() {
  return (
    <div className="flex" style={{ gap: 4, marginBottom: 18 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={14} className="fill-[#22c55e] text-[#22c55e]" />
      ))}
    </div>
  );
}

function TestimonialCard({ 
  item, 
  delay,
  isAdmin,
  onEdit,
  onDelete
}: { 
  item: TestimonialData; 
  delay: number;
  isAdmin: boolean;
  onEdit: (item: TestimonialData) => void;
  onDelete: (id: string) => void;
}) {
  const reveal = useReveal<HTMLDivElement>({ delay, y: 40 });
  const [hovered, setHovered] = useState(false);

  const getPlatformIcon = () => {
    if (item.platform === 'X') return X_ICON;
    if (item.platform === 'Instagram') return INSTAGRAM_ICON;
    return null;
  };

  const CardWrapper = item.link ? 'a' : 'div';
  const wrapperProps = item.link ? { href: item.link, target: '_blank', rel: 'noreferrer' } : {};

  return (
    <div className="relative group w-full shrink-0 snap-center md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] h-full">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(item);
            }}
            className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm border border-white/10"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              item._id && onDelete(item._id);
            }}
            className="p-2 bg-black/60 hover:bg-red-500/20 text-red-400 rounded-full backdrop-blur-sm border border-white/10"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      <CardWrapper
        ref={reveal.ref as any}
        {...wrapperProps}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="p-5 md:p-6 flex flex-col h-full block"
        style={{
          ...reveal.style,
          borderRadius: 20,
          border: `1px solid ${hovered ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.08)'}`,
          background: 'linear-gradient(145deg, #18181b, #09090b)',
          boxShadow: '0 0 15px rgba(34,197,94,0.05), inset 0 1px 0 rgba(255,255,255,0.05)',
          minHeight: 280,
          transition: 'transform .4s cubic-bezier(.16,1,.3,1), border-color .4s, box-shadow .4s',
          cursor: item.link ? 'pointer' : 'default',
        }}
      >
        <Stars />
        <p style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(255,255,255,0.8)', margin: '0 0 28px', fontWeight: 300 }}>
          "{item.quote}"
        </p>
        <div className="flex items-center gap-3.5" style={{ marginTop: 'auto', gap: 14 }}>
          <div
            className="flex items-center justify-center shrink-0"
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              background: 'linear-gradient(135deg,#84cc16,#22c55e)',
              fontWeight: 700,
              color: '#000',
            }}
          >
            {item.initial || item.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <div style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{item.name}</div>
            {item.meta && (
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>{item.meta}</div>
            )}
          </div>
          {item.platform && item.platform !== 'None' && (
            <div className="shrink-0 ml-auto flex items-center justify-center p-2 rounded-full bg-white/5 border border-white/10">
              {getPlatformIcon()}
            </div>
          )}
        </div>
      </CardWrapper>
    </div>
  );
}

export default function Testimonials() {
  const eyebrow = useReveal();
  const heading = useReveal({ delay: 80 });
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [testimonials, setTestimonials] = useState<TestimonialData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);

  const fetchTestimonials = async () => {
    try {
      const res = await api.get('/testimonials');
      setTestimonials(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch testimonials');
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      toast.success('Testimonial deleted');
      fetchTestimonials();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <section className="relative mx-auto" style={{ maxWidth: 1200, paddingTop: 40, paddingBottom: 120 }}>
      <div className="text-center px-[18px]" style={{ marginBottom: 50 }}>
        <div
          ref={eyebrow.ref}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
          style={{
            ...eyebrow.style,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.2)',
            color: '#22c55e',
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            marginBottom: 16,
          }}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Member Success
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <h2
            ref={heading.ref}
            className="m-0"
            style={{
              ...heading.style,
              fontSize: 'clamp(32px,4vw,48px)',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#fff',
              lineHeight: 1.1,
            }}
          >
            What they say <em className="accent-italic" style={{ color: '#22c55e' }}>about us</em>
          </h2>
          
          {isAdmin && (
            <button
              onClick={() => {
                setEditingTestimonial(null);
                setIsModalOpen(true);
              }}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-full transition-colors font-semibold"
            >
              <Plus size={18} />
              Add Testimonial
            </button>
          )}
        </div>
      </div>

      <div className="w-full px-[18px] md:px-10 overflow-hidden">
        {testimonials.length > 0 ? (
          <div className="flex flex-nowrap md:flex-wrap lg:flex-nowrap gap-[24px] overflow-x-auto snap-x snap-mandatory pb-8 pt-2 scrollbar-hide" style={{ scrollBehavior: 'smooth' }}>
            {testimonials.map((item, i) => (
              <TestimonialCard 
                key={item._id || i} 
                item={item} 
                delay={i * 100} 
                isAdmin={isAdmin}
                onEdit={(t) => {
                  setEditingTestimonial(t);
                  setIsModalOpen(true);
                }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-white/40">
            No testimonials available.
          </div>
        )}
      </div>

      <TestimonialModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTestimonial(null);
        }}
        testimonial={editingTestimonial}
        onSaved={fetchTestimonials}
      />
    </section>
  );
}
