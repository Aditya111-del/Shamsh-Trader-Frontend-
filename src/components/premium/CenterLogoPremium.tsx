export default function CenterLogoPremium() {
  return (
    <div
      style={{
        position: 'relative',
        width: 280, // Scaled down to proportionally match the new 900px container width
        height: 280,
        animation: 'logoFadeIn 1.2s cubic-bezier(0.16,1,0.3,1) forwards',
        opacity: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // Use a radial mask to perfectly cut the square into a soft circle,
        // hiding the black corners while keeping the center fully opaque.
        maskImage: 'radial-gradient(circle closest-side, black 82%, transparent 100%)',
        WebkitMaskImage: 'radial-gradient(circle closest-side, black 82%, transparent 100%)',
      }}
    >
      <img
        src="/center-logo.png"
        alt="Shamsh Trader Center Logo"
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        draggable={false}
      />
    </div>
  );
}
