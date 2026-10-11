import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { GAME_MODES, type GameModeConfig, type GameItem } from '../utils/gameModes';
import { generateRound, type RoundData } from '../utils/roundGenerator';
import { calculateStars } from '../utils/scoring';
import { addSpeedRecord } from '../utils/recordsStore';
import { HUD } from './HUD';
import { PlayItem } from './items/PlayItem';
import { TargetPrompt } from './TargetPrompt';
import { VictoryModal } from './VictoryModal';
import { GameOverModal } from './GameOverModal';
import { sound } from '../audio/soundEngine';
import { announcer } from '../audio/speechAnnouncer';

interface GameRoomProps {
  gameId: string;
  onExit?: () => void;
}

export const GameRoom: React.FC<GameRoomProps> = ({ gameId, onExit }) => {
  const modeConfig: GameModeConfig = useMemo(() => {
    return GAME_MODES.find((m) => m.id === gameId) || GAME_MODES[0];
  }, [gameId]);

  const [round, setRound] = useState<number>(1);
  const [hearts, setHearts] = useState<number>(5);
  const [score, setScore] = useState<number>(0);
  const [cumulativeMaxScore, setCumulativeMaxScore] = useState<number>(0);

  const [gameState, setGameState] = useState<'prompt' | 'playing' | 'game_over' | 'victory'>('playing');
  const [currentRoundData, setCurrentRoundData] = useState<RoundData | null>(null);
  const [items, setItems] = useState<GameItem[]>([]);
  
  // For Order games: state + ref for instant synchronous updates during rapid taps
  const [currentOrderIndex, setCurrentOrderIndex] = useState<number>(0);
  const currentOrderIndexRef = useRef<number>(0);

  // Audio mute state
  const [isMuted, setIsMuted] = useState<boolean>(() => sound.getMuted());

  // Track previously targeted items in this game session to ensure every round has a unique target
  const usedTargetsRef = useRef<string[]>([]);

  // Speed timer tracking
  const gameStartTimeRef = useRef<number>(Date.now());
  const [lastVictoryRecord, setLastVictoryRecord] = useState<{
    durationSeconds: number;
    isNewBest: boolean;
  } | null>(null);

  // Initialize or advance round
  const startRound = useCallback((roundNum: number) => {
    if (roundNum === 1) {
      usedTargetsRef.current = [];
      gameStartTimeRef.current = Date.now();
      setLastVictoryRecord(null);
    }

    const roundData = generateRound(gameId, roundNum, usedTargetsRef.current);
    if (roundData.targetValue) {
      usedTargetsRef.current.push(roundData.targetValue);
    }
    if (roundData.targetShape) {
      usedTargetsRef.current.push(roundData.targetShape);
    }
    if (roundData.targetColor) {
      usedTargetsRef.current.push(roundData.targetColor.id, roundData.targetColor.name);
    }

    setCurrentRoundData(roundData);
    setItems(roundData.items);
    currentOrderIndexRef.current = 0;
    setCurrentOrderIndex(0);

    setCumulativeMaxScore((prev) => prev + roundData.targetCount);

    if (modeConfig.type === 'order') {
      // Order games start immediately without any confusing text prompt!
      setGameState('playing');
      if (gameId === 'order-numbers') {
        announcer.speak("Let's count from Zero to Eleven!");
      } else if (gameId === 'order-letters-al') {
        announcer.speak("Let's order the letters from A to L!");
      } else if (gameId === 'order-letters-mz') {
        announcer.speak("Let's order the letters from M to Z!");
      }
    } else {
      // Pick games show the unboxed target
      setGameState('prompt');
    }
  }, [gameId, modeConfig.type]);

  // Initial game setup
  useEffect(() => {
    setHearts(5);
    setScore(0);
    setRound(1);
    setCumulativeMaxScore(0);
    startRound(1);
  }, [gameId, startRound]);

  // Toggle audio
  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    announcer.toggleMute();
    setIsMuted(nextMuted);
  };

  // Exit to menu
  const handleExit = () => {
    announcer.stopAll();
    if (onExit) {
      onExit();
      return;
    }
    window.location.href = '/';
  };

  // Derive targets remaining directly from items for Pick mode (zero chance of desync)
  const remainingTargets = useMemo(() => {
    return items.filter((item) => item.isTarget && !item.isPopped && !item.isPopping).length;
  }, [items]);

  // Handle user starting the round from the prompt
  const handlePromptStart = () => {
    setGameState('playing');
  };

  // Handle tapping an item in the playground
  const handleTap = (tappedItem: GameItem) => {
    if (gameState !== 'playing' || tappedItem.isPopped || tappedItem.isPopping) return;

    if (modeConfig.type === 'order') {
      // Sequential Order mode (checked against ref for zero race conditions on rapid taps)
      if (tappedItem.orderIndex === currentOrderIndexRef.current) {
        // CORRECT
        const nextIndex = currentOrderIndexRef.current + 1;
        currentOrderIndexRef.current = nextIndex;
        setCurrentOrderIndex(nextIndex);

        sound.playPop();
        announcer.speakItem(tappedItem.value);
        setScore((s) => s + 1);

        // Mark item as popping for celebratory exit animation
        setItems((prev) =>
          prev.map((item) => (item.id === tappedItem.id ? { ...item, isPopping: true } : item))
        );

        // After pop exit animation completes (320ms), mark as popped
        setTimeout(() => {
          setItems((prev) =>
            prev.map((item) => (item.id === tappedItem.id ? { ...item, isPopped: true, isPopping: false } : item))
          );
        }, 320);

        // Check if all items in this round are completed
        if (nextIndex >= items.length) {
          setTimeout(() => handleRoundComplete(), 450);
        }
      } else {
        // WRONG
        handleMistake(tappedItem);
      }
    } else {
      // Pick mode
      if (tappedItem.isTarget) {
        // CORRECT: cheerful pop + sweet low-volume bell ding (no repeating voice spoken)
        sound.playPop();
        sound.playCorrectBell();
        setScore((s) => s + 1);

        // Mark item as popping for celebratory exit animation
        setItems((prev) =>
          prev.map((item) => (item.id === tappedItem.id ? { ...item, isPopping: true } : item))
        );

        // After pop exit animation completes (320ms), mark as popped
        setTimeout(() => {
          setItems((prev) =>
            prev.map((item) => (item.id === tappedItem.id ? { ...item, isPopped: true, isPopping: false } : item))
          );
        }, 320);

        // Check remaining targets in this round
        const left = items.filter(
          (item) => item.isTarget && item.id !== tappedItem.id && !item.isPopped && !item.isPopping
        ).length;

        if (left === 0) {
          setTimeout(() => handleRoundComplete(), 450);
        }
      } else {
        // WRONG
        handleMistake(tappedItem);
      }
    }
  };

  // Wrong tap handler
  const handleMistake = (tappedItem: GameItem) => {
    sound.playWobble();

    // Trigger shake animation on the tapped item
    setItems((prev) =>
      prev.map((item) => (item.id === tappedItem.id ? { ...item, isShaking: true } : item))
    );

    setTimeout(() => {
      setItems((prev) =>
        prev.map((item) => (item.id === tappedItem.id ? { ...item, isShaking: false } : item))
      );
    }, 450);

    const nextHearts = hearts - 1;
    setHearts(nextHearts);

    if (nextHearts <= 0) {
      setGameState('game_over');
    }
  };

  // Round completion logic
  const handleRoundComplete = () => {
    sound.playChime(1.5);
    if (round < 3) {
      const nextRound = round + 1;
      setRound(nextRound);
      setTimeout(() => {
        startRound(nextRound);
      }, 350);
    } else {
      const durationMs = Math.max(500, Date.now() - gameStartTimeRef.current);
      const stars = calculateStars(score + 1, cumulativeMaxScore || 12);
      const { entry, isNewBest } = addSpeedRecord(gameId, durationMs, stars);
      setLastVictoryRecord({
        durationSeconds: entry.durationSeconds,
        isNewBest,
      });
      setGameState('victory');
    }
  };

  // Restart current game
  const handleRestart = () => {
    setHearts(5);
    setScore(0);
    setRound(1);
    setCumulativeMaxScore(0);
    usedTargetsRef.current = [];
    startRound(1);
  };

  return (
    <main className="fixed inset-0 w-screen h-screen overflow-hidden flex flex-col bg-gradient-to-b from-sky-200 via-sky-100 to-amber-50 select-none">
      
      {/* Playful Floating Decorative Clouds Background */}
      <div className="absolute inset-0 pointer-events-none opacity-45 overflow-hidden">
        <div className="absolute top-10 left-12 w-48 h-24 bg-white/80 rounded-full blur-xs animate-float" style={{ '--rot': '-2deg' } as React.CSSProperties} />
        <div className="absolute top-32 right-16 w-60 h-28 bg-white/80 rounded-full blur-xs animate-float" style={{ '--rot': '3deg' } as React.CSSProperties} />
        <div className="absolute bottom-16 left-1/4 w-80 h-32 bg-white/70 rounded-full blur-xs animate-float" style={{ '--rot': '1deg' } as React.CSSProperties} />
      </div>

      {/* Top HUD */}
      <HUD
        hearts={hearts}
        maxHearts={5}
        score={score}
        round={round}
        isCompleted={gameState === 'victory'}
        gameType={modeConfig.type}
        targetShape={currentRoundData?.targetShape}
        targetColor={currentRoundData?.targetColor}
        targetValue={currentRoundData?.targetValue}
        targetsRemaining={modeConfig.type === 'pick' ? remainingTargets : undefined}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onExit={handleExit}
      />

      {/* Fully Immersive Playfield - Bleeds edge to edge with NO inner box! */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {items.map((item) => (
          <PlayItem key={item.id} item={item} onTap={handleTap} />
        ))}
      </div>

      {/* Target Prompt Modal (Only for Pick games, unboxed) */}
      {gameState === 'prompt' && currentRoundData && (
        <TargetPrompt roundData={currentRoundData} onStart={handlePromptStart} />
      )}

      {/* Victory Modal */}
      {gameState === 'victory' && (
        <VictoryModal
          score={score}
          maxScore={cumulativeMaxScore || 12}
          heartsRemaining={hearts}
          gameId={gameId}
          gameTitle={modeConfig.title}
          durationSeconds={lastVictoryRecord?.durationSeconds}
          isNewBest={lastVictoryRecord?.isNewBest}
          onPlayAgain={handleRestart}
          onExit={handleExit}
        />
      )}

      {/* Game Over Modal */}
      {gameState === 'game_over' && (
        <GameOverModal
          score={score}
          gameTitle={modeConfig.title}
          onRetry={handleRestart}
          onExit={handleExit}
        />
      )}

    </main>
  );
};
