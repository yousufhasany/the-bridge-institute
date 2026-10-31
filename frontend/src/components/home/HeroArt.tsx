/** Decorative cable-stayed bridge illustration echoing the brochure cover. */
export function HeroArt({ className }: { className?: string }) {
  const cables = [40, 80, 120, 160, 200, 260, 300, 340, 380, 420];
  return (
    <svg viewBox="0 0 480 320" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1856B5" stopOpacity="0.55" />
          <stop offset="1" stopColor="#092B4C" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1856B5" stopOpacity="0.35" />
          <stop offset="1" stopColor="#092B4C" stopOpacity="0" />
        </linearGradient>
      </defs>
      <circle cx="360" cy="110" r="120" fill="url(#hero-sky)" />
      <g fill="#E7F1FA" opacity="0.14">
        <rect x="20" y="170" width="26" height="70" />
        <rect x="52" y="150" width="20" height="90" />
        <rect x="78" y="185" width="30" height="55" />
        <rect x="372" y="160" width="24" height="80" />
        <rect x="402" y="140" width="18" height="100" />
        <rect x="426" y="175" width="34" height="65" />
      </g>
      <g stroke="#FFFFFF" strokeLinecap="round" fill="none">
        <path d="M240 28 L232 238" strokeWidth="9" />
        {cables.map((x) => (
          <path key={x} d={`M238 44 L${x} 236`} strokeWidth="2" opacity="0.85" />
        ))}
        <path d="M6 236 H474" strokeWidth="9" />
      </g>
      <path d="M0 270 Q240 240 480 270 L480 320 L0 320 Z" fill="url(#hero-water)" />
      <path d="M30 262 Q240 236 450 262" stroke="#F7941D" strokeWidth="8" strokeLinecap="round" fill="none" />
    </svg>
  );
}
