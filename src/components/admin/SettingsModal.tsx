import { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import api from '../../lib/api';
import { toast } from 'sonner';

export interface SettingsData {
  telegramLink: string;
  youtubeLink: string;
  xLink: string;
  instagramLink: string;
  telegramStats: string;
  youtubeStats: string;
  xStats: string;
  instagramStats: string;
  marqueeBrands: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSaved }: SettingsModalProps) {
  const [formData, setFormData] = useState<SettingsData>({
    telegramLink: '',
    youtubeLink: '',
    xLink: '',
    instagramLink: '',
    telegramStats: '',
    youtubeStats: '',
    xStats: '',
    instagramStats: '',
    marqueeBrands: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      api.get('/settings').then(res => {
        if (res.data) setFormData(res.data);
      }).catch(err => {
        console.error(err);
        toast.error('Failed to load settings');
      });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await api.put('/settings', formData);
      toast.success('Settings updated');
      onSaved();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error('Failed to save settings');
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
          Edit Social Settings
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <h3 className="col-span-full text-lg font-semibold text-white/90 border-b border-white/10 pb-2">Telegram</h3>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Stats (e.g., 15K)</label>
              <input
                type="text"
                value={formData.telegramStats}
                onChange={(e) => setFormData({ ...formData, telegramStats: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Link</label>
              <input
                type="url"
                value={formData.telegramLink}
                onChange={(e) => setFormData({ ...formData, telegramLink: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <h3 className="col-span-full text-lg font-semibold text-white/90 border-b border-white/10 pb-2 mt-2">YouTube</h3>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Stats (e.g., 128K)</label>
              <input
                type="text"
                value={formData.youtubeStats}
                onChange={(e) => setFormData({ ...formData, youtubeStats: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Link</label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => setFormData({ ...formData, youtubeLink: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <h3 className="col-span-full text-lg font-semibold text-white/90 border-b border-white/10 pb-2 mt-2">X (Twitter)</h3>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Stats (e.g., 42K)</label>
              <input
                type="text"
                value={formData.xStats}
                onChange={(e) => setFormData({ ...formData, xStats: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Link</label>
              <input
                type="url"
                value={formData.xLink}
                onChange={(e) => setFormData({ ...formData, xLink: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <h3 className="col-span-full text-lg font-semibold text-white/90 border-b border-white/10 pb-2 mt-2">Instagram</h3>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Stats (e.g., 86K)</label>
              <input
                type="text"
                value={formData.instagramStats}
                onChange={(e) => setFormData({ ...formData, instagramStats: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-2">Link</label>
              <input
                type="url"
                value={formData.instagramLink}
                onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
              />
            </div>

            <h3 className="col-span-full text-lg font-semibold text-white/90 border-b border-white/10 pb-2 mt-2">Partners / Marquee</h3>
            <div className="col-span-full">
              <label className="block text-sm font-medium text-white/60 mb-2">Partner Brands (comma-separated)</label>
              <textarea
                value={formData.marqueeBrands}
                onChange={(e) => setFormData({ ...formData, marqueeBrands: e.target.value })}
                className="w-full bg-[#181a1f] border border-white/10 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-green-500"
                rows={2}
                placeholder="Binance, TradingView, MetaTrader 5..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-white/10 mt-6">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center px-6 py-2.5 bg-green-500 hover:bg-green-600 text-black font-semibold rounded-lg transition-colors disabled:opacity-50"
            >
              <Save size={18} className="mr-2" />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
