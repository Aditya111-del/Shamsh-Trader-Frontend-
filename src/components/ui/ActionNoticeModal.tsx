import { useState } from 'react';
import { X, Sparkles, CheckCircle2, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface ActionNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  type?: 'coming-soon' | 'waiting-list';
  itemName?: string;
}

export default function ActionNoticeModal({
  isOpen,
  onClose,
  title,
  subtitle,
  type = 'coming-soon',
  itemName,
}: ActionNoticeModalProps) {
  const [hasJoined, setHasJoined] = useState(false);

  if (!isOpen) return null;

  const handleJoin = () => {
    setHasJoined(true);
    toast.success(`You've been added to the waiting list for ${itemName || 'this program'}!`);
  };

  const handleClose = () => {
    setHasJoined(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl border border-white/10 shadow-2xl bg-[#111111] overflow-hidden"
        style={{
          boxShadow: '0 0 50px rgba(34,197,94,0.15)',
        }}
      >
        {/* Glow accent */}
        <div 
          className="absolute -top-20 -right-20 w-48 h-48 rounded-full pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(34,197,94,0.25), transparent 70%)',
            filter: 'blur(30px)',
          }}
        />

        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            {type === 'coming-soon' ? <Clock size={20} /> : <Sparkles size={20} />}
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-green-400">
            {type === 'coming-soon' ? 'Coming Soon' : 'Exclusive Access'}
          </span>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          {title}
        </h3>

        {itemName && (
          <div className="inline-block px-3 py-1 mb-4 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-zinc-300">
            {itemName}
          </div>
        )}

        <p className="text-sm text-zinc-400 leading-relaxed mb-6">
          {subtitle || 'This feature is currently undergoing final security audits and performance stress-testing. Sign up for early access notification.'}
        </p>

        <div className="flex flex-col gap-3">
          {hasJoined ? (
            <div className="flex items-center justify-center gap-2 p-3.5 rounded-xl bg-green-500/15 border border-green-500/40 text-green-400 text-sm font-bold">
              <CheckCircle2 size={18} />
              Joined the Waiting List
            </div>
          ) : (
            <button
              onClick={handleJoin}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-lime-400 to-green-500 hover:opacity-95 shadow-[0_0_24px_rgba(34,197,94,0.3)] transition-all cursor-pointer"
            >
              Join the Waiting List
            </button>
          )}

          <button
            onClick={handleClose}
            className="w-full py-2.5 text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
