import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useReveal } from '../../hooks/useReveal';
import BlogModal, { type BlogData } from '../../components/admin/BlogModal';
import FeaturedPostModal, { type FeaturedPostData } from '../../components/admin/FeaturedPostModal';
import { toast } from 'sonner';

interface Post {
  _id: string;
  slug: string;
  image: string;
  category: string;
  categoryColor: string;
  title: string;
  excerpt: string;
  content: string;
  readTime: string;
  delay?: number;
}

interface BackendBlog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: string;
  categoryColor: string;
  readTime: string;
  createdAt: string;
}

const POSTS: Post[] = [
  {
    _id: 'static-1',
    slug: 'the-3-touch-range-model-fully-mapped',
    image: '/images/capability-4.jpg',
    category: 'Playbooks · Jul 2026',
    categoryColor: '#38bdf8',
    title: 'The 3-touch range model, fully mapped',
    excerpt: 'Entry criteria, invalidation logic and 40 annotated examples across horizontal liquidity levels.',
    content: 'Full content coming soon...',
    readTime: '8 min read',
  },
  {
    _id: 'static-2',
    slug: 'discipline-problem-sizing-problem',
    image: '/images/capability-3.jpg',
    category: 'Psychology · Jun 2026',
    categoryColor: '#c084fc',
    title: "You don't have a discipline problem. You have a sizing problem.",
    excerpt: 'Why every tilt episode traces back to one number — and how to fix it structurally.',
    content: 'Full content coming soon...',
    readTime: '6 min read',
    delay: 90,
  },
  {
    _id: 'static-3',
    slug: 'btc-halving-cycles-what-actually-repeats',
    image: '/images/research-2.jpg',
    category: 'Crypto · Jun 2026',
    categoryColor: '#eab308',
    title: 'BTC halving cycles: what actually repeats',
    excerpt: 'Separating the statistically real patterns from the Twitter mythology, with real orderflow data.',
    content: 'Full content coming soon...',
    readTime: '14 min read',
    delay: 180,
  },
  {
    _id: 'static-4',
    slug: 'reading-india-vix-nifty-like-a-market-maker',
    image: '/images/capability-2.jpg',
    category: 'Indian Markets · May 2026',
    categoryColor: '#22c55e',
    title: 'Reading India VIX & Nifty like a market maker',
    excerpt: "Volatility and index momentum drive Indian market swings. Here's the institutional weekly framework.",
    content: 'Full content coming soon...',
    readTime: '7 min read',
    delay: 90,
  },
  {
    _id: 'static-5',
    slug: 'ethereum-altcoin-liquidity-cycles',
    image: '/images/research-4.jpg',
    category: 'Crypto · May 2026',
    categoryColor: '#eab308',
    title: 'Ethereum & Altcoin liquidity cycles: structural positioning',
    excerpt: 'Understanding rotational capital flow from Bitcoin dominance into Layer-1 ecosystems.',
    content: 'Full content coming soon...',
    readTime: '10 min read',
  },
  {
    _id: 'static-6',
    slug: 'bank-nifty-options-orb-strategy',
    image: '/images/capability-1.jpg',
    category: 'Indian Markets · Apr 2026',
    categoryColor: '#22c55e',
    title: 'Bank Nifty weekly options: opening range breakout rules',
    excerpt: 'Precise execution triggers, delta neutrality and stop-loss placement for index day-traders.',
    content: 'Full content coming soon...',
    readTime: '9 min read',
    delay: 90,
  },
  {
    _id: 'static-7',
    slug: 'the-90-day-journal-protocol',
    image: '/images/research-1.jpg',
    category: 'Psychology · Apr 2026',
    categoryColor: '#c084fc',
    title: 'The 90-day systematic journal protocol',
    excerpt: 'The exact quantitative review template professional prop traders use daily.',
    content: 'Full content coming soon...',
    readTime: '5 min read',
    delay: 180,
  },
];

function PostCard({ post, isAdmin, onEdit, onDelete }: { post: Post, isAdmin: boolean, onEdit: (e: BlogData) => void, onDelete: (id: string) => void }) {
  const { ref, style } = useReveal<HTMLAnchorElement>({ delay: post.delay ?? 0 });

  return (
    <Link
      ref={ref}
      to={`/blog/${post.slug}`}
      className="group flex flex-col relative"
      style={{
        ...style,
        borderRadius: 20,
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.08)',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(12px)',
        transition: 'border-color .4s, transform .5s cubic-bezier(.16,1,.3,1), opacity .9s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)';
        e.currentTarget.style.transform = 'translateY(-6px)';
        const img = e.currentTarget.querySelector('img');
        if (img) {
          img.style.filter = 'grayscale(0) brightness(0.9)';
          img.style.transform = 'scale(1.05)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)';
        e.currentTarget.style.transform = style.transform ?? 'none';
        const img = e.currentTarget.querySelector('img');
        if (img) {
          img.style.filter = 'grayscale(0.5) brightness(0.75)';
          img.style.transform = 'scale(1)';
        }
      }}
    >
      {isAdmin && (
        <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.preventDefault(); onEdit(post as unknown as BlogData); }}
            className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md border border-white/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
          <button
            onClick={(e) => { 
              e.preventDefault(); 
              if(window.confirm('Delete this journal?')) onDelete(post._id);
            }}
            className="bg-red-500/10 hover:bg-red-500/20 p-2 rounded-full backdrop-blur-md border border-red-500/20 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
          </button>
        </div>
      )}
      <span className="relative block overflow-hidden" style={{ height: 180 }}>
        <img
          src={post.image}
          alt=""
          className="h-full w-full"
          style={{
            objectFit: 'cover',
            filter: 'grayscale(0.5) brightness(0.75)',
            transition: 'filter .6s, transform .8s cubic-bezier(.16,1,.3,1)',
          }}
        />
      </span>
      <span className="flex flex-1 flex-col" style={{ padding: 26 }}>
        <span
          style={{
            fontSize: 11,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: post.categoryColor,
            fontWeight: 700,
            marginBottom: 12,
          }}
        >
          {post.category}
        </span>
        <span
          style={{
            fontSize: 19,
            fontWeight: 800,
            lineHeight: 1.25,
            letterSpacing: '-0.01em',
            color: '#fff',
            marginBottom: 10,
          }}
        >
          {post.title}
        </span>
        <span
          style={{
            fontSize: 13.5,
            lineHeight: 1.6,
            color: 'rgba(255,255,255,0.5)',
            fontWeight: 300,
          }}
        >
          {post.excerpt}
        </span>
        <span
          className="mt-auto"
          style={{ paddingTop: 18, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}
        >
          {post.readTime}
        </span>
      </span>
    </Link>
  );
}

