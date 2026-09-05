import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, KeyRound, ExternalLink, ArrowRight } from 'lucide-react';

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDemoLogin: (email?: string, name?: string) => Promise<void>;
  isLoading?: boolean;
}

export const GoogleAuthModal: React.FC<GoogleAuthModalProps> = ({
  isOpen,
  onClose,
  onDemoLogin,
  isLoading = false,
}) => {
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [useCustom, setUseCustom] = useState(false);

  if (!isOpen) return null;

  const handleDemoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (useCustom && customEmail) {
      onDemoLogin(customEmail, customName || customEmail.split('@')[0]);
    } else {
      onDemoLogin();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(10px)',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md overflow-hidden rounded-2xl border p-6 text-white shadow-2xl transition-all"
        style={{
          background: 'linear-gradient(135deg, #111418 0%, #0a0d10 100%)',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7), 0 0 40px rgba(34, 197, 94, 0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <svg width="22" height="22" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-bold tracking-tight">Google Sign-Up / Login</h3>
            <p className="text-xs text-gray-400">Seamless single sign-on for traders</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="rounded-xl border border-yellow-500/20 bg-yellow-500/5 p-3.5 mb-4">
          <div className="flex items-start gap-2.5">
            <KeyRound className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed text-gray-300">
              <span className="font-semibold text-yellow-300">Production Setup:</span> To authenticate real Google accounts, create an OAuth 2.0 Client ID in{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-white inline-flex items-center gap-0.5 font-medium"
              >
                Google Cloud Console <ExternalLink className="w-3 h-3" />
              </a>{' '}
              and add <code className="bg-black/40 px-1 py-0.5 rounded text-[#22c55e]">VITE_GOOGLE_CLIENT_ID</code> to <code className="bg-black/40 px-1 py-0.5 rounded">frontend/.env</code>.
            </div>
          </div>
        </div>

        {/* Demo Fast Track */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 mb-4">
          <div className="flex items-center gap-2 mb-1.5 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Instant Test Mode
          </div>
          <p className="text-xs text-gray-300 mb-3">
            Test the entire Google authentication pipeline immediately. This registers a verified Google user in the database, generates JWTs, and logs you in.
          </p>

          <form onSubmit={handleDemoSubmit} className="space-y-3">
            {useCustom && (
              <div className="space-y-2 pt-1">
                <input
                  type="text"
                  placeholder="Full Name (e.g. Alex Morgan)"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#22c55e] focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Google Email (e.g. alex@gmail.com)"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                  className="w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-xs text-white placeholder-gray-500 focus:border-[#22c55e] focus:outline-none"
                />
              </div>
            )}

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => setUseCustom(!useCustom)}
                className="text-[11px] text-gray-400 hover:text-white underline"
              >
                {useCustom ? 'Use default demo account' : 'Customize test name & email'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-lime-500 px-4 py-2.5 text-xs font-bold text-black shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                'Signing in…'
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  Continue with Google Auth Demo
                  <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-gray-500">
          Once your Google Client ID is added to <code className="text-gray-400">frontend/.env</code>, clicking Google will automatically open the native Google login popup.
        </p>
      </div>
    </div>
  );
};

export default GoogleAuthModal;
