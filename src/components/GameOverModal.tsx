import React, { useEffect } from 'react';
import { RotateCcw, Home, Heart } from 'lucide-react';
import { EncouragementHeart } from './ui/EncouragementHeart';
import { sound } from '../audio/soundEngine';
import { announcer } from '../audio/speechAnnouncer';

interface GameOverModalProps {
  score?: number;
  gameTitle?: string;
  onRetry: () => void;
  onExit: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onRetry,
  onExit,
}) => {
  useEffect(() => {
    sound.playGameOver();
    announcer.speakLose();
  }, []);

  return (
    <div className="result-overlay fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Try again">
      <div className="result-card retry-card bg-white/95 rounded-[40px] px-6 py-6 sm:px-10 sm:py-8 max-w-xl w-full shadow-2xl border-4 border-rose-300 text-center flex flex-col items-center animate-pop-in pt-0">
        
        {/* Large, detailed 3D Encouraging Heart Asset floating on top */}
        <div className="result-illustration -mt-16 sm:-mt-20 mb-3 animate-float pointer-events-none">
          <EncouragementHeart className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52" />
        </div>

        {/* 5 Empty Hearts Display - UNBOXED, floating directly with zero container */}
        <div className="w-full my-4 flex items-center justify-center gap-2.5 sm:gap-3.5">
          {Array.from({ length: 5 }).map((_, idx) => (
            <div
              key={idx}
              className="transition-transform duration-300 drop-shadow-sm"
              style={{
                animation: `wiggleSlow 2s ease-in-out infinite ${idx * 0.15}s`,
              }}
            >
              <Heart className="w-9 h-9 sm:w-11 sm:h-11 text-slate-300 fill-slate-200/90 stroke-slate-400 stroke-[2.5]" />
            </div>
          ))}
        </div>

        {/* Big Action Buttons (Matching Victory Modal) */}
        <div className="result-actions flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onRetry}
            className="
              result-primary flex-1 py-4 px-6 rounded-2xl
              bg-amber-500 text-white font-black text-xl sm:text-2xl
              shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-[0_2px_0_0_#d97706]
              flex items-center justify-center gap-2.5 cursor-pointer btn-clay
            "
          >
            <RotateCcw className="w-7 h-7 stroke-[2.5]" />
            <span>Try Again</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="
              result-secondary py-4 px-6 rounded-2xl
              bg-slate-200 text-slate-700 font-bold text-xl sm:text-2xl
              shadow-[0_6px_0_0_#cbd5e1] active:translate-y-1 active:shadow-[0_2px_0_0_#cbd5e1]
              flex items-center justify-center gap-2 cursor-pointer btn-clay
            "
          >
            <Home className="w-7 h-7 stroke-[2.5]" />
            <span>Menu</span>
          </button>
        </div>

      </div>
    </div>
  );
};
