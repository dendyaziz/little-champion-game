import React from 'react';
import { getStarTypes, type StarType } from '../../utils/scoring';

interface StarRatingProps {
  stars: number; // e.g. 0 to 5 in 0.5 increments
  size?: 'md' | 'lg' | 'xl';
  animated?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  stars,
  size = 'xl',
  animated = true,
}) => {
  const starTypes = getStarTypes(stars);

  const sizeClasses = {
    md: 'w-10 h-10 sm:w-12 sm:h-12',
    lg: 'w-12 h-12 sm:w-14 sm:h-14',
    xl: 'w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px]',
  }[size];

  return (
    <div className="flex items-center justify-center gap-2 sm:gap-3 md:gap-4 py-2 select-none">
      {starTypes.map((type, idx) => (
        <div
          key={idx}
          className={`${animated ? 'animate-pop-in' : ''} transition-transform hover:scale-110 active:scale-95`}
          style={{ animationDelay: animated ? `${idx * 160}ms` : '0ms' }}
        >
          <PuffyStar type={type} className={sizeClasses} />
        </div>
      ))}
    </div>
  );
};

// Puffy 5-point star path (smoothly rounded outer tips and rounded inner valleys)
const STAR_PATH =
  'M 50,6 ' +
  'C 53,13 58,25 64,31 ' +
  'C 70,37 83,39 90,41 ' +
  'C 85,47 75,56 73,63 ' +
  'C 71,71 74,84 69,89 ' +
  'C 63,86 51,78 45,78 ' +
  'C 39,78 27,86 21,89 ' +
  'C 16,84 19,71 17,63 ' +
  'C 15,56 5,47 0,41 ' +
  'C 7,39 20,37 26,31 ' +
  'C 32,25 37,13 40,6 ' +
  'C 43,1 47,1 50,6 Z';

// Inner face path (slightly scaled)
const STAR_BODY_PATH =
  'M 50,8 ' +
  'C 52.8,14.5 57.5,25.5 63,31 ' +
  'C 68.5,36.5 81,38.5 87.5,40.5 ' +
  'C 82.5,46 73,55 71,62 ' +
  'C 69,70 72,82 67.5,86.5 ' +
  'C 62,83.5 51,76 45,76 ' +
  'C 39,76 28,83.5 22.5,86.5 ' +
  'C 18,82 21,70 19,62 ' +
  'C 17,55 7.5,46 2.5,40.5 ' +
  'C 9,38.5 21.5,36.5 27,31 ' +
  'C 32.5,25.5 37.2,14.5 40,8 ' +
  'C 42.5,3 47.5,3 50,8 Z';

