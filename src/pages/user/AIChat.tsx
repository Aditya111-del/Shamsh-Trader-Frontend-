import { useEffect, useRef, useState, type FormEvent, type CSSProperties, type ReactNode } from 'react';
import {
  Search,
  Home as HomeIcon,
  Sparkles,
  LayoutGrid,
  ChevronDown,
  Plus,
  MoreVertical,
  TrendingUp,
  Shield,
  Code2,
  HeartPulse,
  Bell,
  ArrowUp,
  Paperclip,
  PanelLeft,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Link } from 'react-router-dom';
import OrbVideo from '../../components/OrbVideo';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Role = 'user' | 'assistant';
type Mode = 'analyst' | 'coder' | 'coach';

interface Message {
  id: string;
  role: Role;
  content: string;
  error?: boolean;
}

// ---------------------------------------------------------------------------
// Static copy (mirrors Genie AI.dc.html)
// ---------------------------------------------------------------------------

const MODE_LABELS: Record<Mode, string> = {
  analyst: 'Analyst',
  coder: 'Coder',
  coach: 'Coach',
};





const FEATURE_CARDS: {
  icon: typeof TrendingUp;
  iconColor: string;
  gradient: string;
  title: string;
  desc: string;
  suggest: string;
}[] = [
  {
    icon: TrendingUp,
    iconColor: '#4ade80',
    gradient: 'linear-gradient(135deg,rgba(34,197,94,0.22),rgba(13,13,13,0) 70%)',
    title: 'Market Analysis',
    desc: 'Multi-timeframe structure reads with bias and invalidation.',
    suggest:
      'Give me a full multi-timeframe structure read on BTC right now — trend, key levels, liquidity and bias.',
  },
  {
    icon: Shield,
    iconColor: '#34d399',
    gradient: 'linear-gradient(135deg,rgba(16,185,129,0.20),rgba(13,13,13,0) 70%)',
    title: 'Risk & Sizing',
    desc: 'Position sizing, drawdown math and pre-trade risk checks.',
    suggest:
      'What position size should I use on an account risking 0.5% per trade with a 40 point stop on Nifty 50 futures?',
  },
  {
    icon: Code2,
    iconColor: '#a3e635',
    gradient: 'linear-gradient(135deg,rgba(132,204,22,0.18),rgba(13,13,13,0) 70%)',
    title: 'Strategy Code',
    desc: 'Pine Script and Python strategies, ready to backtest.',
    suggest:
      'Write a Pine Script v5 strategy for a 20/50 EMA cross with a 1.5% stop loss and 1:3 take profit.',
  },
  {
    icon: HeartPulse,
    iconColor: '#2dd4bf',
    gradient: 'linear-gradient(135deg,rgba(45,212,191,0.18),rgba(13,13,13,0) 70%)',
    title: 'Psychology Coach',
    desc: 'Protocols for tilt, FOMO and disciplined execution.',
    suggest: 'I keep revenge trading after a loss. Give me a concrete protocol to stop.',
  },
];

const SUGGESTION_CHIPS = [
  { label: 'BTC 4H sweep — long valid?', suggest: 'BTC swept the 4H low into demand — is a long valid here?' },
  {
    label: 'Write me an EMA-cross strategy',
    suggest: 'Write a Pine Script v5 strategy for a 20/50 EMA cross with a 1.5% stop loss and 1:3 take profit.',
  },
  {
    label: 'How do I size a Nifty/Crypto trade?',
    suggest:
      'What position size should I use on an account risking 0.5% per trade with a 40 point stop on Nifty 50 or 2% on BTC?',
  },
  {
    label: "What's the fix for revenge trading?",
    suggest: 'I keep revenge trading after a loss. Give me a concrete protocol to stop.',
  },
];

const PINNED_ITEMS = [
  { label: 'BTC 4H sweep — long setup', suggest: 'BTC swept the 4H low into demand — is a long valid here?' },
  {
    label: 'Nifty & Crypto sizing',
    suggest:
      'What position size should I use on an account risking 0.5% per trade with a 40 point stop on Nifty 50 futures?',
  },
  { label: 'Gold news-week plan', suggest: 'Gold has CPI and FOMC this week. Build me a news-week game plan.' },
  {
    label: 'Journal review: April',
    suggest: 'Review my trading week: 12 trades, 4 winners, net +1.8R. What should I look at in my journal?',
  },
];

