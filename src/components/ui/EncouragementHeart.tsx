import React from 'react';

interface EncouragementHeartProps {
  className?: string;
}

export const EncouragementHeart: React.FC<EncouragementHeartProps> = ({
  className = 'w-36 h-36 sm:w-44 sm:h-44',
}) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient comforting rose glow behind heart */}
      <div className="absolute inset-0 bg-rose-400/25 rounded-full blur-2xl animate-pulse pointer-events-none" />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(244,63,94,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main 3D Heart Gradient */}
          <linearGradient id="heart-body" x1="40" y1="20" x2="160" y2="180" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FDA4AF" />
            <stop offset="25%" stopColor="#FB7185" />
            <stop offset="65%" stopColor="#F43F5E" />
            <stop offset="100%" stopColor="#E11D48" />
          </linearGradient>

          {/* Bandaid Gradient */}
          <linearGradient id="bandaid-fill" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#FDE047" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>

          {/* Sparkle Gold Gradient */}
          <linearGradient id="sparkle-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* --- MAIN 3D HEART BODY --- */}
        <path
          d="M 100,56 C 100,28 70,16 44,38 C 18,58 18,98 54,134 C 76,156 94,172 100,178 C 106,172 124,156 146,134 C 182,98 182,58 156,38 C 130,16 100,28 100,56 Z"
          fill="url(#heart-body)"
          stroke="#BE123C"
          strokeWidth="4"
          strokeLinejoin="round"
        />

        {/* Specular Curved 3D Highlights on Left Lobe */}
        <path
          d="M 48,46 C 34,58 32,84 48,110"
          stroke="#FFF1F2"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
          opacity="0.8"
        />
        <path
          d="M 52,50 C 40,62 38,82 52,102"
          stroke="#FFFFFF"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          opacity="0.95"
        />

        {/* Shading Depth on Right Lobe */}
        <path
          d="M 148,56 C 164,78 160,108 140,132"
          stroke="#9F1239"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* --- CUTE BANDAID ACROSS RIGHT LOBE (Symbolizing healing & try again) --- */}
        <g transform="rotate(-24 136 78)">
          {/* Bandaid Strip */}
          <rect
            x="110"
            y="68"
            width="52"
            height="22"
            rx="11"
            fill="url(#bandaid-fill)"
            stroke="#D97706"
            strokeWidth="2.5"
          />
          {/* Inner Gauze Pad */}
          <rect
            x="126"
            y="70"
            width="20"
            height="18"
            rx="4"
            fill="#FEF9C3"
            stroke="#F59E0B"
            strokeWidth="1.5"
          />
          {/* Red Cross on Gauze */}
          <line x1="136" y1="74" x2="136" y2="84" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="131" y1="79" x2="141" y2="79" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
          {/* Bandaid Air Holes */}
          <circle cx="118" cy="79" r="1.5" fill="#D97706" />
          <circle cx="154" cy="79" r="1.5" fill="#D97706" />
        </g>

        {/* --- KAWAII FACE --- */}
        {/* Rosy Blushing Cheeks */}
        <ellipse cx="68" cy="106" rx="8" ry="5" fill="#FDA4AF" opacity="0.9" />
        <ellipse cx="124" cy="106" rx="8" ry="5" fill="#FDA4AF" opacity="0.9" />

        {/* Big Shiny Hopeful Anime Eyes */}
        {/* Left Eye */}
        <ellipse cx="78" cy="94" rx="7" ry="9" fill="#4C0519" />
        <circle cx="75" cy="90" r="3.2" fill="#FFFFFF" />
        <circle cx="81" cy="97" r="1.6" fill="#FFFFFF" />

        {/* Right Eye */}
        <ellipse cx="114" cy="94" rx="7" ry="9" fill="#4C0519" />
        <circle cx="111" cy="90" r="3.2" fill="#FFFFFF" />
        <circle cx="117" cy="97" r="1.6" fill="#FFFFFF" />

        {/* Cute Encouraging Little Smile */}
        <path
          d="M 92,106 Q 96,114 100,106"
          stroke="#4C0519"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tiny Sweet Tear of Courage (Soft cyan droplet) */}
        <path
          d="M 126,102 C 126,98 128,96 128,96 C 128,96 130,98 130,102 C 130,104 128,105 128,105 C 128,105 126,104 126,102 Z"
          fill="#38BDF8"
          stroke="#0284C7"
          strokeWidth="0.8"
        />

        {/* --- FLOATING DECORATIVE MINI SPARKLES & HEARTS --- */}
        {/* Top-Left Sparkle */}
        <g className="animate-spin" style={{ transformOrigin: '32px 38px', animationDuration: '7s' }}>
          <path
            d="M 32,30 Q 32,38 40,38 Q 32,38 32,46 Q 32,38 24,38 Q 32,38 32,30 Z"
            fill="url(#sparkle-gold)"
            stroke="#FEF08A"
            strokeWidth="1"
          />
          <circle cx="32" cy="38" r="2" fill="#FFFFFF" />
        </g>

        {/* Top-Right Sparkle */}
        <g className="animate-spin" style={{ transformOrigin: '168px 40px', animationDuration: '9s' }}>
          <path
            d="M 168,32 Q 168,40 176,40 Q 168,40 168,48 Q 168,40 160,40 Q 168,40 168,32 Z"
            fill="url(#sparkle-gold)"
            stroke="#FEF08A"
            strokeWidth="1"
          />
          <circle cx="168" cy="40" r="2" fill="#FFFFFF" />
        </g>

        {/* Bottom Floating Mini Heart */}
        <path
          d="M 160,146 C 160,141 155,138 151,141 C 147,144 147,150 152,156 L 151,155 C 152,156 156,160 157,161 C 158,160 162,156 163,155 C 168,150 168,144 164,141 C 160,138 160,141 160,146 Z"
          fill="#FDA4AF"
          stroke="#E11D48"
          strokeWidth="1.5"
          className="animate-pulse"
        />
      </svg>
    </div>
  );
};
