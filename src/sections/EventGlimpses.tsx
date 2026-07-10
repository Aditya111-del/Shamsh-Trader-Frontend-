import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const GLIMPSE_EVENTS = [
  {
    name: "Dubai Traders Meetup",
    images: [
      "/images/research-1.jpg", 
      "/images/capability-2.jpg", 
      "/images/research-3.jpg", 
      "/images/capability-4.jpg"
    ]
  },
  {
    name: "Psychology Bootcamp",
    images: [
      "/images/capability-3.jpg", 
      "/images/research-4.jpg", 
      "/images/capability-1.jpg", 
      "/images/research-2.jpg"
    ]
  },
  {
    name: "Live Trading Arena",
    images: [
      "/images/research-2.jpg", 
      "/images/capability-4.jpg", 
      "/images/research-1.jpg", 
      "/images/capability-3.jpg"
    ]
  },
  {
    name: "Funded Trader Awards",
    images: [
      "/images/research-3.jpg",
      "/images/capability-1.jpg",
      "/images/capability-2.jpg",
      "/images/research-4.jpg"
    ]
  }
];

export default function EventGlimpses() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const [mobilePhotoIndex, setMobilePhotoIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); // Check immediately on mount
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-slider for both Desktop and Mobile
  useEffect(() => {
    if (!isMobile) {
      // Desktop Auto-slider
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % GLIMPSE_EVENTS.length);
      }, 6000); // Crossfade every 6 seconds
      return () => clearInterval(timer);
    } else {
      // Mobile Auto-slider
      const timer = setInterval(() => {
        setMobilePhotoIndex((prev) => {
          const currentImages = GLIMPSE_EVENTS[activeIndex].images;
          if (prev < currentImages.length - 1) {
            return prev + 1;
          } else {
            setActiveIndex((prevEvent) => (prevEvent + 1) % GLIMPSE_EVENTS.length);
            return 0;
          }
        });
      }, 3000); // Change photo every 3 seconds on mobile
      
      return () => clearInterval(timer);
    }
  }, [isMobile, activeIndex]);



  const currentEvent = GLIMPSE_EVENTS[activeIndex];
  // Duplicate images so the slow pan never runs out of screen width (Desktop only)
  const displayImages = [...currentEvent.images, ...currentEvent.images];

  return (
    <section className="relative py-24 overflow-hidden bg-[#060606] border-y border-white/5">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Title Area */}
        <div className="flex flex-col items-center justify-center text-center mb-12 w-full">
          <span className="text-[#22c55e] font-bold tracking-[0.2em] uppercase text-xs md:text-sm mb-4">
            Past Events
          </span>
          
          <div className="flex flex-row items-center justify-center gap-2 md:gap-4 text-xl sm:text-3xl md:text-5xl font-extrabold text-white w-full">
            <span>Glimpses from</span>
            
            {/* Rolling Text Container */}
            <div className="relative flex items-center justify-center overflow-hidden h-[1.2em]">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={currentEvent.name}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="accent-italic whitespace-nowrap block"
                  style={{
                    color: '#eab308',
                    filter: 'drop-shadow(0 4px 12px rgba(234,179,8,0.3))',
                  }}
                >
                  {currentEvent.name}
                </motion.span>
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      {/* --- DESKTOP VIEW: Full-width Image Carousel --- */}
      <div className="hidden md:block relative w-full h-[350px] md:h-[450px] overflow-hidden mt-4">
        {/* Left/Right Edge Fade Masks for a seamless look */}
        <div className="absolute inset-y-0 left-0 w-48 bg-gradient-to-r from-[#060606] to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-48 bg-gradient-to-l from-[#060606] to-transparent z-20 pointer-events-none" />

        <AnimatePresence>
          <motion.div
            key={currentEvent.name}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            {/* The actual panning container */}
            <motion.div 
               initial={{ x: "0%" }}
               animate={{ x: "-15%" }} 
               transition={{ duration: 6, ease: "linear" }}
               className="flex gap-6 min-w-max h-full px-12"
            >
               {displayImages.map((src, i) => (
                  <div 
                    key={`desktop-${currentEvent.name}-${i}`} 
                    className="relative h-full w-[350px] md:w-[450px] rounded-3xl overflow-hidden shadow-2xl shrink-0 group border border-white/10"
                  >
                     <img 
                       src={src} 
                       className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110" 
                       alt={`Glimpse from ${currentEvent.name}`} 
                     />
                     
                     <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                       <div className="w-8 h-1 bg-[#22c55e] rounded-full mb-2" />
                       <p className="text-white/90 font-bold text-sm tracking-widest uppercase">
                         {currentEvent.name}
                       </p>
                     </div>
                  </div>
               ))}
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div 
        className="md:hidden relative w-full h-[400px] mt-4 flex items-center justify-center cursor-pointer select-none"
        onClick={() => navigate('/events')}
      >
        <div className="relative w-[300px] h-[340px]">
          <AnimatePresence>
            {currentEvent.images.map((src, idx) => {
              if (idx < mobilePhotoIndex) return null; // Image already swiped away
              
              const stackPos = idx - mobilePhotoIndex; // 0 (top), 1 (middle), 2 (bottom)
              if (stackPos > 2) return null; // Show max 3 cards for performance/looks
              
              const scale = 1 - (stackPos * 0.05); // 1, 0.95, 0.9
              const yOffset = stackPos * 15;       // 0px, 15px, 30px
              const zIndex = 10 - stackPos;
              const opacity = 1 - (stackPos * 0.15); // 1, 0.85, 0.7
              
              return (
                <motion.div
                  key={`mobile-${currentEvent.name}-${idx}`}
                  initial={stackPos === 0 ? { opacity: 0, y: 50, scale: 0.9 } : false}
                  animate={{ opacity, y: yOffset, scale }}
                  exit={{ opacity: 0, x: -100, rotate: -15, scale: 0.9 }} // Swipe left away animation
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-white/20 origin-top"
                  style={{ zIndex }}
                >
                  <img src={src} className="w-full h-full object-cover pointer-events-none" alt="Mobile Stack" />
                  
                  {/* Glass overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/90 to-transparent">
                     <div className="w-8 h-1 bg-[#22c55e] rounded-full mb-2" />
                     <div className="flex justify-between items-end">
                       <p className="text-white/90 font-bold text-xs tracking-wider uppercase pr-2">
                         {currentEvent.name}
                       </p>
                       <span className="text-xs font-mono text-white/50 whitespace-nowrap">
                         {idx + 1}/{currentEvent.images.length}
                       </span>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
        

      </div>
    </section>
  );
}
