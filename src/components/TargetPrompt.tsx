import React, { useState, useEffect } from 'react';
import type { RoundData } from '../utils/roundGenerator';
import { ShapeSVG } from './items/ShapeSVG';
import { announcer } from '../audio/speechAnnouncer';
import { sound } from '../audio/soundEngine';

interface TargetPromptProps {
  roundData: RoundData;
  onStart: () => void;
}

export const TargetPrompt: React.FC<TargetPromptProps> = ({ roundData, onStart }) => {
  const [isExiting, setIsExiting] = useState<boolean>(false);

  useEffect(() => {
    sound.playPop();

    let isMounted = true;
    let transitionTimer: NodeJS.Timeout;

    // Spoken prompt for kindergarten kids using local TTS - plays immediately for all game types
    if (roundData.targetValue) {
      announcer.announcePickTarget(roundData.targetKind, roundData.targetValue, () => {
        if (!isMounted) return;
        // After spoken narration finishes, wait 350ms then transition out smoothly
        transitionTimer = setTimeout(() => {
          if (!isMounted) return;
          setIsExiting(true);
          setTimeout(() => {
            if (isMounted) onStart();
          }, 300);
        }, 350);
      });
    }

    return () => {
      isMounted = false;
      clearTimeout(transitionTimer);
      announcer.stopAll();
    };
  }, [roundData, onStart]);

  const handleManualSkip = () => {
    if (isExiting) return;
    setIsExiting(true);
    announcer.stopAll();
    sound.playChime(1.2);
    setTimeout(() => {
      onStart();
    }, 180);
  };

  return (
    <div
      onClick={handleManualSkip}
      className={`target-prompt fixed inset-0 z-50 bg-white/92 backdrop-blur-2xl flex flex-col items-center justify-center p-6 cursor-pointer select-none transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* 3X LARGER UNBOXED FLOATING TARGET - Transition in and out automatically */}
      <div
        className={`flex flex-col items-center justify-center pointer-events-none ${
          isExiting ? 'animate-target-out' : 'animate-target-in'
        }`}
      >
        {roundData.targetKind === 'shape' && roundData.targetShape && (
          <ShapeSVG
            shape={roundData.targetShape}
            fill="#F59E0B"
            className="prompt-shape"
          />
        )}

        {roundData.targetKind === 'color' && roundData.targetColor && (
          <ShapeSVG
            shape="circle"
            fill={roundData.targetColor.hex}
            stroke={roundData.targetColor.strokeHex}
            className="prompt-shape"
          />
        )}

        {(roundData.targetKind === 'number' || roundData.targetKind === 'letter') && (
          <span
            className="prompt-glyph font-black font-['Fredoka'] select-none leading-none tracking-normal"
            data-wide={(roundData.targetValue?.length || 0) > 1}
            style={{
              color: '#F59E0B',
            }}
          >
            {roundData.targetValue}
          </span>
        )}
      </div>
    </div>
  );
};
