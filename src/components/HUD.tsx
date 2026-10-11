import React from 'react';
import { Heart, Volume2, VolumeX, Home } from 'lucide-react';
import type { GameType, ShapeType, ColorDefinition } from '../utils/gameModes';
import { ShapeSVG } from './items/ShapeSVG';

interface HUDProps {
  hearts: number; // 0 to 5
  maxHearts?: number;
  score: number;
  round: number; // 1 to 3
  isCompleted?: boolean;
  gameType: GameType;
  targetValue?: string;
  targetShape?: ShapeType;
  targetColor?: ColorDefinition;
  targetsRemaining?: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onExit: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  hearts,
  maxHearts = 5,
  round,
  isCompleted = false,
  gameType,
  targetValue,
  targetShape,
  targetColor,
  isMuted,
  onToggleMute,
  onExit,
}) => {
  const completedRounds = isCompleted ? 3 : Math.max(0, round - 1);
  const progressPercent = (completedRounds / 3) * 100;

  return (
    <>
      {/* Immersive Top Screen Progress Bar: 0% on Round 1, 33% on Round 2, 66% on Round 3, 100% on Victory */}
      <div className="fixed top-0 left-0 right-0 h-2.5 sm:h-3 z-[60] bg-sky-200/50 overflow-hidden pointer-events-none">
        <div
          className="h-full bg-emerald-400 rounded-r-full transition-all duration-500 ease-out shadow-xs"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <header className="game-hud select-none">
        
        {/* Clear, tactile navigation controls; answers remain unboxed. */}
        <div className="hud-controls">
          <button
            type="button"
            onClick={onExit}
            aria-label="Back to Menu"
            className="hud-button"
          >
            <Home className="w-8 h-8 stroke-[2.5]" />
          </button>

          <button
            type="button"
            onClick={onToggleMute}
            aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
            className={`hud-button ${isMuted ? 'is-muted' : ''}`}
          >
            {isMuted ? (
              <VolumeX className="w-8 h-8 stroke-[2.5] text-rose-500" />
            ) : (
              <Volume2 className="w-8 h-8 stroke-[2.5]" />
            )}
          </button>
        </div>

        {/* Center: ONLY the target item to find, playfully wiggling (NO badges, NO counts) */}
        {gameType === 'pick' ? (
          <div className="hud-target flex items-center justify-center pointer-events-none">
            {targetShape && (
              <div className="animate-wiggle">
                <ShapeSVG shape={targetShape} fill="#F59E0B" className="w-12 h-12 sm:w-14 sm:h-14 drop-shadow-sm" />
              </div>
            )}
            {targetColor && (
              <div className="animate-wiggle">
                <span
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-3 border-white shadow-md inline-block"
                  style={{ backgroundColor: targetColor.hex }}
                />
              </div>
            )}
            {targetValue && !targetShape && !targetColor && (
              <span
                className="font-black text-5xl sm:text-6xl font-['Fredoka'] leading-none animate-wiggle inline-block drop-shadow-sm select-none"
                style={{ color: '#EA580C' }}
              >
                {targetValue}
              </span>
            )}
          </div>
        ) : (
          <div className="w-12 h-12" />
        )}

        {/* Right: 5 Hearts only (Clean, focused) */}
        <div className="hud-hearts flex items-center gap-1 sm:gap-1.5" aria-label={`${hearts} hearts remaining`}>
          {Array.from({ length: maxHearts }).map((_, idx) => {
            const hasHeart = idx < hearts;
            return (
              <Heart
                key={idx}
                className={`w-7 h-7 sm:w-8 sm:h-8 transition-all duration-300 ${
                  hasHeart
                    ? 'text-rose-500 fill-rose-500 scale-100'
                    : 'text-slate-300/80 fill-slate-300/60 scale-90'
                }`}
              />
            );
          })}
        </div>

      </header>
    </>
  );
};
