import React from 'react';
import type { GameItem } from '../../utils/gameModes';
import { ShapeSVG } from './ShapeSVG';

interface PlayItemProps {
  item: GameItem;
  onTap: (item: GameItem) => void;
}

export const PlayItem: React.FC<PlayItemProps> = ({ item, onTap }) => {
  if (item.isPopped) {
    return null;
  }

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (item.isPopping || item.isPopped) return;
    onTap(item);
  };

  const scale = item.scale || 1.0;

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Item ${item.value}`}
      style={{
        left: `${item.x}%`,
        top: `${item.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      className={`
        absolute z-10
        w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52
        flex items-center justify-center
        bg-transparent border-0 outline-none
        cursor-pointer select-none touch-manipulation
        focus:outline-none -m-4 p-4
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
            style={{
              transform: `rotate(${item.rotation}deg) scale(${scale})`,
            }}
            className="flex items-center justify-center"
          >
            {/* SHAPES: Pure flat crisp SVG (NO shadows) */}
            {item.kind === 'shape' && item.shape && (
              <ShapeSVG
                shape={item.shape}
                fill={item.bgColor}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
              />
            )}

            {/* COLORS: Pure flat crisp colored shapes (NO shadows) */}
            {item.kind === 'color' && item.shape && (
              <ShapeSVG
                shape={item.shape}
                fill={item.colorHex || item.bgColor}
                className="w-24 h-24 sm:w-32 sm:h-32 md:w-36 md:h-36"
              />
            )}

            {/* NUMBERS & LETTERS: Pure solid flat bold glyph (NO text-shadow) */}
            {(item.kind === 'number' || item.kind === 'letter') && (
              <span
                className="font-black text-7xl sm:text-8xl md:text-9xl select-none font-['Fredoka'] leading-none tracking-normal"
                style={{
                  color: item.textColor || item.bgColor,
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
