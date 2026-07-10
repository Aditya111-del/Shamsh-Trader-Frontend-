import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';
import RichTextEditor from './RichTextEditor';

export interface BlogData {
  _id?: string;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  categoryColor: string;
  readTime: string;
}

interface BlogModalProps {
  isOpen: boolean;
  onClose: () => void;
  blog: BlogData | null;
  onSaved: () => void;
}

export default function BlogModal({ isOpen, onClose, blog, onSaved }: BlogModalProps) {
  const [formData, setFormData] = useState<BlogData>({
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    categoryColor: '#22c55e',
    readTime: '5 min read',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (blog) {
      setFormData(blog);
    } else {
      setFormData({
        title: '',
        excerpt: '',
        content: '',
        image: '',
        category: '',
        categoryColor: '#22c55e',
        readTime: '5 min read',
      });
    }
  }, [blog, isOpen]);

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
      if (formData._id) {
        await api.put(`/blogs/${formData._id}`, formData);
        toast.success('Journal updated successfully');
      } else {
        await api.post('/blogs', formData);
        toast.success('Journal created successfully');
      }
      onSaved();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save journal');
    } finally {
      setIsSaving(false);
    }
  };

  const inputClass = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/50 transition-all";
  const labelClass = "block text-xs font-semibold tracking-wider uppercase text-white/50 mb-2";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-3xl bg-[#111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">
            {blog ? 'Edit Journal Entry' : 'Create New Journal'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 scrollbar-hide">
          <form id="blog-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Journal Title" />
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
              <label className={labelClass}>Excerpt (Short summary)</label>
              <textarea rows={2} required name="excerpt" value={formData.excerpt} onChange={handleChange} className={inputClass} placeholder="Short summary for the card..." />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClass}>Category</label>
                <select required name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                  <option value="" disabled>Select Category</option>
                  <option value="Markets">Markets</option>
                  <option value="Psychology">Psychology</option>
                  <option value="Playbooks">Playbooks</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Category Color</label>
                <input required name="categoryColor" value={formData.categoryColor} onChange={handleChange} className={inputClass} placeholder="#22c55e" />
              </div>
              <div>
                <label className={labelClass}>Read Time</label>
                <input required name="readTime" value={formData.readTime} onChange={handleChange} className={inputClass} placeholder="e.g. 5 min read" />
              </div>
            </div>

            <div>
              <label className={labelClass}>Full Content (WYSIWYG Rich Text Editor)</label>
              <RichTextEditor
                value={formData.content}
                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-full text-sm font-medium text-white/70 hover:bg-white/5 transition-colors">
            Cancel
          </button>
          <button 
            type="submit" 
            form="blog-form" 
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-green-500 hover:bg-green-400 text-black transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : (isUploading ? 'Wait for upload...' : 'Save Journal')}
          </button>
        </div>
      </div>
    </div>
  );
}
