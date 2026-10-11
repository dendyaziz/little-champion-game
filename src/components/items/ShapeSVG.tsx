import React from 'react';
import type { ShapeType } from '../../utils/gameModes';

interface ShapeSVGProps {
  shape: ShapeType;
  className?: string;
  fill?: string;
  stroke?: string;
}

export const ShapeSVG: React.FC<ShapeSVGProps> = ({
  shape,
  className = 'w-12 h-12',
  fill = 'currentColor',
  stroke,
}) => {
  switch (shape) {
    case 'circle':
      return (
        <svg viewBox="0 0 100 100" className={className} fill={fill}>
          <circle cx="50" cy="50" r="42" stroke={stroke} strokeWidth={stroke ? 2 : 0} />
        </svg>
      );

    case 'square':
      return (
        <svg viewBox="0 0 100 100" className={className} fill={fill}>
          <rect x="12" y="12" width="76" height="76" rx="3" stroke={stroke} strokeWidth={stroke ? 2 : 0} />
        </svg>
      );

    case 'rectangle':
      return (
        <svg viewBox="0 0 100 100" className={className} fill={fill}>
          <rect x="8" y="24" width="84" height="52" rx="3" stroke={stroke} strokeWidth={stroke ? 2 : 0} />
        </svg>
      );

    case 'triangle':
      return (
        <svg viewBox="0 0 100 100" className={className} fill={fill}>
          <polygon
            points="50,14 88,80 12,80"
            stroke={stroke || fill}
            strokeWidth={stroke ? 2 : 6}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'rhombus':
      return (
        <svg viewBox="0 0 100 100" className={className} fill={fill}>
          <polygon
            points="50,10 88,50 50,90 12,50"
            stroke={stroke || fill}
            strokeWidth={stroke ? 2 : 6}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'heart':
      return (
        <svg viewBox="0 0 24 24" className={className} fill={fill}>
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            stroke={stroke}
            strokeWidth={stroke ? 0.5 : 0}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'star':
      return (
        <svg viewBox="0 0 24 24" className={className} fill={fill}>
          <path
            d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
            stroke={stroke}
            strokeWidth={stroke ? 0.5 : 0}
            strokeLinejoin="round"
          />
        </svg>
      );

    case 'oval':
      return (
        <svg viewBox="0 0 100 100" className={className} fill={fill}>
          <ellipse cx="50" cy="50" rx="44" ry="26" stroke={stroke} strokeWidth={stroke ? 2 : 0} />
        </svg>
      );

    default:
      return null;
  }
};
