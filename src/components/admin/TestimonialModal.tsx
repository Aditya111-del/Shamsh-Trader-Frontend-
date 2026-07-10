import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export interface TestimonialData {
  _id?: string;
  quote: string;
  initial?: string;
  name: string;
  meta?: string;
  link?: string;
  platform?: 'X' | 'Instagram' | 'None';
  delay?: number;
}

interface TestimonialModalProps {
  isOpen: boolean;
  onClose: () => void;
  testimonial: TestimonialData | null;
  onSaved: () => void;
}

export default function TestimonialModal({ isOpen, onClose, testimonial, onSaved }: TestimonialModalProps) {
  const [formData, setFormData] = useState<TestimonialData>({
    quote: '',
    initial: '',
    name: '',
    meta: '',
    link: '',
    platform: 'None',
    delay: 0,
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (testimonial) {
      setFormData(testimonial);
    } else {
      setFormData({
        quote: '',
        initial: '',
        name: '',
        meta: '',
        link: '',
        platform: 'None',
        delay: 0,
      });
    }
  }, [testimonial, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (testimonial?._id) {
        await api.put(`/testimonials/${testimonial._id}`, formData);
        toast.success('Testimonial updated');
      } else {
        await api.post('/testimonials', formData);
        toast.success('Testimonial created');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save testimonial');
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
          {testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Initial (Optional)</label>
              <input
                type="text"
                value={formData.initial}
                onChange={(e) => setFormData({ ...formData, initial: e.target.value })}
                placeholder="e.g. A (Auto-generates from Name)"
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-2">Quote</label>
              <textarea
                required
                rows={3}
                value={formData.quote}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Meta / Role (e.g. Crypto Trader)</label>
              <input
                type="text"
                value={formData.meta}
                onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Platform (Icon to display)</label>
              <select
                value={formData.platform}
                onChange={(e) => setFormData({ ...formData, platform: e.target.value as any })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="None">None</option>
                <option value="X">X (Twitter)</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-2">Link (URL to original post)</label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                placeholder="https://x.com/..."
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Testimonial'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
