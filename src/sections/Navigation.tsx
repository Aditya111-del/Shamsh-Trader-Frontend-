import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { navigationConfig, siteConfig } from '../config';
import { useAuth } from '../contexts/AuthContext';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const goToLink = (href: string) => {
    if (href.startsWith('#')) {
      if (location.pathname === '/') {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
      } else {
        navigate(`/${href}`);
      }
    } else {
      navigate(href);
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    goToLink(href);
  };

  const handleMobileClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    goToLink(href);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center w-full pointer-events-none">
        <nav
          className={`pointer-events-auto w-full transition-all duration-500 flex items-center justify-between ${
            scrolled || isMobileMenuOpen || location.pathname !== '/'
              ? 'premium-glass shadow-[0_10px_40px_rgba(0,0,0,0.8)] opacity-100 translate-y-0 px-8 py-4 rounded-none max-w-full'
              : 'premium-glass border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] opacity-100 translate-y-0 mt-3 px-6 py-3 rounded-full max-w-[1100px]'
          }`}
        >
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]">
              <img src="/images/shamsh-trader-logo.png" alt="Logo" className="w-full h-full object-cover" />
            </div>
            <span className="font-bold text-white tracking-tight" style={{ fontSize: 16 }}>
              {siteConfig.brandName}
            </span>
          </div>

          {/* Links (Desktop) */}
          <div className="hidden md:flex items-center gap-8">
            {navigationConfig.links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleClick(e, link.href)}
                className="group relative text-[13px] font-semibold tracking-wide text-gray-400 hover:text-white transition-colors uppercase"
              >
                {link.label}
                <span className="absolute -bottom-1.5 left-0 w-0 h-[1.5px] bg-[#22c55e] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              </a>
            ))}
          </div>

          {/* CTA (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <span className="text-[13px] font-semibold text-[#22c55e] uppercase tracking-wide">
                  {user?.name} {isAdmin && '(Admin)'}
                </span>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  className="text-[13px] font-semibold text-gray-400 hover:text-white uppercase tracking-wide transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout}
                  className="text-[13px] font-semibold text-gray-400 hover:text-white uppercase tracking-wide transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-[13px] font-semibold text-gray-400 hover:text-white uppercase tracking-wide transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 premium-glass px-4 py-1.5 rounded-full border border-[#22c55e]/30 hover:border-[#22c55e]/60 transition-all hover-lift cursor-pointer"
                >
                  <span className="text-white text-[13px] font-semibold">Sign Up</span>
                  <div className="w-5 h-5 rounded-full bg-[#22c55e] flex items-center justify-center shadow-[0_0_8px_rgba(34,197,94,0.5)]">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white p-2 pointer-events-auto"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navigationConfig.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleMobileClick(e, link.href)}
              className="text-2xl font-bold tracking-wider text-white uppercase hover:text-[#22c55e] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <div className="mt-8 flex flex-col items-center gap-6 w-full">
            {isAuthenticated ? (
              <>
                <span className="text-xl font-bold text-[#22c55e] uppercase tracking-wide">
                  {user?.name} {isAdmin && '(Admin)'}
                </span>
                <button
                  onClick={() => {
                    logout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-lg font-bold tracking-wider text-gray-400 uppercase hover:text-white transition-colors"
                >
                  Logout
                </button>
                <Link
                  to={isAdmin ? "/admin" : "/dashboard"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-3/4 max-w-xs gap-3 bg-gradient-to-r from-[#84cc16] to-[#22c55e] px-8 py-3 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-transform mt-4"
                >
                  <span className="text-black font-extrabold text-lg tracking-wide uppercase">Dashboard</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold tracking-wider text-gray-400 uppercase hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center w-3/4 max-w-xs gap-3 bg-gradient-to-r from-[#84cc16] to-[#22c55e] px-8 py-3 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-transform"
                >
                  <span className="text-black font-extrabold text-lg tracking-wide uppercase">Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
