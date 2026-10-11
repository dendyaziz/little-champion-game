import React, { useState, useEffect } from 'react';
import { GAME_MODES, type GameModeConfig } from '../utils/gameModes';
import { sound } from '../audio/soundEngine';
import { announcer } from '../audio/speechAnnouncer';
import { GameModeIllustration } from './GameModeIllustration';
import { Volume2, VolumeX, ArrowRight, Trophy } from 'lucide-react';

interface HomeMenuProps {
  onSelectMode?: (modeId: string) => void;
  onOpenRecords?: () => void;
}

export const HomeMenu: React.FC<HomeMenuProps> = ({ onSelectMode, onOpenRecords }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    setIsMuted(sound.getMuted());
  }, []);

  const handleToggleMute = () => {
    const nextMuted = sound.toggleMute();
    announcer.toggleMute();
    setIsMuted(nextMuted);
  };

  const [selectedModeId, setSelectedModeId] = useState<string | null>(null);

  const handleCardClick = (e: React.MouseEvent, mode: GameModeConfig) => {
    e.preventDefault();
    setSelectedModeId(mode.id);
    sound.playPop();

    if (onSelectMode) {
      onSelectMode(mode.id);
      return;
    }

    window.location.href = `/play/${mode.id}`;
  };

  const handleRecordsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    sound.playPop();
    if (onOpenRecords) {
      onOpenRecords();
      return;
    }
    window.location.href = '/parents/records';
  };


  return (
    <div className="home-menu select-none touch-pan-y">
      <div className="sky-scenery menu-scenery" aria-hidden="true"><i /><i /><i /></div>
      
      {/* Compact Top Navbar - Records & Audio Toggle */}
      <header className="home-toolbar">
        <a
          href="/parents/records"
          onClick={handleRecordsClick}
          aria-label="Speed Records"
          className="utility-button records-link"
        >
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 stroke-[2.5]" />
          <span>Records</span>
        </a>

        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className={`utility-button sound-button ${isMuted ? 'is-muted' : ''}`}
        >
          {isMuted ? <VolumeX className="w-6 h-6 stroke-[2.5]" /> : <Volume2 className="w-6 h-6 stroke-[2.5]" />}
        </button>
      </header>

      {/* Visual Game Toy Buttons Grid (Chunky, Playful, IMMERSIVE FULL WIDTH) */}
      <div className="mode-grid">
        {GAME_MODES.map((mode) => {

          return (
            <a
              key={mode.id}
              href={`/play/${mode.id}`}
              onClick={(e) => handleCardClick(e, mode)}
              className={`group mode-card ${selectedModeId === mode.id ? 'is-selected' : ''}`}
              data-mode={mode.id}
              style={{ '--accent': mode.accentColor } as React.CSSProperties}
            >
              {/* Giant UNBOXED Visual Toy Preview */}
              <div className="mode-preview">
                <GameModeIllustration modeId={mode.id} />
              </div>

              {/* Title & Arrow in vertical stack: title ABOVE arrow with full width */}
              <div className="mode-caption">
                <h2>
                  <span>{mode.title.replace('–', '\u2060–\u2060')}</span>
                </h2>
                <div
                  className="mode-go"
                  aria-hidden="true"
                >
                  <ArrowRight className="w-6 h-6 stroke-[3]" />
                </div>
              </div>
            </a>
          );
        })}
      </div>

    </div>
  );
};
