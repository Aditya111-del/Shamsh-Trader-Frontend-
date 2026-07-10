import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navigation from '../sections/Navigation';
import Footer from '../sections/Footer';

export default function PublicLayout() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [location.pathname, location.hash]);

  return (
    <div
      style={{
        background: '#0a0a0a',
        minHeight: '100vh',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navigation />
      <main style={{ flex: 1, minWidth: 0, width: '100%' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
