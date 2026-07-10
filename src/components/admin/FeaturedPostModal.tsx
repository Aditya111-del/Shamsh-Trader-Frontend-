import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';

export interface FeaturedPostData {
  _id?: string;
  type: 'WEEKLY' | 'FEATURED';
  title: string;
  excerpt: string;
  content?: string;
  image: string;
  category?: string;
  dateText: string;
  readTime: string;
  externalLink?: string;
}

interface FeaturedPostModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: FeaturedPostData | null;
  onSaved: () => void;
}

export default function FeaturedPostModal({ isOpen, onClose, post, onSaved }: FeaturedPostModalProps) {
  const [formData, setFormData] = useState<FeaturedPostData>({
    type: 'FEATURED',
    title: '',
    excerpt: '',
    image: '',
    dateText: '',
    readTime: '',
    externalLink: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (post) {
      setFormData(post);
    }
  }, [post, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const uploadData = new FormData();
      uploadData.append('image', file);

      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setFormData((prev) => ({ ...prev, image: res.data.url }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Image upload failed. Check Cloudinary keys.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await api.put(`/featured-posts/${formData.type}`, formData);
      toast.success('Top Report updated successfully');
      onSaved();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save report');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all";
  const labelClass = "block text-xs font-semibold tracking-wider uppercase text-white/50 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-2xl bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            Edit Top Report <span className="text-green-500 text-sm ml-2 font-normal">({formData.type})</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 scrollbar-hide">
          <form id="featured-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Report Type</label>
              <select name="type" value={formData.type} onChange={handleChange} className={inputClass} disabled>
                <option value="FEATURED">Featured Report</option>
                <option value="WEEKLY">Weekly Report</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Report Title" />
            </div>

            <div>
              <label className={labelClass}>Category (Optional)</label>
              <input name="category" value={formData.category || ''} onChange={handleChange} className={inputClass} placeholder="e.g. Playbooks · Jul 2026" />
            </div>

            <div>
              <label className={labelClass}>Cover Image URL (or upload)</label>
              <input 
                type="text" 
                name="image"
                value={formData.image} 
                onChange={handleChange}
                placeholder="Paste image URL here..."
                className={inputClass} 
              />
              <div className="mt-3 flex gap-4 items-center">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload} 
                  className="text-sm text-white/70 file:mr-4 file:py-1.5 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-green-500/20 file:text-green-500 hover:file:bg-green-500/30 transition-all cursor-pointer"
                  disabled={isUploading}
                />
                {isUploading && <span className="text-green-500 text-sm animate-pulse">Uploading...</span>}
              </div>
              {/* Live preview thumbnail */}
              {formData.image?.trim() && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10" style={{ maxHeight: 120 }}>
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full object-cover"
                    style={{ maxHeight: 120 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            <div>
              <label className={labelClass}>Excerpt (Short summary for card)</label>
              <textarea rows={2} required name="excerpt" value={formData.excerpt} onChange={handleChange} className={inputClass} placeholder="Short summary..." />
            </div>

            <div>
              <label className={labelClass}>Full Content (Optional for Featured Posts)</label>
              <RichTextEditor
                value={formData.content || ''}
                onChange={(val) => setFormData((prev) => ({ ...prev, content: val }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date Text (e.g. July 6, 2026)</label>
                <input required name="dateText" value={formData.dateText} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Read Time (e.g. 12 min read)</label>
                <input required name="readTime" value={formData.readTime} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            {formData.type === 'FEATURED' && (
              <div>
                <label className={labelClass}>External Link</label>
                <input name="externalLink" value={formData.externalLink || ''} onChange={handleChange} className={inputClass} placeholder="https://... or /blog/..." />
                <p className="text-white/40 text-xs mt-2">If provided, clicking this report will redirect the user to this link.</p>
              </div>
            )}
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-sm font-medium text-white/70 hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="featured-form" 
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-green-500 hover:bg-green-400 text-black transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : (isUploading ? 'Wait for upload...' : 'Save Report')}
          </button>
        </div>
      </div>
    </div>
  );
}
