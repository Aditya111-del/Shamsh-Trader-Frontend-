import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoverFlowCarouselProps {
  children: React.ReactNode[];
  mobileItemWidth?: number;
  desktopItemWidth?: number;
  mobileHeight?: number | string;
  desktopHeight?: number | string;
  mobileSpacing?: number;
  desktopSpacing?: number;
  initialIndex?: number;
}

export function CoverFlowCarousel({ 
  children, 
  mobileItemWidth = 220, 
  desktopItemWidth = 340,
  mobileHeight = 350,
  desktopHeight = 420,
  mobileSpacing,
  desktopSpacing,
  initialIndex = 0,
}: CoverFlowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemWidth = isMobile ? mobileItemWidth : desktopItemWidth;
  const currentHeight = isMobile ? mobileHeight : desktopHeight;
  // Spacing defines how far apart the centers of the overlapping cards are
  const spacing = isMobile ? (mobileSpacing ?? 35) : (desktopSpacing ?? 120);

  return (
    <div className="relative w-full overflow-visible py-4">
      <div 
        className="flex justify-center items-center w-full relative"
        style={{ height: currentHeight, perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence>
          {React.Children.map(children, (child, index) => {
            if (!child) return null;
            
            const offset = index - activeIndex;
            const isCenter = offset === 0;
            
            // Calculate scale, zIndex, opacity based on offset
            const centerScale = isMobile ? 0.92 : 1.04;
            const sideScale = isMobile 
              ? Math.max(0.72, 0.88 - Math.abs(offset) * 0.12) 
              : Math.max(0.8, 0.98 - Math.abs(offset) * 0.12);
              
            const scale = isCenter ? centerScale : sideScale;
            const zIndex = 100 - Math.abs(offset);
            const opacity = 1;
            
            // 3D tilt effect: outer images tilt inward
            const direction = Math.sign(offset);
            const rotateY = isCenter ? 0 : direction * -28; 
            
            // In a 3D context, translateZ overrides zIndex.
            const translateZ = isCenter ? 80 : -40 - (Math.abs(offset) * 40);
            
            // Translate X: items to the left are pushed left, items to the right pushed right.
            let translateX = 0;
            if (offset !== 0) {
              const baseShift = (itemWidth / 2) + spacing;
              const additionalShift = (Math.abs(offset) - 1) * (spacing * 0.85);
              translateX = direction * (baseShift + additionalShift);
            }

            return (
              <motion.div
                key={index}
                className="absolute top-1/2"
                initial={false}
                animate={{
                  scale,
                  x: translateX,
                  y: "-50%",
                  z: translateZ,
                  rotateY,
                  zIndex,
                  opacity,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 320,
                  damping: 28,
                  mass: 0.8
                }}
                style={{
                  width: itemWidth,
                  left: `calc(50% - ${Number(itemWidth)/2}px)`,
                  cursor: isCenter ? 'default' : 'pointer',
                  pointerEvents: 'auto',
                  transformOrigin: isCenter ? 'center center' : (direction < 0 ? 'right center' : 'left center'),
                }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
              >
                <div style={{ pointerEvents: isCenter ? 'auto' : 'none', width: '100%' }}>
                  {child}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls - Placed BELOW the cards so it NEVER overlaps! */}
      <div className="flex items-center justify-center gap-6 mt-6 z-[110] relative">
        <div className="flex gap-2 bg-[#09090b]/90 backdrop-blur-md px-4 py-2 rounded-full border border-[rgba(255,255,255,0.08)] shadow-lg">
          {React.Children.map(children, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex ? 'bg-emerald-500 w-6 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-zinc-700 w-2 hover:bg-zinc-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
