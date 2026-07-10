import { useState } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { useTilt } from '../../hooks/useTilt';
import { type CourseData } from '../../components/admin/CourseModal';
import { Edit2, Trash2 } from 'lucide-react';

interface CourseGridProps {
  courses: CourseData[];
  isAdmin: boolean;
  onEdit: (course: CourseData) => void;
  onDelete: (id: string) => void;
}

function CourseCard({ course, isAdmin, onEdit, onDelete }: { course: CourseData; isAdmin: boolean; onEdit: (c: CourseData) => void; onDelete: (id: string) => void }) {
  const { ref: revealRef, style: revealStyle } = useReveal<HTMLAnchorElement>({ delay: course.delay || 0 });
  const tiltRef = useTilt<HTMLAnchorElement>(3);
  const [hovered, setHovered] = useState(false);

  const backendUrl = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || '';
  const imageUrl = course.image?.startsWith('http') ? course.image : `${backendUrl}${course.image}`;

  return (
    <div className="relative group">
      {isAdmin && (
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
      <a
        ref={(el) => {
          revealRef.current = el;
          tiltRef.current = el;
        }}
        href={course.externalLink || '#'}
        target="_blank"
        rel="noreferrer"
        className="flex flex-col overflow-hidden h-full"
        style={{
          borderRadius: 22,
          border: `1px solid ${hovered ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          transition: 'border-color .4s, transform .5s cubic-bezier(.16,1,.3,1), opacity .9s',
          ...revealStyle,
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <span className="relative block overflow-hidden" style={{ height: 170 }}>
          <img
            src={imageUrl}
            alt={course.title}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: hovered ? 'grayscale(0) brightness(0.9)' : 'grayscale(0.4) brightness(0.7)',
              transform: hovered ? 'scale(1.05)' : 'scale(1)',
              transition: 'filter .6s, transform .8s cubic-bezier(.16,1,.3,1)',
            }}
          />
          <span
            style={{
              position: 'absolute',
              top: 14,
              left: 14,
              padding: '5px 12px',
              borderRadius: 999,
              background: 'rgba(10,10,10,0.7)',
              border: `1px solid ${course.levelColor}66`,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: course.levelColor,
              backdropFilter: 'blur(8px)',
            }}
          >
            {course.level}
          </span>
        </span>
        <span className="flex flex-col flex-1" style={{ padding: 26 }}>
          <span
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '-0.01em',
              marginBottom: 8,
            }}
          >
            {course.title}
          </span>
          <span
            style={{
              fontSize: 13.5,
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 300,
            }}
          >
            {course.description}
          </span>
          <span
            className="flex justify-between items-center"
            style={{ marginTop: 'auto', paddingTop: 20 }}
          >
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{course.meta}</span>
            <span style={{ fontSize: 17, fontWeight: 800, color: '#22c55e' }}>{course.price}</span>
          </span>
        </span>
      </a>
    </div>
  );
}

export default function CourseGrid({ courses = [], isAdmin = false, onEdit, onDelete }: CourseGridProps) {
  return (
    <section className="relative mx-auto px-[18px] md:px-10" style={{ maxWidth: 1200, paddingBottom: 130 }}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <CourseCard
            key={course._id || course.title}
            course={course}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
      {courses.length === 0 && (
        <div className="text-center py-20 text-white/40">
          No courses available.
        </div>
      )}
    </section>
  );
}
