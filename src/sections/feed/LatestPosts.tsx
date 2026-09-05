import { type ReactNode, useState, useEffect } from 'react';
import { useReveal } from '../../hooks/useReveal';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import CommunityModal, { type CommunityPostData } from '../../components/admin/CommunityModal';
import api, { getImageUrl } from '../../lib/api';
import { toast } from 'sonner';

const YOUTUBE_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="#ef4444">
    <path d="M23 7.2s-.2-1.6-.9-2.3c-.9-.9-1.9-.9-2.4-1C16.4 3.6 12 3.6 12 3.6s-4.4 0-7.7.3c-.5.1-1.5.1-2.4 1-.7.7-.9 2.3-.9 2.3S.8 9.1.8 11v1.8c0 1.9.2 3.8.2 3.8s.2 1.6.9 2.3c.9.9 2 .9 2.5 1 1.8.2 7.6.3 7.6.3s4.4 0 7.7-.3c.5-.1 1.5-.1 2.4-1 .7-.7.9-2.3.9-2.3s.2-1.9.2-3.8V11c0-1.9-.2-3.8-.2-3.8zM9.8 15.1V8.3l6.4 3.4-6.4 3.4z" />
  </svg>
);

const X_ICON = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#60a5fa">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const INSTAGRAM_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#ec4899" strokeWidth={2}>
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <circle cx="12" cy="12" r="4" />
  </svg>
);

const PLATFORM_CONFIG: Record<string, { color: string; icon: ReactNode }> = {
  YouTube: { color: '#ef4444', icon: YOUTUBE_ICON },
  X: { color: '#60a5fa', icon: X_ICON },
  Instagram: { color: '#ec4899', icon: INSTAGRAM_ICON },
};

function PostCard({ 
  post, 
  isAdmin, 
  onEdit, 
  onDelete 
}: { 
  post: CommunityPostData; 
  isAdmin: boolean;
  onEdit: (post: CommunityPostData) => void;
  onDelete: (id: string) => void;
}) {
  const { ref, style } = useReveal<HTMLAnchorElement>({ delay: post.delay || 0 });
  const [hovered, setHovered] = useState(false);
  const [imgHovered, setImgHovered] = useState(false);

  const config = PLATFORM_CONFIG[post.platform] || { color: '#fff', icon: null };
  const imageUrl = getImageUrl(post.image) || '/images/capability-3.jpg';

  return (
    <div className="relative group">
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.preventDefault();
              onEdit(post);
            }}
            className="p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-sm border border-white/10"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              post._id && onDelete(post._id);
            }}
            className="p-2 bg-black/60 hover:bg-red-500/20 text-red-400 rounded-full backdrop-blur-sm border border-white/10"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
      <a
        ref={ref}
        href={post.link || '#'}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="flex flex-col overflow-hidden h-full"
        style={{
          ...style,
          borderRadius: 20,
          background: '#0f1115',
          border: `1px solid ${hovered ? 'rgba(34,197,94,0.4)' : 'rgba(255,255,255,0.08)'}`,
          boxShadow: hovered 
            ? '0 0 20px rgba(34,197,94,0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
            : '0 10px 30px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          transition: 'border-color .4s, box-shadow .4s, transform .5s cubic-bezier(.16,1,.3,1)',
          transform: hovered && style.opacity === 1 ? 'translateY(-6px)' : style.transform,
        }}
      >
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
        {post.type === 'media' && (
          <span className="relative block overflow-hidden" style={{ height: 190 }}>
            <img
              src={imageUrl}
              alt={post.title}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('maxresdefault.jpg')) {
                  target.src = target.src.replace('maxresdefault.jpg', 'hqdefault.jpg');
                } else {
                  target.src = '/images/capability-3.jpg';
                }
              }}
              onMouseEnter={() => setImgHovered(true)}
              onMouseLeave={() => setImgHovered(false)}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'brightness(0.7)',
                transition: 'transform .8s cubic-bezier(.16,1,.3,1)',
                transform: imgHovered ? 'scale(1.05)' : 'scale(1)',
              }}
            />
            {post.playButton && (
              <span
                className="absolute flex items-center justify-center"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  width: 54,
                  height: 54,
                  borderRadius: 999,
                  background: 'rgba(239,68,68,0.9)',
                  boxShadow: '0 0 30px rgba(239,68,68,0.5)',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
                  <polygon points="7 4 21 12 7 20 7 4" />
                </svg>
              </span>
            )}
            {post.duration && (
              <span
                className="absolute"
                style={{
                  bottom: 12,
                  right: 12,
                  padding: '4px 10px',
                  borderRadius: 8,
                  background: 'rgba(0,0,0,0.75)',
                  fontSize: 11,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                {post.duration}
              </span>
            )}
          </span>
        )}
        <span className="flex flex-col flex-1" style={{ padding: 24 }}>
          <span
            className="flex items-center"
            style={{
              gap: 8,
              fontSize: 11,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: config.color,
              fontWeight: 700,
              marginBottom: post.type === 'quote' ? 14 : 10,
            }}
          >
            {config.icon}
            {post.platform} &middot; {post.time}
          </span>
          {post.type === 'media' ? (
            <>
              <span style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.3, color: '#fff', marginBottom: 8 }}>
                {post.title}
              </span>
              <span style={{ marginTop: 'auto', paddingTop: 14, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                {post.meta}
              </span>
            </>
          ) : (
            <>
              <span
                className="accent-italic"
                style={{ fontSize: 18, lineHeight: 1.55, color: 'rgba(255,255,255,0.85)' }}
              >
                {post.quote}
              </span>
              <span
                className="flex"
                style={{ marginTop: 'auto', paddingTop: 18, gap: 18, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}
              >
                {post.stats?.map((s) => (
                  <span key={s}>{s}</span>
                ))}
              </span>
            </>
          )}
        </span>
      </a>
    </div>
  );
}

export default function LatestPosts() {
  const { ref: headingRef, style: headingStyle } = useReveal<HTMLHeadingElement>();
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  const [posts, setPosts] = useState<CommunityPostData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<CommunityPostData | null>(null);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch community posts');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await api.delete(`/community/${id}`);
      toast.success('Post deleted');
      fetchPosts();
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete post');
    }
  };

  return (
    <section className="relative mx-auto" style={{ maxWidth: 1200, padding: '0 40px 110px' }}>
      <div className="flex justify-between items-end mb-10">
        <h2
          ref={headingRef}
          className="m-0"
          style={{
            ...headingStyle,
            fontSize: 'clamp(26px,2.8vw,38px)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            color: '#fff',
          }}
        >
          Latest from the <em className="accent-italic" style={{ color: '#22c55e' }}>community</em>
        </h2>
        
        {isAdmin && (
          <button
            onClick={() => {
              setEditingPost(null);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-500 border border-green-500/30 rounded-full transition-colors font-semibold"
          >
            <Plus size={18} />
            Add Post
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3" style={{ gap: 24 }}>
        {posts.map((post) => (
          <PostCard
            key={post._id || post.link}
            post={post}
            isAdmin={isAdmin}
            onEdit={(p) => {
              setEditingPost(p);
              setIsModalOpen(true);
            }}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-20 text-white/40">
          No community posts available.
        </div>
      )}

      <CommunityModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPost(null);
        }}
        post={editingPost}
        onSaved={fetchPosts}
      />
    </section>
  );
}
