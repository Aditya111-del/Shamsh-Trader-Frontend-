import { useEffect, useRef } from 'react';

export default function OrbVideo({ size, scale = 2.1 }: { size: number; scale?: number }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      const v = videoRef.current;
      if (!v) return;
      v.loop = true;
      v.muted = true;
      if (v.paused || v.ended) v.play().catch(() => {});
    }, 1500);
    return () => clearInterval(id);
  }, []);

  return (
    <span
      style={{
        position: 'relative',
        width: size,
        height: size,
        borderRadius: 999,
        overflow: 'hidden',
        background: '#000',
        flexShrink: 0,
        display: 'block',
      }}
    >
      <video
        ref={videoRef}
        src="/genie-orb.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '100%',
          height: '100%',
          transform: `translate(-50%,-50%) scale(${scale})`,
          objectFit: 'cover',
        }}
      />
    </span>
  );
}