const PuffyStar: React.FC<{ type: StarType; className: string }> = ({ type, className }) => {
  const uniqueId = React.useId().replace(/:/g, '');

  if (type === 'empty') {
    return (
      <svg
        viewBox="-5 0 100 100"
        className={`${className} drop-shadow-[0_6px_10px_rgba(0,0,0,0.08)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`silver-body-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        {/* 3D Bottom Clay Shadow */}
        <path d={STAR_PATH} transform="translate(0, 5)" fill="#94A3B8" />

        {/* Main Puffy Silver Star Body */}
        <path
          d={STAR_BODY_PATH}
          fill={`url(#silver-body-${uniqueId})`}
          stroke="#94A3B8"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Gentle sleepy peaceful eyes (~ ~) */}
        <path d="M 33,48 Q 38,44 43,48" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 57,48 Q 62,44 67,48" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" fill="none" />

        {/* Soft resting smile */}
        <path d="M 46,56 Q 50,59 54,56" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" fill="none" />
      </svg>
    );
  }

  if (type === 'half') {
    const clipId = `half-clip-${uniqueId}`;

    return (
      <svg
        viewBox="-5 0 100 100"
        className={`${className} drop-shadow-[0_8px_16px_rgba(245,158,11,0.3)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <clipPath id={clipId}>
            <rect x="-10" y="0" width="55" height="100" />
          </clipPath>

          <linearGradient id={`gold-body-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FEF08A" />
            <stop offset="35%" stopColor="#FBBF24" />
            <stop offset="80%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#D97706" />
          </linearGradient>

          <linearGradient id={`silver-half-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="30%" stopColor="#F1F5F9" />
            <stop offset="100%" stopColor="#CBD5E1" />
          </linearGradient>
        </defs>

        {/* --- Background: Sleepy Silver Star --- */}
        <path d={STAR_PATH} transform="translate(0, 5)" fill="#94A3B8" />
        <path
          d={STAR_BODY_PATH}
          fill={`url(#silver-half-${uniqueId})`}
          stroke="#94A3B8"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />
        <path d="M 57,48 Q 62,44 67,48" stroke="#64748B" strokeWidth="2.8" strokeLinecap="round" fill="none" />
        <path d="M 46,56 Q 50,59 54,56" stroke="#64748B" strokeWidth="2.2" strokeLinecap="round" fill="none" />

        {/* --- Foreground Left Half: Golden Kawaii Star --- */}
        <g clipPath={`url(#${clipId})`}>
          <path d={STAR_PATH} transform="translate(0, 5)" fill="#B45309" />
          <path
            d={STAR_BODY_PATH}
            fill={`url(#gold-body-${uniqueId})`}
            stroke="#B45309"
            strokeWidth="3.5"
            strokeLinejoin="round"
          />

          {/* Left glossy shine */}
          <path
            d="M 46,12 C 40,24 33,32 24,36"
            stroke="#FFFFFF"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
            opacity="0.85"
          />

          {/* Left happy eye */}
          <path d="M 33,48 Q 38,42 43,48" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          {/* Left blush */}
          <ellipse cx="32" cy="54" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.85" />
          {/* Half mouth */}
          <path d="M 46,55 Q 50,61 50,61 L 50,55 Z" fill="#DC2626" />
        </g>
      </svg>
    );
  }

  // --- FULL GLORIOUS KAWAII 3D GOLDEN STAR ---
  return (
    <svg
      viewBox="-5 0 100 100"
      className={`${className} drop-shadow-[0_10px_20px_rgba(245,158,11,0.38)]`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Warm Golden 3D Clay Body Gradient */}
        <linearGradient id={`gold-body-${uniqueId}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="25%" stopColor="#FDE047" />
          <stop offset="55%" stopColor="#FBBF24" />
          <stop offset="85%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* 3D Depth Shadow Base */}
      <path d={STAR_PATH} transform="translate(0, 5)" fill="#B45309" />

      {/* Main Star Body */}
      <path
        d={STAR_BODY_PATH}
        fill={`url(#gold-body-${uniqueId})`}
        stroke="#B45309"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Glossy 3D Highlight Curve on Top-Left Arm */}
      <path
        d="M 46,12 C 40,24 33,32 23,36"
        stroke="#FFFFFF"
        strokeWidth="3.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.85"
      />
      <circle cx="48" cy="12" r="2.5" fill="#FFFFFF" opacity="0.9" />

      {/* Adorable Kawaii Happy Curved Eyes (^ ^) */}
      <path d="M 33,48 Q 38,42 43,48" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      <path d="M 57,48 Q 62,42 67,48" stroke="#78350F" strokeWidth="3.2" strokeLinecap="round" fill="none" />

      {/* Soft Rosy Blushing Cheeks */}
      <ellipse cx="31" cy="54" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.85" />
      <ellipse cx="69" cy="54" rx="4.5" ry="3" fill="#FDA4AF" opacity="0.85" />

      {/* Sweet Open Smiling Mouth */}
      <path d="M 45,55 Q 50,62 55,55 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="1" />
      {/* Tongue highlight inside mouth */}
      <ellipse cx="50" cy="58" rx="2.5" ry="1.8" fill="#F87171" />

      {/* Sparkle Twinkle on Top-Right Tip */}
      <g transform="translate(68, 22)">
        <path d="M 0,-5 Q 0,0 5,0 Q 0,0 0,5 Q 0,0 -5,0 Q 0,0 0,-5 Z" fill="#FFFFFF" opacity="0.9" />
        <circle cx="0" cy="0" r="1.5" fill="#FEF08A" />
      </g>
    </svg>
  );
};
