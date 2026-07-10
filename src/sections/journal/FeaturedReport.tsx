import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Edit2 } from 'lucide-react';
import { useParallax } from '../../hooks/useParallax';
import api from '../../lib/api';
import FeaturedPostModal, { type FeaturedPostData } from '../../components/admin/FeaturedPostModal';
import { useAuth } from '../../contexts/AuthContext';

export default function FeaturedReport() {
  const { isAdmin } = useAuth();
  const imgRef = useParallax<HTMLImageElement>(0.1);

  const [posts, setPosts] = useState<FeaturedPostData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<FeaturedPostData | null>(null);

  const fetchPosts = async () => {
    try {
      const { data } = await api.get('/featured-posts');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch top reports:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev === 0 ? 1 : 0));
    }, 8000);
    return () => clearInterval(interval);
  }, [posts.length]);

  if (posts.length === 0) {
    return null; // or a skeleton loader
  }

  const activePost = posts[activeIndex];
  const isExternal = activePost.type === 'FEATURED' && activePost.externalLink && activePost.externalLink.startsWith('http');

  const content = (
    <>
      <div className="absolute" style={{ inset: '-12% 0' }}>
        <img
          key={activePost.image} // Force re-render of image for animation
          ref={imgRef}
          src={activePost.image}
          alt="Featured report"
          className="h-full w-full object-cover transition-opacity duration-1000"
          style={{ filter: 'brightness(0.55)', animation: 'fadeIn 1s ease-in-out' }}
        />
      </div>
      <span
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(100deg,rgba(10,10,10,0.9) 25%,rgba(10,10,10,0.25) 65%,transparent)',
        }}
      />
      <span className="absolute inline-flex items-center" style={{ top: 26, left: 28, gap: 10 }}>
        {activePost.type === 'FEATURED' ? (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(34,197,94,0.15)',
              border: '1px solid rgba(34,197,94,0.4)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: '#22c55e',
              backdropFilter: 'blur(8px)',
            }}
          >
            Featured
          </span>
        ) : (
          <span
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              background: 'rgba(10,10,10,0.6)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.7)',
              backdropFilter: 'blur(8px)',
            }}
          >
            Weekly Report
          </span>
        )}
      </span>
      <span
        key={activePost._id}
        className="absolute block transition-opacity duration-1000"
        style={{ left: 28, bottom: 30, right: 28, maxWidth: 640, animation: 'fadeSlideUp 0.8s ease forwards' }}
      >
        <span
          className="block"
          style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 600,
            marginBottom: 14,
          }}
        >
          {activePost.dateText} &middot; {activePost.readTime}
        </span>
        <span
          className="block"
          style={{
            fontSize: 'clamp(28px,3.4vw,46px)',
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.03em',
            color: '#fff',
            marginBottom: 14,
          }}
        >
          {activePost.title}
        </span>
        <span
          className="block"
          style={{
            fontSize: 15,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.65)',
            fontWeight: 300,
            maxWidth: 520,
          }}
        >
          {activePost.excerpt}
        </span>
        <span
          className="inline-flex items-center"
          style={{
            gap: 8,
            marginTop: 20,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#22c55e',
          }}
        >
          Read the report <ArrowRight size={14} strokeWidth={2.5} color="#22c55e" />
        </span>
      </span>

      {/* Edit button */}
      {isAdmin && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setPostToEdit(activePost);
            setIsEditModalOpen(true);
          }}
          className="absolute top-6 right-6 z-10 p-2 bg-black/50 hover:bg-black/80 rounded-full border border-white/10 text-white/70 hover:text-white transition-colors"
        >
          <Edit2 size={16} />
        </button>
      )}

      {/* Dots navigation */}
      {posts.length > 1 && (
        <div className="absolute bottom-6 right-8 flex gap-2">
          {posts.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.preventDefault(); setActiveIndex(i); }}
              className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? 'w-8 bg-green-500' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );

  return (
    <>
      <section className="relative mx-auto" style={{ maxWidth: 1200, padding: '0 40px 90px', animation: 'fadeSlideUp 1s ease forwards' }}>
        {isExternal ? (
          <a
            href={activePost.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="relative block group"
            style={{
              borderRadius: 26,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              minHeight: 480,
            }}
          >
            {content}
          </a>
        ) : (
          <Link
            to={(!activePost.externalLink || activePost.externalLink === '#') ? `/report/${activePost.type.toLowerCase()}` : activePost.externalLink}
            className="relative block group"
            style={{
              borderRadius: 26,
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.1)',
              minHeight: 480,
            }}
          >
            {content}
          </Link>
        )}
      </section>
      {isAdmin && postToEdit && (
        <FeaturedPostModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setPostToEdit(null);
          }}
          post={postToEdit}
          onSaved={() => {
            setIsEditModalOpen(false);
            setPostToEdit(null);
            fetchPosts();
          }}
        />
      )}
    </>
  );
}