const HISTORY_GROUPS: { label: string; items: string[] }[] = [
  { label: 'Today', items: ['Nifty 50 opening range read', 'Backtest: EMA cross idea'] },
  { label: 'Yesterday', items: ['Revenge trading protocol', 'SOL liquidity map'] },
  { label: '7 days', items: ['Weekly watchlist build', 'Funding rate strategy'] },
];

// ---------------------------------------------------------------------------
// Typing dots
// ---------------------------------------------------------------------------

function TypingDots() {
  return (
    <div className="flex items-center gap-[10px] py-5">
      <OrbVideo size={18} />
      <span className="inline-flex gap-[5px]">
        {[0, 0.18, 0.36].map((d) => (
          <span
            key={d}
            className="genie-typing-dot"
            style={{
              width: 5,
              height: 5,
              borderRadius: 999,
              background: 'rgba(255,255,255,0.5)',
              animationDelay: `${d}s`,
            }}
          />
        ))}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Markdown message body (assistant answers)
// ---------------------------------------------------------------------------

interface CodeRendererProps {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

function AssistantBody({ content }: { content: string }) {
  return (
    <div className="prose prose-invert max-w-none prose-p:leading-relaxed prose-p:my-2 prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-0 text-[15px] leading-[1.75] font-light text-white/85">
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }: CodeRendererProps) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <div className="rounded-xl overflow-hidden my-4 border border-white/10">
                <div className="bg-white/5 px-4 py-2 text-xs font-mono text-white/40 border-b border-white/10">
                  {match[1]}
                </div>
                <SyntaxHighlighter
                  style={vscDarkPlus as { [key: string]: CSSProperties }}
                  language={match[1]}
                  PreTag="div"
                  customStyle={{ margin: 0, padding: '1.5rem', background: '#000' }}
                  {...props}
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            ) : (
              <code className="bg-white/10 px-1.5 py-0.5 rounded font-mono text-sm text-[#4ade80]" {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Simulated backend — fake streamed response
// ---------------------------------------------------------------------------

function buildFakeReply(mode: Mode, userText: string): string {
  const lower = userText.toLowerCase();
  if (mode === 'coder' || lower.includes('script') || lower.includes('code') || lower.includes('strategy')) {
    return (
      "Here's a starting point — validate it on out-of-sample data before risking anything on it:\n\n" +
      '```pinescript\n' +
      '//@version=5\n' +
      'strategy("EMA Cross", overlay=true)\n' +
      'fast = ta.ema(close, 20)\n' +
      'slow = ta.ema(close, 50)\n' +
      'longCond = ta.crossover(fast, slow)\n' +
      'shortCond = ta.crossunder(fast, slow)\n' +
      'if longCond\n' +
      '    strategy.entry("Long", strategy.long)\n' +
      'if shortCond\n' +
      '    strategy.close("Long")\n' +
      '```\n\n' +
      '- Entry: 20/50 EMA cross on the close\n' +
      '- Stop: 1.5% from entry\n' +
      '- Target: 1:3 R\n\n' +
      'Backtest across at least two market regimes before you trust it.'
    );
  }
  if (mode === 'coach') {
    return (
      "Here's a concrete protocol, not a pep talk:\n\n" +
      '- After any loss, close the platform for 15 minutes — no exceptions\n' +
      '- Write the trade down: setup, size, what actually happened\n' +
      '- Re-enter only if the next setup meets your written criteria, cold\n' +
      "- Cap the day at 2 losses — if you hit it, you're done\n\n" +
      "Discipline isn't a feeling, it's a rule you follow when you don't feel like it."
    );
  }
  return (
    "Here's a quick read:\n\n" +
    '- **Structure**: price is respecting the higher-timeframe range, leaning bullish above the mid.\n' +
    '- **Liquidity**: recent sweep of the prior low into a demand pocket — reaction was sharp, not slow.\n' +
    '- **Bias**: long-favored above the sweep low, invalidated on a clean close back below it.\n' +
    '- **Counter-case**: if volume stays weak on the bounce, this could be a lower-high forming instead.\n\n' +
    'Risk 0.5-1% max, invalidation at the sweep low. This is educational, not financial advice.'
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<Mode>('analyst');
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth > 768 : true
  );
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= 768 : false
  );

  const scrollRef = useRef<HTMLDivElement>(null);
  const idCounter = useRef(0);

  const empty = messages.length === 0;

  function nextId(suffix: string): string {
    idCounter.current += 1;
    return `msg-${idCounter.current}-${suffix}`;
  }

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const pane = scrollRef.current;
    if (!pane) return;
    const id = setTimeout(() => {
      pane.scrollTop = pane.scrollHeight;
    }, 80);
    return () => clearTimeout(id);
  }, [messages, busy]);

  async function send(textOverride?: string) {
    const text = (textOverride ?? draft).trim();
    if (!text || busy) return;

    const userMessage: Message = { id: nextId('u'), role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setDraft('');
    setBusy(true);

    try {
      // Real backend integration point: swap this simulated delay for something like
      // `await api.post('/ai-chat/complete', { system: systemPrompt(mode), messages: nextMessages, max_tokens: 900 })`.
      const reply = await new Promise<string>((resolve) => {
        setTimeout(() => resolve(buildFakeReply(mode, text)), 900 + Math.random() * 500);
      });
      setMessages((prev) => [...prev, { id: nextId('a'), role: 'assistant', content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId('e'),
          role: 'assistant',
          content: 'I could not reach the model just now (rate limit or connection). Give it a few seconds and try again.',
          error: true,
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send();
  }

  function newChat() {
    setMessages([]);
    setDraft('');
    setBusy(false);
  }

  const sidebarWidth = sidebarOpen ? 264 : 0;

  return (
    <div
      className="relative w-full flex overflow-hidden"
      style={{ height: '100vh', background: '#0d0d0d', fontFamily: "'Fira Sans', sans-serif" }}
    >
      <style>{`
        @keyframes genieFadeSlideUp { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
        @keyframes genieMsgIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
        @keyframes genieTypingDot { 0%,60%,100% { transform:translateY(0); opacity:.35; } 30% { transform:translateY(-3px); opacity:1; } }
        .genie-typing-dot { animation: genieTypingDot 1.1s infinite; }
        .genie-fade-in { animation: genieFadeSlideUp .8s ease forwards; opacity: 0; }
        .genie-msg-in { animation: genieMsgIn .35s ease; }
        .genie-scroll::-webkit-scrollbar { width: 0; height: 0; display: none; }
        .genie-scroll { scrollbar-width: none; }
        .genie-nav-item:hover { background: rgba(255,255,255,0.04); color: #fff; }
        .genie-suggest-item:hover { background: #212121; color: #fff; }
        .genie-history-item:hover { background: #1c1c1c; color: #fff; }
        .genie-feature-card:hover { border-color: rgba(34,197,94,0.4); transform: translateY(-3px); }
        .genie-chip:hover { color: #fff; border-color: rgba(34,197,94,0.45); }
        .genie-icon-btn:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
        .genie-attach:hover { color: #fff; border-color: rgba(255,255,255,0.2); }
        .genie-composer:focus-within { border-color: rgba(34,197,94,0.5); }
      `}</style>

      {/* Mobile overlay backdrop */}
      {isMobile && sidebarOpen && (
        <div
          className="fixed inset-0 z-[350] bg-black/60"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      {/* ============ SIDEBAR ============ */}
      <aside
        className="genie-scroll flex flex-col gap-1"
        style={{
          background: '#141414',
          borderRight: sidebarOpen ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0)',
          padding: sidebarOpen ? '14px 12px' : '14px 0px',
          overflowY: 'auto',
          overflowX: 'hidden',
          height: '100vh',
          width: sidebarWidth,
          flexShrink: 0,
          opacity: sidebarOpen ? 1 : 0,
          transition: 'width .38s cubic-bezier(.16,1,.3,1), padding .38s cubic-bezier(.16,1,.3,1), opacity .28s ease',
          position: isMobile ? 'fixed' : 'relative',
          left: 0,
          top: 0,
          zIndex: isMobile ? 400 : 'auto',
          boxShadow: isMobile && sidebarOpen ? '20px 0 60px rgba(0,0,0,0.55)' : 'none',
        }}
      >
        <div
          className="flex items-center gap-[10px] p-[10px] rounded-xl cursor-pointer mb-2"
          style={{ background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <OrbVideo size={34} />
          <span className="flex flex-col flex-1 min-w-0">
            <span className="text-[13.5px] font-semibold text-white">Genie AI</span>
            <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>Fast and reliable</span>
          </span>
          <ChevronDown size={14} color="rgba(255,255,255,0.4)" strokeWidth={2.5} />
        </div>

        <div
          className="flex items-center gap-[9px] px-3 py-[9px] rounded-[10px] cursor-text mb-[10px]"
          style={{ background: '#1b1b1b', border: '1px solid rgba(255,255,255,0.05)' }}
        >
          <Search size={14} color="rgba(255,255,255,0.35)" strokeWidth={2} />
          <span className="flex-1 text-[13px]" style={{ color: 'rgba(255,255,255,0.35)' }}>Search</span>
          <span
            className="text-[11px] rounded-[6px] px-2 py-[2px]"
            style={{ border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.4)' }}
          >
            /
          </span>
        </div>

        <Link
          to="/"
          className="genie-nav-item flex items-center gap-[11px] px-3 py-[9px] rounded-[10px] text-[13px] font-medium transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <HomeIcon size={15} />
          Home
        </Link>
        <span
          className="flex items-center gap-[11px] px-3 py-[9px] rounded-[10px] text-[13px] font-semibold cursor-pointer"
          style={{ background: '#222222', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
        >
          <Sparkles size={15} color="#22c55e" />
          Chat
        </span>
        <span
          className="genie-nav-item flex items-center gap-[11px] px-3 py-[9px] rounded-[10px] text-[13px] font-medium cursor-pointer transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <LayoutGrid size={15} />
          Prompt Library
        </span>
        <span
          className="genie-nav-item flex items-center gap-[11px] px-3 py-[9px] rounded-[10px] text-[13px] font-medium cursor-pointer transition-colors"
          style={{ color: 'rgba(255,255,255,0.6)' }}
        >
          <LayoutGrid size={15} />
          Integrations
        </span>

        <div className="flex items-center justify-between" style={{ padding: '14px 12px 6px' }}>
          <span
            className="text-[11px] font-semibold uppercase"
            style={{ letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}
          >
            Pinned
          </span>
          <span className="flex gap-2">
            <Plus size={13} color="rgba(255,255,255,0.35)" strokeWidth={2.5} style={{ cursor: 'pointer' }} />
            <MoreVertical size={13} color="rgba(255,255,255,0.35)" style={{ cursor: 'pointer' }} />
          </span>
        </div>
        {PINNED_ITEMS.map((item) => (
          <span
            key={item.label}
            onClick={() => send(item.suggest)}
            className="genie-suggest-item flex items-center gap-[10px] px-3 py-2 rounded-[9px] text-[12.5px] cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
            style={{ background: '#191919', color: 'rgba(255,255,255,0.65)' }}
          >
            <Sparkles size={13} color="#22c55e" style={{ flexShrink: 0 }} />
            {item.label}
          </span>
        ))}
        <span
          className="flex items-center gap-2 px-3 py-2 text-[12px] cursor-pointer"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          <ChevronDown size={12} strokeWidth={2.5} />
          Show 4 more
        </span>

        {HISTORY_GROUPS.map((group) => (
          <div key={group.label}>
            <span
              className="block text-[11px] font-semibold uppercase"
              style={{ padding: '14px 12px 6px', letterSpacing: '0.08em', color: 'rgba(255,255,255,0.3)' }}
            >
              {group.label}
            </span>
            {group.items.map((item) => (
              <span
                key={item}
                className="genie-history-item block px-3 py-2 rounded-[9px] text-[12.5px] cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
                style={{ color: 'rgba(255,255,255,0.55)' }}
              >
                {item}
              </span>
            ))}
          </div>
        ))}
      </aside>

      {/* ============ MAIN ============ */}
      <main
        className="relative flex-1 min-w-0 flex flex-col overflow-hidden"
        style={{ height: '100vh', background: '#0d0d0d' }}
      >
        {/* top bar */}
        <div className="flex items-center justify-end gap-3 flex-shrink-0" style={{ padding: '14px 24px' }}>
          <button
            aria-label="Toggle sidebar"
            onClick={() => setSidebarOpen((v) => !v)}
            className="genie-icon-btn flex items-center justify-center flex-shrink-0 transition-colors"
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.6)',
              cursor: 'pointer',
            }}
          >
            <PanelLeft size={15} />
          </button>

          <span className="inline-flex gap-[6px]" style={{ marginRight: 'auto' }}>
            {(Object.keys(MODE_LABELS) as Mode[]).map((m) => {
              const active = mode === m;
              return (
                <span
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    padding: '7px 14px',
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    color: active ? '#22c55e' : 'rgba(255,255,255,0.45)',
                    background: active ? 'rgba(34,197,94,0.08)' : 'transparent',
                    border: active ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(255,255,255,0.1)',
                    cursor: 'pointer',
                    fontFamily: "'Fira Sans'",
                  }}
                >
                  {MODE_LABELS[m]}
                </span>
              );
            })}
          </span>

          <button
            onClick={newChat}
            className="genie-icon-btn hidden sm:flex items-center gap-2 transition-colors"
            style={{
              padding: '8px 16px',
              borderRadius: 10,
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.75)',
              fontFamily: "'Fira Sans'",
              fontSize: '12.5px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Plus size={13} />
            New
          </button>

          <Link
            to="/register"
            className="flex items-center transition-colors"
            style={{
              padding: '8px 18px',
              borderRadius: 10,
              background: '#22c55e',
              color: '#000',
              fontSize: '12.5px',
              fontWeight: 700,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#4ade80')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
          >
            Upgrade
          </Link>

          <Bell size={17} color="rgba(255,255,255,0.5)" style={{ cursor: 'pointer' }} />
        </div>

        {/* WELCOME STATE */}
        {empty && (
          <div className="flex-1 min-h-0 overflow-y-auto genie-scroll flex flex-col" style={{ padding: '0 48px' }}>
            <div className="m-auto flex flex-col items-center w-full" style={{ padding: '20px 0' }}>
              <div className="genie-fade-in mb-[22px]">
                <OrbVideo size={72} scale={2.0} />
              </div>
              <h1
                className="genie-fade-in text-white m-0"
                style={{
                  fontSize: 30,
                  fontWeight: 600,
                  letterSpacing: '-0.02em',
                  marginBottom: 10,
                  animationDelay: '0.08s',
                }}
              >
                Welcome to Genie AI.
              </h1>
              <p
                className="genie-fade-in m-0"
                style={{
                  fontSize: '13.5px',
                  color: 'rgba(255,255,255,0.45)',
                  marginBottom: 44,
                  fontWeight: 300,
                  animationDelay: '0.14s',
                }}
              >
                Reads structure, checks risk and writes strategy code — trained on the Shamsh framework.
              </p>

              <div
                className="genie-fade-in grid grid-cols-2 md:grid-cols-4 gap-4 w-full"
                style={{ maxWidth: 1040, animationDelay: '0.2s' }}
              >
                {FEATURE_CARDS.map((card, i) => {
                  const Icon = card.icon;
                  return (
                    <div
                      key={card.title}
                      onClick={() => send(card.suggest)}
                      className="genie-feature-card cursor-pointer overflow-hidden"
                      style={{
                        transitionDelay: `${i * 60}ms`,
                        borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.07)',
                        background: '#141414',
                      }}
                    >
                      <div className="relative" style={{ height: 86, background: card.gradient, padding: 16 }}>
                        <Icon size={22} color={card.iconColor} strokeWidth={1.8} />
                        <Sparkles
                          size={13}
                          fill="rgba(255,255,255,0.7)"
                          color="rgba(255,255,255,0.7)"
                          style={{ position: 'absolute', top: 16, right: 34 }}
                        />
                        <Sparkles
                          size={8}
                          fill="rgba(255,255,255,0.4)"
                          color="rgba(255,255,255,0.4)"
                          style={{ position: 'absolute', top: 38, right: 20 }}
                        />
                      </div>
                      <div style={{ padding: '0 16px 18px' }}>
                        <div className="text-[14.5px] font-semibold text-white mb-[6px]">{card.title}</div>
                        <div className="text-xs" style={{ lineHeight: 1.55, color: 'rgba(255,255,255,0.45)' }}>
                          {card.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CHAT STATE */}
        {!empty && (
          <div ref={scrollRef} className="genie-scroll flex-1 min-h-0 overflow-y-auto" style={{ padding: '10px 24px 20px' }}>
            <div className="mx-auto flex flex-col" style={{ maxWidth: 760 }}>
              {messages.map((m) =>
                m.role === 'user' ? (
                  <div key={m.id} className="genie-msg-in" style={{ padding: '26px 0 14px' }}>
                    <span
                      className="text-white"
                      style={{
                        fontSize: 20,
                        fontWeight: 600,
                        lineHeight: 1.4,
                        letterSpacing: '-0.015em',
                        whiteSpace: 'pre-wrap',
                      }}
                    >
                      {m.content}
                    </span>
                  </div>
                ) : (
                  <div
                    key={m.id}
                    className="genie-msg-in"
                    style={{ padding: '4px 0 26px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="inline-flex items-center gap-2 mb-3">
                      <OrbVideo size={18} />
                      <span
                        className="text-[11.5px] font-semibold uppercase"
                        style={{ letterSpacing: '0.1em', color: 'rgba(255,255,255,0.4)' }}
                      >
                        Genie
                      </span>
                    </span>
                    {m.error ? (
                      <div
                        className="text-[15px]"
                        style={{ lineHeight: 1.75, color: 'rgba(248,113,113,0.85)', fontWeight: 300 }}
                      >
                        {m.content}
                      </div>
                    ) : (
                      <AssistantBody content={m.content} />
                    )}
                  </div>
                )
              )}
              {busy && <TypingDots />}
            </div>
          </div>
        )}

        {/* INPUT (both states) */}
        <div className="flex-shrink-0" style={{ padding: '14px 24px 22px' }}>
          <div className="mx-auto" style={{ maxWidth: 760 }}>
            {empty && (
              <div className="flex gap-[10px] flex-wrap justify-center" style={{ marginBottom: 14 }}>
                {SUGGESTION_CHIPS.map((chip) => (
                  <span
                    key={chip.label}
                    onClick={() => send(chip.suggest)}
                    className="genie-chip transition-colors"
                    style={{
                      padding: '9px 16px',
                      borderRadius: 999,
                      fontSize: '12.5px',
                      color: 'rgba(255,255,255,0.6)',
                      background: '#161616',
                      border: '1px solid rgba(255,255,255,0.09)',
                      cursor: 'pointer',
                    }}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="genie-composer overflow-hidden"
              style={{
                borderRadius: 14,
                background: '#171717',
                border: '1px solid rgba(255,255,255,0.09)',
                transition: 'border-color .3s',
              }}
            >
              <div className="flex items-center gap-3" style={{ padding: '6px 6px 6px 18px' }}>
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  type="text"
                  placeholder="Ask me anything…"
                  className="flex-1 bg-transparent border-none text-white outline-none"
                  style={{ padding: '13px 0', fontFamily: "'Fira Sans'", fontSize: '14.5px', fontWeight: 300 }}
                />
                <button
                  type="submit"
                  aria-label="Send"
                  disabled={!draft.trim() || busy}
                  className="flex items-center justify-center flex-shrink-0 transition-colors disabled:opacity-50"
                  style={{ width: 38, height: 38, borderRadius: 10, background: '#22c55e', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.disabled) e.currentTarget.style.background = '#4ade80';
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
                >
                  <ArrowUp size={15} color="#000" strokeWidth={2.5} />
                </button>
              </div>
              <div
                className="flex items-center justify-between"
                style={{ padding: '9px 14px', borderTop: '1px solid rgba(255,255,255,0.06)', background: '#131313' }}
              >
                <span
                  className="genie-attach inline-flex items-center gap-2 font-semibold cursor-pointer transition-colors"
                  style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)' }}
                >
                  <Sparkles size={13} fill="#22c55e" color="#22c55e" />
                  Saved prompts
                </span>
                <span
                  className="genie-attach inline-flex items-center gap-[7px] transition-colors"
                  style={{
                    padding: '6px 12px',
                    borderRadius: 8,
                    background: '#1c1c1c',
                    border: '1px solid rgba(255,255,255,0.08)',
                    fontSize: '11.5px',
                    color: 'rgba(255,255,255,0.45)',
                    cursor: 'pointer',
                  }}
                >
                  <Paperclip size={12} />
                  Attach content
                </span>
              </div>
            </form>
            <div className="text-center" style={{ marginTop: 9 }}>
              <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.28)' }}>
                Genie is educational — not financial advice. Verify before you trade.
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
