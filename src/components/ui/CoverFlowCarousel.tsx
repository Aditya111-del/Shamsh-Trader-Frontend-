import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CoverFlowCarouselProps {
  children: React.ReactNode[];
  mobileItemWidth?: number;
  desktopItemWidth?: number;
  mobileHeight?: number | string;
  desktopHeight?: number | string;
}

export function CoverFlowCarousel({ 
  children, 
  mobileItemWidth = 220, 
  desktopItemWidth = 340,
  mobileHeight = 350,
  desktopHeight = 420 
}: CoverFlowCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
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
  const spacing = isMobile ? 35 : 120; 



  return (
    <div className="relative w-full overflow-visible py-8" style={{ height: currentHeight }}>
      <div 
        className="flex justify-center items-center h-full w-full relative"
        style={{ perspective: 1200, transformStyle: 'preserve-3d' }}
      >
        <AnimatePresence>
          {React.Children.map(children, (child, index) => {
            if (!child) return null;
            
            const offset = index - activeIndex;
            const isCenter = offset === 0;
            
            // Calculate scale, zIndex, opacity based on offset
            const centerScale = isMobile ? 0.85 : 1.05;
            const sideScale = isMobile 
              ? Math.max(0.65, 0.85 - Math.abs(offset) * 0.12) 
              : Math.max(0.7, 1 - Math.abs(offset) * 0.15);
              
            const scale = isCenter ? centerScale : sideScale;
            const zIndex = 100 - Math.abs(offset);
            const opacity = 1; // "no tab should be transparent" according to user
            
            // 3D tilt effect: outer images tilt inward
            const direction = Math.sign(offset);
            const rotateY = isCenter ? 0 : direction * -35; 
            
            // In a 3D context, translateZ overrides zIndex. We MUST push side cards back and pull center card forward.
            const translateZ = isCenter ? 100 : -50 - (Math.abs(offset) * 50);
            
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
                  stiffness: 350,
                  damping: 30,
                  mass: 0.8
                }}
                style={{
                  width: itemWidth,
                  left: `calc(50% - ${Number(itemWidth)/2}px)`,
                  cursor: isCenter ? 'default' : 'pointer',
                  pointerEvents: 'auto', // Allow clicks on all visible cards
                  transformOrigin: isCenter ? 'center center' : (direction < 0 ? 'right center' : 'left center'), // pivot from the edge closest to center
                }}
                onClick={() => {
                  if (!isCenter) {
                    setActiveIndex(index);
                  }
                }}
              >
                {/* Disable pointer events on children if not active so clicks on the div itself trigger the slide change */}
                <div style={{ pointerEvents: isCenter ? 'auto' : 'none', width: '100%' }}>
                  {child}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center gap-6 mt-4 z-[110]">
        <div className="flex gap-2 bg-[#09090b] px-4 py-2.5 rounded-full border border-[rgba(255,255,255,0.05)] shadow-lg">
          {React.Children.map(children, (_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === activeIndex ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-700 hover:bg-gray-500'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
