import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export interface EventData {
  _id?: string;
  type: 'UPCOMING' | 'ARCHIVE';
  title: string;
  description?: string;
  location?: string;
  date?: string;
  time?: string;
  images: string[];
  section?: string;
  ticketLink?: string;
  status: 'AVAILABLE' | 'FULL';
}

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: EventData | null;
  onSaved: () => void;
  type: 'UPCOMING' | 'ARCHIVE';
}

export default function EventModal({ isOpen, onClose, event, onSaved, type }: EventModalProps) {
  const [formData, setFormData] = useState<EventData>({
    type,
    title: '',
    description: '',
    location: '',
    date: '',
    time: '',
    images: [''],
    section: '',
    ticketLink: '',
    status: 'AVAILABLE',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        images: event.images && event.images.length > 0 ? event.images : [''],
      });
    } else {
      setFormData({
        type,
        title: '',
        description: '',
        location: '',
        date: '',
        time: '',
        images: [''],
        section: '',
        ticketLink: '',
        status: 'AVAILABLE',
      });
    }
  }, [event, type, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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
      
      setFormData((prev) => ({ ...prev, images: [res.data.url] }));
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
      // Construct payload explicitly to strip out UI-only React Node properties (like badgeIcon) 
      // that get merged in from the frontend mapped events and cause circular JSON errors.
      const payload = {
        _id: formData._id,
        type: formData.type,
        title: formData.title,
        description: formData.description,
        location: formData.location,
        date: formData.date,
        time: formData.time,
        images: formData.images.filter((url) => url.trim().length > 0),
        section: formData.section,
        ticketLink: formData.ticketLink,
        status: formData.status,
      };

      if (payload._id) {
        await api.put(`/events/${payload._id}`, payload);
        toast.success('Event updated successfully');
      } else {
        await api.post('/events', payload);
        toast.success('Event created successfully');
      }
      onSaved();
      onClose();
    } catch (error: any) {
      const msg = error.response?.data?.message
        || error.response?.data?.errors?.[0]?.message
        || 'Failed to save event';
      toast.error(msg);
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
            {event ? 'Edit Event' : 'Create New Event'} <span className="text-green-500 text-sm ml-2 font-normal">({type})</span>
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5 text-white/50 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-6 scrollbar-hide">
          <form id="event-form" onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={labelClass}>Title</label>
              <input required name="title" value={formData.title} onChange={handleChange} className={inputClass} placeholder="Event Title" />
            </div>

            <div>
              <label className={labelClass}>Cover Image</label>
              <div className="flex gap-4 items-center">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload} 
                  className="w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-500/20 file:text-green-500 hover:file:bg-green-500/30 transition-all cursor-pointer"
                  disabled={isUploading}
                />
                {isUploading && <span className="text-green-500 text-sm animate-pulse">Uploading...</span>}
              </div>
              {/* Live preview thumbnail */}
              {formData.images[0]?.trim() && (
                <div className="mt-3 rounded-xl overflow-hidden border border-white/10" style={{ maxHeight: 120 }}>
                  <img
                    src={formData.images[0]}
                    alt="Preview"
                    className="w-full object-cover"
                    style={{ maxHeight: 120 }}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              )}
            </div>

            {type === 'UPCOMING' && (
              <>
                <div>
                  <label className={labelClass}>Description</label>
                  <textarea rows={3} name="description" value={formData.description || ''} onChange={handleChange} className={inputClass} placeholder="Short description..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Location (e.g. Zoom, Mumbai)</label>
                    <input name="location" value={formData.location || ''} onChange={handleChange} className={inputClass} placeholder="Location" />
                  </div>
                  <div>
                    <label className={labelClass}>Date (YYYY-MM-DD)</label>
                    <input type="date" name="date" value={formData.date ? formData.date.split('T')[0] : ''} onChange={handleChange} className={inputClass} />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Time</label>
                    <input name="time" value={formData.time || ''} onChange={handleChange} className={inputClass} placeholder="10:00 - 18:00" />
                  </div>
                  <div className="col-span-2">
                    <label className={labelClass}>Ticket Portal Link</label>
                    <input name="ticketLink" value={formData.ticketLink || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Availability Status</label>
                  <select name="status" value={formData.status} onChange={handleChange} className={inputClass}>
                    <option value="AVAILABLE">Available</option>
                    <option value="FULL">House Full</option>
                  </select>
                </div>
              </>
            )}

            {type === 'ARCHIVE' && (
              <div>
                <label className={labelClass}>Section / Year (e.g. "2025 · Delhi")</label>
                <input name="section" value={formData.section || ''} onChange={handleChange} className={inputClass} placeholder="Section Meta Info" />
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
            form="event-form" 
            disabled={isSaving || isUploading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold bg-green-500 hover:bg-green-400 text-black transition-colors disabled:opacity-50"
          >
            <Save size={16} />
            {isSaving ? 'Saving...' : (isUploading ? 'Wait for upload...' : 'Save Event')}
          </button>
        </div>
      </div>
    </div>
  );
}
