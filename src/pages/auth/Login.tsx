import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { useMagnetic } from '../../hooks/useMagnetic';
import ThreeBg from '../../components/ThreeBg';
import { useGoogleAuth } from '../../hooks/useGoogleAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [googleHover, setGoogleHover] = useState(false);
  const [githubHover, setGithubHover] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const magnetRef = useMagnetic<HTMLButtonElement>(10);
  const { signInWithGoogle, isLoading: isGoogleLoading } = useGoogleAuth();

  const from = (location.state as { from?: { pathname?: string } } | null)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      toast.success('Session Initialized');

      login(response.data);
      navigate(from, { replace: true });
    } catch (error) {
      const message = error instanceof Error ? error.message : undefined;
      const apiMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message;
      toast.error(apiMessage || message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const inputBaseStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    padding: '10px 16px',
    color: '#fff',
    fontFamily: "'Fira Sans', sans-serif",
    fontSize: 14,
    outline: 'none',
    width: '100%',
    transition: 'border-color .3s, box-shadow .3s',
  };

  const focusStyle: React.CSSProperties = {
    borderColor: 'rgba(34,197,94,0.6)',
    boxShadow: '0 0 0 3px rgba(34,197,94,0.12)',
  };

  const socialBtnBaseStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
    borderRadius: 12,
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.12)',
    color: '#fff',
    fontFamily: "'Fira Sans', sans-serif",
    fontSize: 13.5,
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background .25s, border-color .25s',
  };

  const socialBtnHoverStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.08)',
    borderColor: 'rgba(255,255,255,0.2)',
  };

  return (
    <div
      className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] w-full"
      style={{
        maxWidth: 1180,
        height: 'min(100%, 620px)',
        margin: '0 auto',
        borderRadius: 26,
        overflow: 'hidden',
        background: '#0a0a0a',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
      }}
    >
      {/* FORM SIDE */}
      <div
        className="relative flex flex-col px-6 sm:px-10 lg:px-12"
        style={{ height: '100%', minHeight: 0, overflow: 'hidden', paddingTop: 20, paddingBottom: 16 }}
      >
        <div
          className="flex-1 flex flex-col justify-center w-full mx-auto"
          style={{ maxWidth: 380 }}
        >
          <div style={{ animation: 'fadeSlideUp .8s ease forwards', opacity: 0 }}>
            <div
              style={{
                fontSize: 11,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: '#22c55e',
                fontWeight: 600,
                marginBottom: 10,
              }}
            >
              Welcome back
            </div>
            <h1
              style={{
                fontSize: 'clamp(26px,2.6vw,36px)',
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                color: '#fff',
                margin: '0 0 8px',
              }}
            >
              Log in to your <em className="accent-italic" style={{ color: '#22c55e' }}>edge</em>
            </h1>
            <p style={{ fontSize: 14, lineHeight: 1.55, color: 'rgba(255,255,255,0.5)', margin: '0 0 18px', fontWeight: 300 }}>
              The live room is already open. Pick up where you left off.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col"
            style={{ gap: 13, animation: 'fadeSlideUp .9s ease .12s forwards', opacity: 0 }}
          >
            <label className="flex flex-col" style={{ gap: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                Email
              </span>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="you@example.com"
                  required
                  style={{ ...inputBaseStyle, paddingLeft: 40, ...(emailFocused ? focusStyle : {}) }}
                />
              </div>
            </label>

            <label className="flex flex-col" style={{ gap: 8 }}>
              <span className="flex justify-between items-center">
                <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>
                  Password
                </span>
                <Link to="/forgot-password" style={{ fontSize: 12, fontWeight: 600, color: '#22c55e' }}>
                  Forgot?
                </Link>
              </span>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'rgba(255,255,255,0.35)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="••••••••"
                  required
                  style={{ ...inputBaseStyle, paddingLeft: 40, ...(passwordFocused ? focusStyle : {}) }}
                />
              </div>
            </label>

            <button
              ref={magnetRef}
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                background: 'linear-gradient(90deg,#84cc16,#22c55e)',
                color: '#000',
                padding: 13,
                borderRadius: 14,
                fontFamily: "'Fira Sans', sans-serif",
                fontWeight: 700,
                fontSize: 15,
                border: 'none',
                cursor: isLoading ? 'wait' : 'pointer',
                boxShadow: '0 0 34px rgba(34,197,94,0.3)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? 'Logging in…' : 'Log In'} <ArrowRight className="w-4 h-4" style={{ color: '#000' }} />
            </button>
          </form>

          <div className="flex items-center" style={{ gap: 14, margin: '10px 0', animation: 'fadeSlideUp .9s ease .2s forwards', opacity: 0 }}>
            <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>or</span>
            <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.1)' }} />
          </div>

          <div className="grid grid-cols-2" style={{ gap: 14, animation: 'fadeSlideUp .9s ease .26s forwards', opacity: 0 }}>
            <button
              type="button"
              onClick={signInWithGoogle}
              disabled={isLoading || isGoogleLoading}
              onMouseEnter={() => setGoogleHover(true)}
              onMouseLeave={() => setGoogleHover(false)}
              style={{ ...socialBtnBaseStyle, ...(googleHover ? socialBtnHoverStyle : {}), opacity: isGoogleLoading ? 0.7 : 1 }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.1A6.6 6.6 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.94l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.16-3.16A11 11 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
              </svg>
              {isGoogleLoading ? 'Connecting…' : 'Google'}
            </button>
            <button
              type="button"
              onMouseEnter={() => setGithubHover(true)}
              onMouseLeave={() => setGithubHover(false)}
              style={{ ...socialBtnBaseStyle, ...(githubHover ? socialBtnHoverStyle : {}) }}
            >
              <Github className="w-4 h-4" />
              GitHub
            </button>
          </div>

          <p style={{ margin: '10px 0 0', fontSize: 13.5, color: 'rgba(255,255,255,0.45)', animation: 'fadeSlideUp .9s ease .32s forwards', opacity: 0 }}>
            New to Shamsh Trader?{' '}
            <Link to="/register" style={{ fontWeight: 700 }}>
              Create an account →
            </Link>
          </p>
        </div>

        <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>
          © 2026 Shamsh Trader · <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy</a> ·{' '}
          <a href="#" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms</a>
        </span>
      </div>

      {/* VISUAL SIDE (Three.js wave) */}
      <div
        className="hidden lg:block relative"
        style={{
          height: '100%',
          overflow: 'hidden',
          background: 'radial-gradient(ellipse at 30% 20%,#0c120c,#050705 70%)',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        <div style={{ position: 'absolute', inset: 0 }}>
          <ThreeBg mode="wave" color1="#22c55e" color2="#84cc16" />
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg,rgba(10,10,10,0.55),transparent 35%,transparent 60%,rgba(10,10,10,0.85))',
            pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'absolute', top: 40, left: 40, right: 40, pointerEvents: 'none' }}>
          <div
            style={{
              fontSize: 12,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)',
              fontWeight: 600,
              marginBottom: 16,
              animation: 'fadeSlideUp .9s ease .2s forwards',
              opacity: 0,
            }}
          >
            The market never sleeps
          </div>
          <div
            className="accent-italic"
            style={{
              fontSize: 'clamp(28px,2.8vw,42px)',
              lineHeight: 1.25,
              color: '#fff',
              maxWidth: 480,
              animation: 'fadeSlideUp 1s ease .3s forwards',
              opacity: 0,
            }}
          >
            "Discipline today.
            <br />
            Freedom tomorrow."
          </div>
        </div>
        <div
          className="flex"
          style={{
            position: 'absolute',
            left: 40,
            bottom: 36,
            right: 40,
            gap: 36,
            pointerEvents: 'none',
            animation: 'fadeSlideUp 1s ease .45s forwards',
            opacity: 0,
          }}
        >
          <span className="flex flex-col">
            <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>10K+</span>
            <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
              Traders inside
            </span>
          </span>
          <span className="flex flex-col">
            <span style={{ fontSize: 24, fontWeight: 800, color: '#fff' }}>95%+</span>
            <span style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>
              Success rate
            </span>
          </span>
          <span className="flex items-center" style={{ gap: 8, marginLeft: 'auto' }}>
            <span style={{ width: 8, height: 8, borderRadius: 999, background: '#22c55e', animation: 'onlinePulse 2s infinite' }} />
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 600 }}>Live room active now</span>
          </span>
        </div>
      </div>
    </div>
  );
}
