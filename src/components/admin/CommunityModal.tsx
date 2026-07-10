import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export interface CommunityPostData {
  _id?: string;
  platform: 'YouTube' | 'X' | 'Instagram';
  type: 'media' | 'quote';
  link: string;
  image?: string;
  title?: string;
  quote?: string;
  meta?: string;
  stats?: string[];
  playButton?: boolean;
  duration?: string;
  time?: string;
  delay?: number;
}

interface CommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: CommunityPostData | null;
  onSaved: () => void;
}

export default function CommunityModal({ isOpen, onClose, post, onSaved }: CommunityModalProps) {
  const [formData, setFormData] = useState<CommunityPostData>({
    platform: 'YouTube',
    type: 'media',
    link: '',
    image: '',
    title: '',
    quote: '',
    meta: '',
    stats: [],
    playButton: false,
    duration: '',
    time: '',
    delay: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [statsInput, setStatsInput] = useState('');

  useEffect(() => {
    if (post) {
      setFormData(post);
      setStatsInput(post.stats?.join(', ') || '');
    } else {
      setFormData({
        platform: 'YouTube',
        type: 'media',
        link: '',
        image: '',
        title: '',
        quote: '',
        meta: '',
        stats: [],
        playButton: false,
        duration: '',
        time: '',
        delay: 0,
      });
      setStatsInput('');
    }
  }, [post, isOpen]);

  // Extract YouTube ID and set thumbnail
  const extractYouTubeThumbnail = (url: string) => {
    try {
      const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i;
      const match = url.match(regex);
      if (match && match[1]) {
        return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
      }
    } catch (e) {
      console.error(e);
    }
    return '';
  };

  const handleLinkChange = async (url: string) => {
    setFormData((prev) => ({ ...prev, link: url }));

    if (formData.platform === 'YouTube' && formData.type === 'media' && url) {
      const thumb = extractYouTubeThumbnail(url);
      
      let newTitle = formData.title;
      let newDuration = formData.duration;
      let newImage = formData.image || thumb;

      try {
        toast.info('Fetching YouTube details...');
        const res = await api.get(`/community/yt-meta?url=${encodeURIComponent(url)}`);
        if (res.data.title) newTitle = res.data.title;
        if (res.data.duration) newDuration = res.data.duration;
        toast.success('YouTube details fetched!');
      } catch (error) {
        console.error('Failed to fetch YouTube meta', error);
      }

      setFormData((prev) => ({
        ...prev,
        link: url,
        image: newImage,
        title: newTitle,
        duration: newDuration,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const dataToSave = { ...formData, stats: statsInput.split(',').map((s) => s.trim()).filter(Boolean) };
      if (post?._id) {
        await api.put(`/community/${post._id}`, dataToSave);
        toast.success('Post updated');
      } else {
        await api.post('/community', dataToSave);
        toast.success('Post created');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save post');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-2xl p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-8">
          {post ? 'Edit Community Post' : 'Add Community Post'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Platform</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="YouTube">YouTube</option>
                <option value="X">X (Twitter)</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="media">Media (Video/Image)</option>
                <option value="quote">Quote (Text)</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-2">Link (URL)</label>
              <input
                type="url"
                required
                value={formData.link}
                onChange={(e) => handleLinkChange(e.target.value)}
                placeholder="https://..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Time (e.g. 2 days ago)</label>
              <input
                type="text"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Delay (ms)</label>
              <input
                type="number"
                value={formData.delay}
                onChange={(e) => setFormData({ ...formData, delay: parseInt(e.target.value) || 0 })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            {formData.type === 'media' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Image URL (Auto-fetched for YouTube)</label>
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Meta (e.g. 84K views)</label>
                  <input
                    type="text"
                    value={formData.meta}
                    onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="flex items-center space-x-3 text-white mt-8">
                    <input
                      type="checkbox"
                      checked={formData.playButton}
                      onChange={(e) => setFormData({ ...formData, playButton: e.target.checked })}
                      className="w-5 h-5 accent-green-500 rounded bg-white/5 border-white/10"
                    />
                    <span className="font-medium">Show Play Button</span>
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-2">Duration (e.g. 18:24)</label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                {formData.image && (
                  <div className="md:col-span-2">
                    <img src={formData.image} alt="Preview" className="w-full h-40 object-cover rounded-lg border border-white/10" />
                  </div>
                )}
              </>
            )}

            {formData.type === 'quote' && (
              <>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/60 mb-2">Quote Content</label>
                  <textarea
                    rows={4}
                    value={formData.quote}
                    onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white/60 mb-2">Stats (Comma separated e.g. ♥ 2.4K, ↻ 618)</label>
                  <input
                    type="text"
                    value={statsInput}
                    onChange={(e) => setStatsInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
