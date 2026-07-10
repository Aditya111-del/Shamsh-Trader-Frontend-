import { useState, useEffect } from 'react';
import { X, Upload, Save, Trash } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export interface BotData {
  _id?: string;
  name: string;
  tag: string;
  tagColor: string;
  sparkline: string;
  monthly: string;
  winRate: string;
  maxDD: string;
  price: string;
  fileUrl: string;
  isFlagship: boolean;
  description?: string;
  totalEquity?: string;
}

interface BotModalProps {
  isOpen: boolean;
  onClose: () => void;
  bot: BotData | null;
  onSaved: () => void;
}

const PRESET_SPARKLINES = {
  Upward: 'M0,50 L26,44 L52,48 L78,36 L104,40 L130,26 L156,32 L182,18 L208,24 L240,8',
  Volatile: 'M0,52 L26,48 L52,40 L78,44 L104,30 L130,36 L156,22 L182,28 L208,14 L240,10',
  Steady: 'M0,48 L26,50 L52,42 L78,46 L104,34 L130,38 L156,30 L182,20 L208,26 L240,12',
};

export default function BotModal({ isOpen, onClose, bot, onSaved }: BotModalProps) {
  const [formData, setFormData] = useState<BotData>({
    name: '',
    tag: 'Crypto',
    tagColor: '#eab308',
    sparkline: PRESET_SPARKLINES.Upward,
    monthly: '',
    winRate: '',
    maxDD: '',
    price: '',
    fileUrl: '',
    isFlagship: false,
    description: '',
    totalEquity: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (bot) {
      setFormData(bot);
    } else {
      setFormData({
        name: '',
        tag: 'Crypto',
        tagColor: '#eab308',
        sparkline: PRESET_SPARKLINES.Upward,
        monthly: '',
        winRate: '',
        maxDD: '',
        price: '',
        fileUrl: '',
        isFlagship: false,
        description: '',
        totalEquity: '',
      });
    }
  }, [bot, isOpen]);

  const handleTagChange = (tag: string) => {
    const colorMap: Record<string, string> = {
      Crypto: '#eab308',
      Indices: '#60a5fa',
      Forex: '#22c55e',
    };
    setFormData({ ...formData, tag, tagColor: colorMap[tag] || '#22c55e' });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setIsUploading(true);
      const res = await api.post('/upload/file', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setFormData((prev) => ({ ...prev, fileUrl: res.data.url }));
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (bot?._id) {
        await api.put(`/bots/${bot._id}`, formData);
        toast.success('Bot updated');
      } else {
        await api.post('/bots', formData);
        toast.success('Bot created');
      }
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save bot');
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
          {bot ? 'Edit Bot' : 'Create Bot'}
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
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Tag (Category)</label>
              <select
                value={formData.tag}
                onChange={(e) => handleTagChange(e.target.value)}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              >
                <option value="Crypto">Crypto</option>
                <option value="Forex">Forex</option>
                <option value="Indices">Indices</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Monthly Return (e.g. +6.1%)</label>
              <input
                type="text"
                required
                value={formData.monthly}
                onChange={(e) => setFormData({ ...formData, monthly: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Win Rate (e.g. 74%)</label>
              <input
                type="text"
                required
                value={formData.winRate}
                onChange={(e) => setFormData({ ...formData, winRate: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Max Drawdown (e.g. -4.8%)</label>
              <input
                type="text"
                required
                value={formData.maxDD}
                onChange={(e) => setFormData({ ...formData, maxDD: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Price (e.g. $79/mo)</label>
              <input
                type="text"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Sparkline Chart Type</label>
            <select
              value={Object.keys(PRESET_SPARKLINES).find(k => PRESET_SPARKLINES[k as keyof typeof PRESET_SPARKLINES] === formData.sparkline) || 'Upward'}
              onChange={(e) => setFormData({ ...formData, sparkline: PRESET_SPARKLINES[e.target.value as keyof typeof PRESET_SPARKLINES] || formData.sparkline })}
              className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
            >
              <option value="Upward">Upward Trend</option>
              <option value="Volatile">Volatile Trend</option>
              <option value="Steady">Steady Trend</option>
            </select>
          </div>

          <div>
            <label className="flex items-center space-x-3 text-white">
              <input
                type="checkbox"
                checked={formData.isFlagship}
                onChange={(e) => setFormData({ ...formData, isFlagship: e.target.checked })}
                className="w-5 h-5 accent-green-500 rounded bg-white/5 border-white/10"
              />
              <span className="font-medium">Mark as Flagship Bot (Large Hero Display)</span>
            </label>
          </div>

          {formData.isFlagship && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Flagship Description</label>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-2">Total Equity (e.g. +132%)</label>
                <input
                  type="text"
                  value={formData.totalEquity || ''}
                  onChange={(e) => setFormData({ ...formData, totalEquity: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">Upload Bot File</label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-white/20 rounded-xl hover:border-green-500/50 hover:bg-white/5 transition-all">
                <input
                  type="file"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <div className="flex flex-col items-center space-y-2">
                  <Upload className="w-8 h-8 text-white/40" />
                  <span className="text-sm text-white/60">
                    {isUploading ? 'Uploading...' : 'Click to upload Bot File (.ex4, .zip, etc)'}
                  </span>
                </div>
              </label>
            </div>
            {formData.fileUrl && (
              <div className="mt-4 p-3 bg-white/5 rounded-lg flex items-center justify-between">
                <span className="text-sm text-white/80 font-medium truncate flex-1 mr-4">
                  File uploaded: {formData.fileUrl.split('/').pop()}
                </span>
                <button
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, fileUrl: '' }))}
                  className="p-1.5 hover:bg-red-500/20 text-red-400 rounded-md transition-colors"
                >
                  <Trash size={16} />
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10">
            <button
              type="submit"
              disabled={isSaving || isUploading || !formData.fileUrl}
              className="flex items-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Bot'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
