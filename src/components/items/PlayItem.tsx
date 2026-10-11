import React from 'react';
import type { GameItem } from '../../utils/gameModes';
import { ShapeSVG } from './ShapeSVG';

interface PlayItemProps {
  item: GameItem;
  onTap: (item: GameItem) => void;
  layout: { x: number; y: number; side: number };
}

export const PlayItem: React.FC<PlayItemProps> = ({ item, onTap, layout }) => {
  if (item.isPopped) {
    return null;
  }

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (item.isPopping || item.isPopped) return;
    onTap(item);
  };

  // Preserve relative size variety while fitting even the largest glyph to its touch area.
  const scale = 1 + ((item.scale || 1) - 1) * 0.35;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Item ${item.value}`}
      style={{
        left: layout.x,
        top: layout.y,
        width: layout.side,
        height: layout.side,
        '--shape-size': `${layout.side * 0.64}px`,
        transform: 'translate(-50%, -50%)',
      } as React.CSSProperties}
      className={`
        absolute z-10
        flex items-center justify-center
        bg-transparent border-0 outline-none
        cursor-pointer select-none touch-manipulation
        play-item p-0
        ${item.isPopping ? 'pointer-events-none' : ''}
      `}
    >
      {/* Entrance animation layer: runs popIn once on mount and never resets on shake */}
      <div className="w-full h-full flex items-center justify-center animate-pop-in">
        {/* Interactive feedback layer: handles shake or pop-out independently */}
        <div
          className={`w-full h-full flex items-center justify-center ${
            item.isPopping
              ? 'animate-pop-out'
              : item.isShaking
              ? 'animate-shake'
              : ''
          }`}
        >
          {/* Inner tilt and scale layer: clean, crisp, flat with NO shadows */}
          <div
            style={{ transform: `rotate(${item.rotation}deg) scale(${scale})` }}
            className="flex items-center justify-center"
          >
            {/* SHAPES: Pure flat crisp SVG (NO shadows) */}
            {item.kind === 'shape' && item.shape && (
              <ShapeSVG
                shape={item.shape}
                fill={item.bgColor}
                className="play-shape"
              />
            )}

            {/* COLORS: Pure flat crisp colored shapes (with border stroke for White) */}
            {item.kind === 'color' && item.shape && (
              <ShapeSVG
                shape={item.shape}
                fill={item.colorHex || item.bgColor}
                stroke={item.strokeColor}
                className="play-shape"
              />
            )}

            {/* NUMBERS & LETTERS: Pure solid flat bold glyph (NO text-shadow) */}
            {(item.kind === 'number' || item.kind === 'letter') && (
              <span
                className="font-black select-none font-['Fredoka'] leading-none tracking-normal"
                style={{
                  color: item.textColor || item.bgColor,
                  fontSize: layout.side * (item.value.length > 1 ? 0.52 : 0.60),
                }}
              >
                {item.value}
              </span>
            )}
          </div>
        </div>
      </div>
    </button>
  );
};
