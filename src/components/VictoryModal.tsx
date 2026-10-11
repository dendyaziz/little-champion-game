import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { calculateStars } from '../utils/scoring';
import { formatDurationText } from '../utils/recordsStore';
import { StarRating } from './ui/StarRating';
import { ChampionTrophy } from './ui/ChampionTrophy';
import { sound } from '../audio/soundEngine';
import { announcer } from '../audio/speechAnnouncer';
import { RotateCcw, Home, Timer, Zap } from 'lucide-react';

interface VictoryModalProps {
  score: number;
  maxScore: number;
  heartsRemaining: number;
  gameId: string;
  gameTitle: string;
  durationSeconds?: number;
  isNewBest?: boolean;
  onPlayAgain: () => void;
  onExit: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  score,
  maxScore,
  gameId,
  durationSeconds = 0,
  isNewBest = false,
  onPlayAgain,
  onExit,
}) => {
  const stars = calculateStars(score, maxScore);

  useEffect(() => {
    // Save high score / stars to localStorage
    try {
      const storageKey = `kids_game_stars_${gameId}`;
      const previousStars = parseFloat(localStorage.getItem(storageKey) || '0');
      if (stars > previousStars) {
        localStorage.setItem(storageKey, String(stars));
      }
    } catch {
      // ignore storage error
    }

    // Play fanfare and celebratory voice (New Record voice if fastest time!)
    sound.playFanfare();
    if (isNewBest) {
      announcer.speakNewRecord();
    } else {
      announcer.cheer();
    }

    confetti({
      particleCount: isNewBest ? 120 : 90,
      spread: isNewBest ? 90 : 75,
      origin: { y: 0.55 },
      colors: ['#F59E0B', '#38BDF8', '#10B981', '#EC4899', '#8B5CF6'],
    });

    // Staggered star dings
    const numStars = Math.ceil(stars);
    for (let i = 0; i < numStars; i++) {
      setTimeout(() => {
        sound.playStarDing(i);
      }, (i + 1) * 350);
    }
  }, [gameId, stars, isNewBest]);

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white/95 rounded-[40px] px-6 py-6 sm:px-10 sm:py-8 max-w-xl w-full shadow-2xl border-4 border-amber-300 text-center flex flex-col items-center animate-pop-in pt-0">
        
        {/* Large, detailed 3D Champion Trophy Asset floating on top */}
        <div className="-mt-16 sm:-mt-20 mb-2 animate-float pointer-events-none">
          <ChampionTrophy className="w-40 h-40 sm:w-48 sm:h-48 md:w-52 md:h-52" />
        </div>

        {/* 5-Star Display - UNBOXED, floating directly with zero container */}
        <div className="w-full my-3 flex items-center justify-center">
          <StarRating stars={stars} size="xl" animated={true} />
        </div>

        {/* Speed Time Display & New Fastest Record Badge */}
        {durationSeconds > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 my-2">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-sky-50 border-2 border-sky-200 text-sky-800 font-black text-lg sm:text-xl font-['Fredoka']">
              <Timer className="w-5 h-5 sm:w-6 sm:h-6 text-sky-500 stroke-[2.5]" />
              <span>{formatDurationText(durationSeconds)}</span>
            </div>

            {isNewBest && (
              <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-amber-400 text-amber-950 font-black text-base sm:text-lg font-['Fredoka'] shadow-sm animate-bounce">
                <Zap className="w-5 h-5 fill-amber-950 stroke-[2.5]" />
                <span>NEW RECORD!</span>
              </div>
            )}
          </div>
        )}

        {/* Big Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full mt-2">
          <button
            type="button"
            onClick={onPlayAgain}
            className="
              flex-1 py-4 px-6 rounded-2xl
              bg-emerald-500 text-white font-black text-xl sm:text-2xl
              shadow-[0_6px_0_0_#059669] active:translate-y-1 active:shadow-[0_2px_0_0_#059669]
              flex items-center justify-center gap-2.5 cursor-pointer btn-clay
            "
          >
            <RotateCcw className="w-7 h-7 stroke-[2.5]" />
            <span>Play Again</span>
          </button>

          <button
            type="button"
            onClick={onExit}
            className="
              py-4 px-6 rounded-2xl
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
