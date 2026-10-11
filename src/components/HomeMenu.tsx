import React, { useState, useEffect } from 'react';
import { GAME_MODES, type GameModeConfig } from '../utils/gameModes';
import { sound } from '../audio/soundEngine';
import { announcer } from '../audio/speechAnnouncer';
import { ShapeSVG } from './items/ShapeSVG';
import { Volume2, VolumeX, Search, ArrowRight, Trophy } from 'lucide-react';

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
    window.location.href = '/records';
  };

  // Render a visual preview that non-reading kids can instantly recognize - completely UNBOXED & NO EMOJI
  const renderVisualPreview = (modeId: string) => {
    switch (modeId) {
      case 'order-numbers':
        return (
          <div className="flex items-center justify-center gap-2.5 py-2">
            <span className="font-black text-5xl sm:text-6xl text-sky-500 font-['Fredoka'] -rotate-6">0</span>
            <span className="font-black text-5xl sm:text-6xl text-amber-500 font-['Fredoka'] rotate-3 translate-y-1">1</span>
            <span className="font-black text-5xl sm:text-6xl text-emerald-500 font-['Fredoka'] -rotate-3 -translate-y-1">2</span>
            <span className="font-black text-5xl sm:text-6xl text-rose-500 font-['Fredoka'] rotate-6">3</span>
          </div>
        );

      case 'pick-number':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-amber-500 stroke-[3]" />
            <span className="font-black text-6xl sm:text-7xl text-amber-500 font-['Fredoka']">
              7
            </span>
          </div>
        );

      case 'order-letters-al':
        return (
          <div className="flex items-center justify-center gap-2.5 py-2">
            <span className="font-black text-5xl sm:text-6xl text-emerald-500 font-['Fredoka'] -rotate-6">A</span>
            <span className="font-black text-5xl sm:text-6xl text-sky-500 font-['Fredoka'] rotate-3 translate-y-1">B</span>
            <span className="font-black text-5xl sm:text-6xl text-amber-500 font-['Fredoka'] -rotate-3">C</span>
          </div>
        );

      case 'order-letters-mz':
        return (
          <div className="flex items-center justify-center gap-2.5 py-2">
            <span className="font-black text-5xl sm:text-6xl text-purple-500 font-['Fredoka'] -rotate-6">M</span>
            <span className="font-black text-5xl sm:text-6xl text-pink-500 font-['Fredoka'] rotate-3 translate-y-1">N</span>
            <span className="font-black text-5xl sm:text-6xl text-orange-500 font-['Fredoka'] -rotate-3">O</span>
          </div>
        );

      case 'pick-letter-al':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-orange-500 stroke-[3]" />
            <span className="font-black text-6xl sm:text-7xl text-orange-500 font-['Fredoka']">
              A
            </span>
          </div>
        );

      case 'pick-letter-mz':
        return (
          <div className="flex items-center justify-center gap-3 py-2">
            <Search className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-500 stroke-[3]" />
            <span className="font-black text-6xl sm:text-7xl text-indigo-500 font-['Fredoka']">
              M
            </span>
          </div>
        );

      case 'pick-shape':
        return (
          <div className="flex items-center justify-center gap-4 py-2">
            <div className="-rotate-6">
              <ShapeSVG shape="star" fill="#F59E0B" className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
            <div className="rotate-6 translate-y-1">
              <ShapeSVG shape="heart" fill="#EC4899" className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
            <div className="-rotate-3">
              <ShapeSVG shape="circle" fill="#38BDF8" className="w-12 h-12 sm:w-14 sm:h-14" />
            </div>
          </div>
        );

      case 'pick-color':
        return (
          <div className="flex items-center justify-center gap-2.5 py-2">
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-500 -rotate-6 shadow-sm" />
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-500 rotate-3 translate-y-1 shadow-sm" />
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-yellow-400 -rotate-3 shadow-sm" />
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-emerald-500 rotate-6 shadow-sm" />
            <span className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-500 -rotate-6 shadow-sm" />
          </div>
        );

      default:
        return null;
    }
  };

  const getModeColorStyle = (modeId: string) => {
    switch (modeId) {
      case 'order-numbers':
        return 'bg-sky-50 hover:bg-sky-100 shadow-[0_8px_0_0_#38bdf8] border-sky-200';
      case 'pick-number':
        return 'bg-amber-50 hover:bg-amber-100 shadow-[0_8px_0_0_#fbbf24] border-amber-200';
      case 'order-letters-al':
        return 'bg-emerald-50 hover:bg-emerald-100 shadow-[0_8px_0_0_#34d399] border-emerald-200';
      case 'order-letters-mz':
        return 'bg-purple-50 hover:bg-purple-100 shadow-[0_8px_0_0_#a78bfa] border-purple-200';
      case 'pick-letter-al':
        return 'bg-orange-50 hover:bg-orange-100 shadow-[0_8px_0_0_#fb923c] border-orange-200';
      case 'pick-letter-mz':
        return 'bg-indigo-50 hover:bg-indigo-100 shadow-[0_8px_0_0_#6366f1] border-indigo-200';
      case 'pick-shape':
        return 'bg-pink-50 hover:bg-pink-100 shadow-[0_8px_0_0_#f472b6] border-pink-200';
      case 'pick-color':
        return 'bg-teal-50 hover:bg-teal-100 shadow-[0_8px_0_0_#2dd4bf] border-teal-200';
      default:
        return 'bg-white shadow-[0_8px_0_0_#cbd5e1] border-slate-200';
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-10 pt-2 sm:pt-3 pb-24 select-none touch-pan-y">
      
      {/* Compact Top Navbar - Records & Audio Toggle */}
      <header className="w-full flex items-center justify-end gap-2.5 py-1 mb-2">
        <a
          href="/records"
          onClick={handleRecordsClick}
          aria-label="Speed Records"
          className="h-11 sm:h-12 px-4 rounded-2xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-black text-base sm:text-lg shadow-[0_4px_0_0_#fcd34d] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer btn-clay border-2 border-white font-['Fredoka']"
        >
          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-amber-600 stroke-[2.5]" />
          <span>Records</span>
        </a>

        <button
          type="button"
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          className={`w-11 h-11 sm:w-12 sm:h-12 rounded-2xl ${
            isMuted ? 'bg-rose-100 text-rose-600 shadow-[0_4px_0_0_#fecdd3]' : 'bg-white text-slate-700 shadow-[0_4px_0_0_#cbd5e1]'
          } active:translate-y-1 active:shadow-none flex items-center justify-center cursor-pointer btn-clay border-2 border-white`}
        >
          {isMuted ? <VolumeX className="w-6 h-6 stroke-[2.5]" /> : <Volume2 className="w-6 h-6 stroke-[2.5]" />}
        </button>
      </header>

      {/* Visual Game Toy Buttons Grid (Chunky, Playful, IMMERSIVE FULL WIDTH) */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {GAME_MODES.map((mode) => {
          const colorClasses = getModeColorStyle(mode.id);

          return (
            <a
              key={mode.id}
              href={`/play/${mode.id}`}
              onClick={(e) => handleCardClick(e, mode)}
              className={`
                group relative rounded-[40px] p-6
                flex flex-col justify-between items-center text-center
                transition-all duration-150 ease-out
                hover:-translate-y-2 active:translate-y-1
                btn-clay cursor-pointer border-4 border-white
                ${selectedModeId === mode.id ? 'scale-95 brightness-95 translate-y-1 shadow-none' : ''}
                ${colorClasses}
              `}
            >
              {/* Giant UNBOXED Visual Toy Preview */}
              <div className="w-full py-4 flex items-center justify-center min-h-[120px] group-hover:scale-110 transition-transform">
                {renderVisualPreview(mode.id)}
              </div>

              {/* Title & Arrow in vertical stack: title ABOVE arrow with full width */}
              <div className="w-full flex flex-col items-center justify-center mt-2 pt-2 gap-3">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka'] group-hover:text-amber-600 transition-colors text-center leading-tight">
                  {mode.title}
                </h2>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md btn-clay"
                  style={{ backgroundColor: mode.accentColor }}
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
