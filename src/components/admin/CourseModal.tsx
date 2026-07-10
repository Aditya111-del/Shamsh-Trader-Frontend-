import { useState, useEffect } from 'react';
import { X, Upload, Save, Trash, Plus, Minus } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export interface CourseData {
  _id?: string;
  title: string;
  description: string;
  level: string;
  levelColor: string;
  image: string;
  meta: string;
  price: string;
  externalLink: string;
  isFlagship: boolean;
  includes: string[];
  delay: number;
}

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: CourseData | null;
  onSaved: () => void;
}

export default function CourseModal({ isOpen, onClose, course, onSaved }: CourseModalProps) {
  const [formData, setFormData] = useState<CourseData>({
    title: '',
    description: '',
    level: 'Beginner',
    levelColor: '#22c55e',
    image: '',
    meta: '',
    price: '',
    externalLink: '',
    isFlagship: false,
    includes: [],
    delay: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (course) {
      setFormData(course);
    } else {
      setFormData({
        title: '',
        description: '',
        level: 'Beginner',
        levelColor: '#22c55e',
        image: '',
        meta: '',
        price: '',
        externalLink: '',
        isFlagship: false,
        includes: [],
        delay: 0,
      });
    }
  }, [course, isOpen]);

  const handleLevelChange = (level: string) => {
    const colorMap: Record<string, string> = {
      Beginner: '#22c55e',
      Intermediate: '#eab308',
      Advanced: '#ef4444',
    };
    setFormData({ ...formData, level, levelColor: colorMap[level] || '#22c55e' });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file); // Use 'file' for local upload endpoint

    try {
      setIsUploading(true);
      const res = await api.post('/upload/file', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, image: res.data.url }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddInclude = () => {
    setFormData((prev) => ({ ...prev, includes: [...prev.includes, ''] }));
  };

  const handleUpdateInclude = (index: number, value: string) => {
    const newIncludes = [...formData.includes];
    newIncludes[index] = value;
    setFormData((prev) => ({ ...prev, includes: newIncludes }));
  };

  const handleRemoveInclude = (index: number) => {
    const newIncludes = formData.includes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, includes: newIncludes }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (course?._id) {
        await api.put(`/courses/${course._id}`, formData);
        toast.success('Course updated');
      } else {
        await api.post('/courses', formData);
        toast.success('Course created');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-[#0f1115] border border-white/10 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold text-white mb-8">
          {course ? 'Edit Course' : 'Create Course'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Level</label>
              <select
                value={formData.level}
                onChange={(e) => handleLevelChange(e.target.value)}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-2">Description</label>
              <textarea
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Meta (e.g. 24 lessons · 6h)</label>
              <input
                type="text"
                required
                value={formData.meta}
                onChange={(e) => setFormData({ ...formData, meta: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Price (e.g. $99)</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/60 mb-2">External Course Link (Gumroad, etc.)</label>
              <input
                type="url"
                required
                value={formData.externalLink}
                onChange={(e) => setFormData({ ...formData, externalLink: e.target.value })}
                placeholder="https://"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-3 text-white">
              <input
                type="checkbox"
                checked={formData.isFlagship}
                onChange={(e) => setFormData({ ...formData, isFlagship: e.target.checked })}
                className="w-5 h-5 accent-green-500 rounded bg-white/5 border-white/10"
              />
              <span className="font-medium">Mark as Flagship Program</span>
            </label>
          </div>

          {formData.isFlagship && (
            <div className="space-y-4 bg-white/5 p-4 rounded-lg border border-white/10">
              <label className="block text-sm font-medium text-white/60 mb-2">Flagship Bullet Points (Includes)</label>
              {formData.includes.map((inc, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={inc}
                    onChange={(e) => handleUpdateInclude(i, e.target.value)}
                    className="flex-1 bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveInclude(i)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddInclude}
                className="flex items-center text-green-500 text-sm hover:text-green-400 mt-2"
              >
                <Plus size={16} className="mr-1" /> Add Bullet Point
              </button>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Course Cover Image</label>
            {formData.image ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-white/10 group">
                <img src={formData.image} alt="Course cover" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: '' })}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash size={20} />
                  </button>
                </div>
              </div>
            ) : (
              <label className="cursor-pointer flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-white/20 rounded-xl hover:border-green-500/50 hover:bg-white/5 transition-all">
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-white/40" />
                  <span className="text-sm text-white/60">
                    {isUploading ? 'Uploading...' : 'Click to upload Cover Image (JPG, PNG)'}
                  </span>
                </div>
              </label>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving || isUploading || !formData.image}
              className="flex items-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
