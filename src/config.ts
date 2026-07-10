// ============================================================
// Site Configuration
// ============================================================

export interface SiteConfig {
  language: string;
  brandName: string;
}

export const siteConfig: SiteConfig = {
  language: "en",
  brandName: "Shamsh Trader",
};

// ============================================================
// Navigation
// ============================================================

interface NavLink {
  label: string;
  href: string;
}

export interface NavigationConfig {
  links: NavLink[];
  ctaText: string;
}

export const navigationConfig: NavigationConfig = {
  links: [
    { label: "About", href: "#about" },
    { label: "Genie AI", href: "/ai-chat" },
    { label: "Events", href: "/events" },
    { label: "Journal", href: "/blog" },
    { label: "Market", href: "/marketplace" },
    { label: "Academy", href: "/courses" },
    { label: "Feed", href: "/social" },
  ],
  ctaText: "Get Started",
};

// ============================================================
// Hero
// ============================================================

export interface HeroConfig {
  title: string;
  subtitleLine1: string;
  subtitleLine2: string;
  ctaText: string;
}

export const heroConfig: HeroConfig = {
  title: "Shamsh Trader",
  subtitleLine1: "DISCIPLINE TODAY. FREEDOM TOMORROW.",
  subtitleLine2: "Smart analysis. Proven strategies. Real results.",
  ctaText: "Start Your Journey",
};



// ============================================================
// Capability Detail (sub-pages)
// ============================================================

interface CapabilityDetailData {
  title: string;
  subtitle: string;
  paragraphs: string[];
}

export interface CapabilityDetailConfig {
  sectionLabel: string;
  backLinkText: string;
  prevLabel: string;
  nextLabel: string;
  notFoundText: string;
  capabilities: Record<string, CapabilityDetailData>;
}

export const capabilityDetailConfig: CapabilityDetailConfig = {
  sectionLabel: "Capability",
  backLinkText: "Back to home",
  prevLabel: "Previous",
  nextLabel: "Next",
  notFoundText: "Capability not found.",
  capabilities: {
    "market-analysis": {
      title: "Market Analysis",
      subtitle: "Read the market, don't just watch it.",
      paragraphs: [
        "Our market analysis framework combines technical precision with macro awareness. We don't chase indicators — we understand market structure, identify key support and resistance zones, and wait for high-confluence setups that offer favorable risk-reward ratios.",
        "Every trade begins with a thorough read of price action. We analyze multi-timeframe trends, volume profiles, and market sentiment to build a complete picture before entering any position. This systematic approach removes guesswork and replaces it with conviction.",
        "The markets reward preparation. Our analysis process includes pre-market briefings, intraday updates, and post-market reviews. You'll learn to see patterns that others miss and develop the patience to wait for the perfect setup.",
        "From chart patterns to economic calendars, we cover every aspect of market analysis. Whether you're trading forex, stocks, or crypto, the principles remain the same: understand the game, know your edge, and execute with precision.",
      ],
    },
    "risk-management": {
      title: "Risk Management",
      subtitle: "Protect capital. Live to trade another day.",
      paragraphs: [
        "Risk management is the foundation of profitable trading. Even the best strategy will fail without proper risk controls. We teach you to think in probabilities, not predictions — ensuring that no single trade can significantly damage your account.",
        "Our framework covers position sizing, stop-loss placement, risk-reward ratios, and portfolio heat. You'll learn the 1-2% rule, how to scale in and out of positions, and when to stay flat. Preserving capital is always the first priority.",
        "We emphasize the psychological side of risk. Fear and greed are the enemy of rational decision-making. Through structured rules and pre-trade checklists, we remove emotion from the equation and replace it with disciplined execution.",
        "Advanced topics include correlation analysis, drawdown management, and tail-risk hedging. Whether you're managing a $1,000 account or $100,000, the principles of risk management scale with your capital.",
      ],
    },
    "psychology-mastery": {
      title: "Psychology Mastery",
      subtitle: "Master your mind, master the markets.",
      paragraphs: [
        "Trading is 80% psychology and 20% strategy. The world's best trading system is useless in the hands of someone who can't control their emotions. We focus heavily on the mental game because that's where most traders fail.",
        "Our psychology training covers emotional regulation, cognitive biases, and mindset reframing. You'll learn to recognize fear, greed, and FOMO in real-time and develop techniques to stay centered under pressure.",
        "We build routines and rituals that prime you for peak performance. From morning preparation to post-trade journaling, every habit is designed to strengthen your mental edge. Consistency in process leads to consistency in profits.",
        "Through guided exercises and real trading scenarios, you'll develop the discipline to follow your plan, the patience to wait for quality setups, and the resilience to recover from losses. The markets will test your character — we make sure you pass.",
      ],
    },
    "strategy-backtesting": {
      title: "Strategy Backtesting",
      subtitle: "Prove your edge before risking a dollar.",
      paragraphs: [
        "Every strategy must earn its place through rigorous backtesting. We don't trade on hunches or hope — we trade on statistically validated edge. Our backtesting framework ensures you know your strategy's win rate, expectancy, and maximum drawdown before going live.",
        "You'll learn manual backtesting techniques as well as automated testing using trading platforms. We cover sample size requirements, out-of-sample testing, and walk-forward analysis to ensure your results are robust and not curve-fitted.",
        "Beyond the numbers, we teach you to understand why a strategy works. Market regimes change, and strategies that worked in 2020 may fail in 2025. We show you how to monitor performance, detect decay, and adapt when market conditions shift.",
        "From simple moving average crosses to complex multi-factor models, our backtesting process applies to any strategy. The goal is simple: trade with confidence, backed by data, knowing your edge is real.",
      ],
    },
  },
};



// ============================================================
// Footer
// ============================================================

interface FooterLinkColumn {
  title: string;
  links: { label: string; href: string }[];
}

interface FooterBottomLink {
  label: string;
  href: string;
}

export interface FooterConfig {
  heading: string;
  columns: FooterLinkColumn[];
  copyright: string;
  bottomLinks: FooterBottomLink[];
}

export const footerConfig: FooterConfig = {
  heading: "Start Your Trading Journey",
  columns: [
    {
      title: "FEATURES",
      links: [
        { label: "About", href: "/#about" },
        { label: "Genie AI", href: "/ai-chat" },
        { label: "Events", href: "/events" },
        { label: "Journal", href: "/blog" },
      ],
    },
    {
      title: "MORE",
      links: [
        { label: "Market", href: "/marketplace" },
        { label: "Academy", href: "/courses" },
        { label: "Feed", href: "/social" },
      ],
    },
  ],
  copyright: "\u00A9 2026 Shamsh Trader. All rights reserved.",
  bottomLinks: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Risk Disclaimer", href: "/risk-disclaimer" },
  ],
};
