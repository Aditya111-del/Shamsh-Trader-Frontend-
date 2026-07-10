import { footerConfig } from '../config';
import { Link } from 'react-router-dom';

export default function Footer() {
  if (!footerConfig.heading && footerConfig.columns.length === 0) {
    return null;
  }

  return (
    <footer
      id="footer"
      className="relative border-t border-white/10 py-16 px-6 lg:py-[150px] lg:px-[5vw]"
      style={{
        background: '#0a0a0a',
        zIndex: 2,
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {footerConfig.heading && (
          <h2
            style={{
              fontFamily: "'Fira Sans', sans-serif",
              fontWeight: 400,
              fontSize: 'clamp(40px, 5vw, 80px)',
              lineHeight: 1.1,
              letterSpacing: '-1.44px',
              color: '#ffffff',
              marginBottom: 80,
            }}
          >
            {footerConfig.heading}
          </h2>
        )}

        {footerConfig.columns.length > 0 && (
          <div
            className="grid grid-cols-1 md:grid-cols-2"
            style={{ gap: 60, marginBottom: 120 }}
          >
            {footerConfig.columns.map((column, colIndex) => (
              <div key={colIndex} className="flex flex-col" style={{ gap: 16 }}>
                {column.title && (
                  <span
                    style={{
                      fontFamily: "'Fira Sans', sans-serif",
                      fontSize: 12,
                      fontWeight: 300,
                      letterSpacing: '3px',
                      textTransform: 'uppercase',
                      color: '#dadada',
                      opacity: 0.4,
                      marginBottom: 8,
                    }}
                  >
                    {column.title}
                  </span>
                )}
                {column.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="nav-link"
                    style={{ width: 'fit-content' }}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        )}

        <div
          className="flex flex-col md:flex-row items-start md:items-center justify-between"
          style={{
            paddingTop: 24,
            borderTop: '1px solid rgba(255, 255, 255, 0.06)',
            gap: 16,
          }}
        >
          {footerConfig.copyright && (
            <span
              style={{
                fontFamily: "'Fira Sans', sans-serif",
                fontWeight: 200,
                fontSize: 12,
                color: '#dadada',
                opacity: 0.4,
              }}
            >
              {footerConfig.copyright}
            </span>
          )}
          {footerConfig.bottomLinks.length > 0 && (
            <div className="flex items-center" style={{ gap: 24 }}>
              {footerConfig.bottomLinks.map((bottomLink) => (
                <Link
                  key={bottomLink.label}
                  to={bottomLink.href || '#'}
                  style={{
                    fontFamily: "'Fira Sans', sans-serif",
                    fontWeight: 200,
                    fontSize: 12,
                    color: '#dadada',
                    opacity: 0.4,
                    textDecoration: 'none',
                    transition: 'opacity 0.3s',
                  }}
                  onMouseEnter={(e) => { (e.target as HTMLElement).style.opacity = '0.8'; }}
                  onMouseLeave={(e) => { (e.target as HTMLElement).style.opacity = '0.4'; }}
                >
                  {bottomLink.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
