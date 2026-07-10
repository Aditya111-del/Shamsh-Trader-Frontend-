import { useRef } from 'react';
import { Link } from 'react-router-dom';
import FeaturesBar from '../components/FeaturesBar';
import StatsBar from '../components/StatsBar';
import CenterLogoPremium from '../components/premium/CenterLogoPremium';
import MagicRings from '../components/MagicRings';
import { heroConfig } from '../config';

// Coins and Orbit logic replaced by static image per user request



export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative w-full overflow-hidden flex flex-col"
      style={{ 
        minHeight: '100vh', 
        background: '#000000' 
      }}
    >
      {/* Subtle Matrix Map Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(/matrix-map.png)',
          backgroundSize: 'cover', // Ensures the map covers the entire screen
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.15, // Subtle transparency
          pointerEvents: 'none',
          zIndex: 0,
          // Fades out the center of the map to prevent visual chaos behind the text and logo
          maskImage: 'radial-gradient(ellipse at center, transparent 20%, black 60%)',
          WebkitMaskImage: 'radial-gradient(ellipse at center, transparent 20%, black 60%)',
        }}
      />
      {/* ── ATMOSPHERIC LAYERS ── */}
      {/* Magic Rings Left */}
      <div className="hidden lg:block" style={{
        position: 'absolute',
        top: '10%',
        left: '-15%',
        width: '800px',
        height: '800px',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.5,
        maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
      }}>
        <MagicRings
          color="#22c55e" colorTwo="#8247E5"
          ringCount={5} speed={0.8} blur={1}
          baseRadius={0.4} radiusStep={0.15}
          noiseAmount={0}
        />
      </div>

      {/* Magic Rings Right */}
      <div className="hidden lg:block" style={{
        position: 'absolute',
        top: '10%',
        right: '-15%',
        width: '800px',
        height: '800px',
        zIndex: 1,
        pointerEvents: 'none',
        opacity: 0.5,
        maskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(circle, black 30%, transparent 70%)',
      }}>
        <MagicRings
          color="#22c55e" colorTwo="#00AAE4"
          ringCount={5} speed={0.8} blur={1}
          baseRadius={0.4} radiusStep={0.15}
          noiseAmount={0}
        />
      </div>
      {/* ── DESKTOP HERO ── */}
      <div className="hidden lg:flex flex-col items-center w-full relative"
           style={{ paddingTop: '8vh' }}>

        {/* Orbit visual — aspect ratio locked to the image proportions */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 900, // Safely scaled down so it perfectly fits 100% laptop screens without overflow
          aspectRatio: '1496 / 984', // Exact aspect ratio of the provided image
          margin: '0 auto',
        }}>
          {/* Orbit Background Image */}
          <div style={{
            position: 'absolute',
            inset: 0,
            zIndex: 20,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            animation: 'orbitFadeIn 1.5s ease forwards',
            mixBlendMode: 'screen',
            // Erase the orbit line exactly where the logo sits so it doesn't shine through the logo
            maskImage: 'radial-gradient(circle 130px at 50% 18%, transparent 80%, black 100%)',
            WebkitMaskImage: 'radial-gradient(circle 130px at 50% 18%, transparent 80%, black 100%)',
          }}>
            <img 
              src="/orbit-bg.png" 
              alt="Crypto Orbit" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'fill',
              }}
            />
          </div>

            {/* CTA Button placed exactly on the bottom center of the orbit ring */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                width: '100%',
                top: '81%', // Perfectly aligned with the bottom curve of the ellipse in the image
                transform: 'translateY(-50%)', 
                display: 'flex',
                justifyContent: 'center',
                zIndex: 40,
              }}
            >
              <div style={{ animation: 'fadeSlideUp 1s ease forwards 0.8s', opacity: 0 }}>
                <Link
                  to="/register"
                  className="hover-lift"
                  style={{
                    background: 'linear-gradient(90deg, #84cc16 0%, #22c55e 100%)', // Vibrant green from screenshot
                    borderRadius: 999,
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 8px 8px 28px',
                    gap: 16,
                    cursor: 'pointer',
                    boxShadow: '0 0 40px rgba(34,197,94,0.3)',
                    border: 'none',
                  }}
                >
                  <span style={{ fontWeight: 700, fontSize: 16, color: '#000', letterSpacing: '0.2px' }}>{heroConfig.ctaText}</span>
                  <div style={{
                    background: '#050505',
                    borderRadius: '50%',
                    width: 38, height: 38,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                    </svg>
                  </div>
                </Link>
              </div>
            </div>

          {/* Center Content: Logo */}
          <div style={{
            position: 'absolute',
            top: '18%', // Logo perfectly aligned with the mask hole, shifted higher up
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
          }}>
            <CenterLogoPremium />
          </div>

          {/* Center Content: Text */}
          <div style={{
            position: 'absolute',
            top: '54%', // Shifted up closer to the logo
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}>
            <div className="flex flex-col items-center text-center w-full" style={{ animation: 'fadeSlideUp 1s ease 0.5s forwards', opacity: 0, transform: 'translateY(20px)' }}>
              <h1 style={{
                fontWeight: 800,
                fontSize: 'clamp(36px, 4.5vw, 64px)', // Decreased slightly for a cleaner proportion
                lineHeight: 1.05,
                letterSpacing: '-0.03em',
                marginBottom: 14,
                color: '#fff',
              }}>
                <span>Shamsh </span>
                <span className="text-wipe-animation">Trader</span>
              </h1>

              <p style={{
                fontWeight: 600,
                fontSize: 13,
                letterSpacing: '0.38em',
                textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                <span style={{ color: 'rgba(255,255,255,0.55)' }}>DISCIPLINE TODAY.&nbsp;</span>
                <span style={{ color: '#22c55e' }}>FREEDOM TOMORROW.</span>
              </p>

              <div style={{
                width: 80,
                height: 1,
                background: 'linear-gradient(90deg, transparent, rgba(34,197,94,0.6), transparent)',
                marginBottom: 20,
              }} />

              {/* Subtitle removed per request */}
            </div>
          </div>
        </div>

        {/* Dashboard cards */}
        <div className="w-full max-w-[1100px] mx-auto px-6 flex flex-col gap-5 pb-16 z-20" style={{ marginTop: '3rem' }}>
          <FeaturesBar />
          <StatsBar />
        </div>
      </div>

      {/* ── MOBILE HERO ── */}
      <div className="lg:hidden flex flex-col items-center w-full relative overflow-hidden" style={{ paddingTop: '2vh', paddingBottom: '4vh' }}>
        
        {/* Unified Mobile Graphics Cluster */}
        <div style={{
          position: 'relative',
          width: '220%', // Expanded significantly so the arc is flatter and proportionally fits the screen
          alignSelf: 'flex-start', // Bypass flexbox centering quirks
          marginLeft: '-60%', // Exactly center the 220% oversized container mathematically
          flexShrink: 0,
          aspectRatio: '1496 / 984',
        }}>
          

          {/* Logo */}
          <div style={{
            position: 'absolute',
            top: '20%',
            left: '50%',
            transform: 'translate(-50%, -50%) scale(0.75)',
            zIndex: 30,
          }}>
            <CenterLogoPremium />
          </div>

          {/* Text */}
          <div style={{
            position: 'absolute',
            top: '55%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            width: '45%', // ~100% of the physical screen width (since parent is 220%)
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <h1 style={{
              fontWeight: 800,
              fontSize: 'clamp(34px, 10vw, 48px)',
              lineHeight: 1.05,
              letterSpacing: '-0.02em',
              marginBottom: 12,
            }}>
              <span>Shamsh </span>
              <span className="text-wipe-animation">Trader</span>
            </h1>
            <p style={{
              fontWeight: 600,
              fontSize: 10,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              lineHeight: 1.6,
            }}>
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>DISCIPLINE TODAY.</span>
              <br/>
              <span style={{ color: '#22c55e' }}>FREEDOM TOMORROW.</span>
            </p>
          </div>

          {/* Button */}
          <div style={{
            position: 'absolute',
            top: '84%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
            width: '41%', // ~90% of physical screen width
            display: 'flex',
            justifyContent: 'center',
          }}>
            <button
              onClick={() => document.querySelector('#curriculum')?.scrollIntoView({ behavior: 'smooth' })}
              className="hover-lift"
              style={{
                background: 'linear-gradient(90deg, #84cc16 0%, #22c55e 100%)', 
                borderRadius: 999,
                display: 'flex',
                alignItems: 'center',
                padding: '8px 8px 8px 24px',
                gap: 12, 
                cursor: 'pointer',
                boxShadow: '0 0 40px rgba(34,197,94,0.3)',
                border: 'none',
                width: '100%',
              }}
            >
              <span className="flex-1 text-center" style={{ fontWeight: 700, fontSize: 16, color: '#000', letterSpacing: '0.2px' }}>{heroConfig.ctaText}</span>
              <div style={{
                background: '#050505',
                borderRadius: '50%',
                width: 38, height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
                flexShrink: 0
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </div>
            </button>
          </div>
        </div>

        {/* Dashboard Cards placed right below the orbit container */}
        <div className="w-full px-4 flex flex-col gap-4 relative z-30" style={{ marginTop: '-4%' }}>
          <FeaturesBar />
          <StatsBar />
        </div>
      </div>
    </section>
  );
}
