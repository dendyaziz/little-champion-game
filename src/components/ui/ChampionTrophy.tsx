import React from 'react';

interface ChampionTrophyProps {
  className?: string;
}

export const ChampionTrophy: React.FC<ChampionTrophyProps> = ({ className = 'w-36 h-36 sm:w-44 sm:h-44' }) => {
  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      {/* Ambient golden aura / glow behind trophy */}
      <div className="absolute inset-0 bg-amber-400/25 rounded-full blur-2xl animate-pulse pointer-events-none" />

      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-[0_12px_24px_rgba(245,158,11,0.35)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Main Gold Cup Gradient */}
          <linearGradient id="gold-body" x1="40" y1="40" x2="160" y2="140" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="25%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Golden Rim Gradient */}
          <linearGradient id="gold-rim" x1="50" y1="40" x2="150" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="40%" stopColor="#FFFBEB" />
            <stop offset="70%" stopColor="#FBBF24" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          {/* Deep Cup Interior */}
          <linearGradient id="gold-inside" x1="100" y1="36" x2="100" y2="54" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#B45309" />
            <stop offset="100%" stopColor="#78350F" />
          </linearGradient>

          {/* Handle Gradient */}
          <linearGradient id="gold-handle" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="50%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#B45309" />
          </linearGradient>

          {/* Pedestal Gradient */}
          <linearGradient id="pedestal-wood" x1="60" y1="150" x2="140" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#0F172A" />
          </linearGradient>

          {/* Plaque Gradient */}
          <linearGradient id="gold-plaque" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#FFFBEB" />
            <stop offset="100%" stopColor="#F59E0B" />
          </linearGradient>
        </defs>

        {/* --- LEFT & RIGHT HANDLES --- */}
        {/* Left Handle Outer */}
        <path
          d="M 64,55 C 32,55 24,95 56,115 C 60,117 66,112 64,106 C 42,92 46,67 66,67 Z"
          fill="url(#gold-handle)"
          stroke="#B45309"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Left Handle Highlight */}
        <path
          d="M 60,60 C 38,62 32,90 54,106"
          stroke="#FEF08A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Right Handle Outer */}
        <path
          d="M 136,55 C 168,55 176,95 144,115 C 140,117 134,112 136,106 C 158,92 154,67 134,67 Z"
          fill="url(#gold-handle)"
          stroke="#B45309"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        {/* Right Handle Highlight */}
        <path
          d="M 140,60 C 162,62 168,90 146,106"
          stroke="#FEF08A"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* --- PEDESTAL & STEM --- */}
        {/* Pedestal Base (Chunky, dark slate with 3D bottom bevel) */}
        <path
          d="M 58,162 L 64,152 L 136,152 L 142,162 L 142,184 C 142,187 139,190 136,190 L 64,190 C 61,190 58,187 58,184 Z"
          fill="url(#pedestal-wood)"
          stroke="#0F172A"
          strokeWidth="3"
        />
        {/* Pedestal Foot Light Reflection */}
        <line x1="62" y1="187" x2="138" y2="187" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />

        {/* Golden Plaque on Base */}
        <rect
          x="74"
          y="160"
          width="52"
          height="18"
          rx="3.5"
          fill="url(#gold-plaque)"
          stroke="#B45309"
          strokeWidth="2"
        />
        {/* Little decorative star on plaque */}
        <polygon
          points="100,163 102,168 107,169 103,172 104,177 100,174 96,177 97,172 93,169 98,168"
          fill="#D97706"
        />

        {/* Stem Base Golden Ring */}
        <path
          d="M 78,146 C 78,142 122,142 122,146 L 126,153 L 74,153 Z"
          fill="url(#gold-body)"
          stroke="#B45309"
          strokeWidth="3"
        />

        {/* Stem (Slender golden waist connecting cup to base) */}
        <path
          d="M 90,122 L 110,122 L 108,144 L 92,144 Z"
          fill="url(#gold-body)"
          stroke="#B45309"
          strokeWidth="3"
        />
        {/* Stem Highlight */}
        <rect x="96" y="123" width="3" height="20" rx="1.5" fill="#FFFBEB" opacity="0.8" />

        {/* --- CUP BODY --- */}
        {/* Main Cup Goblet */}
        <path
          d="M 54,46 L 146,46 C 146,46 148,96 112,122 L 88,122 C 52,96 54,46 54,46 Z"
          fill="url(#gold-body)"
          stroke="#B45309"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Interior Depth of Cup Rim */}
        <ellipse cx="100" cy="46" rx="46" ry="11" fill="url(#gold-inside)" stroke="#92400E" strokeWidth="2.5" />
        
        {/* Golden Lip Ring Rim (3D top flange) */}
        <ellipse cx="100" cy="45" rx="46" ry="7" fill="url(#gold-rim)" stroke="#B45309" strokeWidth="3" />
        {/* Lip Highlight */}
        <path
          d="M 64,44 Q 100,41 136,44"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Vertical Curved 3D Highlights on Cup Left */}
        <path
          d="M 68,54 C 66,74 76,102 94,116"
          stroke="#FFFBEB"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.65"
        />
        <path
          d="M 76,56 C 74,74 82,98 94,112"
          stroke="#FFFFFF"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.9"
        />

        {/* Shadow shading on Cup Right */}
        <path
          d="M 132,54 C 134,74 126,102 108,116"
          stroke="#B45309"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
          opacity="0.4"
        />

        {/* --- CENTER EMBLEM: SMILING GOLDEN STAR --- */}
        {/* Center Star Badge Backing */}
        <circle cx="100" cy="80" r="19" fill="#FDE047" stroke="#D97706" strokeWidth="2.5" />
        <circle cx="100" cy="80" r="16" fill="#F59E0B" />

        {/* Cute Smiling Star in Center Badge */}
        <polygon
          points="100,68 103,75 111,76 105,82 107,89 100,85 93,89 95,82 89,76 97,75"
          fill="#FEF08A"
          stroke="#B45309"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Happy cute eyes on star */}
        <circle cx="98" cy="79" r="1.2" fill="#78350F" />
        <circle cx="102" cy="79" r="1.2" fill="#78350F" />
        {/* Smile */}
        <path d="M 98,82 Q 100,84 102,82" stroke="#78350F" strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* --- CELEBRATORY MAGIC SPARKLES --- */}
        {/* Top-Right Large Sparkle */}
        <g className="animate-spin" style={{ transformOrigin: '168px 36px', animationDuration: '6s' }}>
          <path
            d="M 168,26 Q 168,36 178,36 Q 168,36 168,46 Q 168,36 158,36 Q 168,36 168,26 Z"
            fill="#FBBF24"
            stroke="#FEF08A"
            strokeWidth="1"
          />
          <circle cx="168" cy="36" r="2.5" fill="#FFFFFF" />
        </g>

        {/* Top-Left Small Sparkle */}
        <g className="animate-spin" style={{ transformOrigin: '32px 38px', animationDuration: '8s' }}>
          <path
            d="M 32,30 Q 32,38 40,38 Q 32,38 32,46 Q 32,38 24,38 Q 32,38 32,30 Z"
            fill="#FBBF24"
            stroke="#FEF08A"
            strokeWidth="1"
          />
          <circle cx="32" cy="38" r="2" fill="#FFFFFF" />
        </g>

        {/* Bottom-Right Small Star Sparkle */}
        <circle cx="162" cy="140" r="3" fill="#FDE047" opacity="0.9" />
        <circle cx="38" cy="136" r="3" fill="#FDE047" opacity="0.9" />
      </svg>
    </div>
  );
};