export default function PostGrid() {
  const { isAdmin } = useAuth();
  const [dbPosts, setDbPosts] = useState<BackendBlog[]>([]);
  const [loading, setLoading] = useState(true);

  // Admin Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBlogToEdit, setCurrentBlogToEdit] = useState<BlogData | null>(null);

  const [isFeaturedModalOpen, setIsFeaturedModalOpen] = useState(false);
  const [currentFeaturedToEdit, setCurrentFeaturedToEdit] = useState<FeaturedPostData | null>(null);

  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const fetchBlogs = async () => {
    try {
      const { data } = await api.get('/blogs');
      setDbPosts(data);
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blogData: BlogData) => {
    setCurrentBlogToEdit(blogData);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setCurrentBlogToEdit(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/blogs/${id}`);
      toast.success('Journal deleted');
      fetchBlogs();
    } catch (error) {
      toast.error('Failed to delete journal');
    }
  };

  const matchesCategory = (catStr: string = '') => {
    if (activeCategory === 'All') return true;
    const lower = catStr.toLowerCase();
    const activeLower = activeCategory.toLowerCase();
    if (activeLower === 'indian markets') return lower.includes('indian');
    if (activeLower === 'playbooks') return lower.includes('playbook');
    return lower.includes(activeLower);
  };

  let filteredDbPosts = dbPosts.filter(post => matchesCategory(post.category));

  let mappedPosts = filteredDbPosts.length > 0 ? filteredDbPosts.map((post, i) => {
    // Generate relative time for "2 days ago" logic
    const createdDate = new Date(post.createdAt);
    const diffDays = Math.floor((Date.now() - createdDate.getTime()) / (1000 * 3600 * 24));
    let timeAgo = `${diffDays} days ago`;
    if (diffDays === 0) timeAgo = 'Today';
    else if (diffDays === 1) timeAgo = 'Yesterday';

    return {
      slug: post.slug,
      image: post.image || '/images/capability-4.jpg',
      category: `${post.category} · ${timeAgo}`,
      categoryColor: post.categoryColor || '#22c55e',
      title: post.title,
      excerpt: post.excerpt,
      content: (post as any).content || '',
      readTime: post.readTime || '5 min read',
      delay: (i % 3) * 90,
      _id: post._id,
    };
  }) : POSTS.filter(post => matchesCategory(post.category));

  return (
    <section className="relative mx-auto" style={{ maxWidth: 1200, padding: '0 40px 110px' }}>
      {isAdmin && (
        <div className="flex justify-end gap-4 mb-8">
          <button 
            onClick={() => {
              setCurrentFeaturedToEdit({ type: 'FEATURED', title: '', excerpt: '', image: '', dateText: '', readTime: '', externalLink: '' });
              setIsFeaturedModalOpen(true);
            }} 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-white/20 text-white/50 text-xs font-semibold tracking-widest uppercase hover:border-purple-500/60 hover:text-purple-500 transition-colors"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Edit Top Reports · Admin
          </button>
          <button onClick={handleAdd} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-dashed border-white/20 text-white/50 text-xs font-semibold tracking-widest uppercase hover:border-green-500/60 hover:text-green-500 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Add Journal Entry · Admin
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 24 }}>
        {loading ? (
          <div className="col-span-3 text-center text-white/50 py-10">Loading journals...</div>
        ) : (
          mappedPosts.map((post) => (
            <PostCard key={post.slug || post._id} post={post as any} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDelete} />
          ))
        )}
      </div>
      
      {/* Blog Modal for Admin */}
      <BlogModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        blog={currentBlogToEdit}
        onSaved={fetchBlogs}
      />
      <FeaturedPostModal
        isOpen={isFeaturedModalOpen}
        onClose={() => setIsFeaturedModalOpen(false)}
        post={currentFeaturedToEdit}
        onSaved={() => {
          // Tell the page to reload the FeaturedReport section or just reload page
          window.location.reload();
        }}
      />
    </section>
  );
}
