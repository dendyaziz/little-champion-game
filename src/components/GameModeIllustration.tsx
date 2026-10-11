import React from "react";
import { Search } from "lucide-react";
import { ShapeSVG } from "./items/ShapeSVG";

// Shared source of truth for each game illustration on Home and Records.
export const GameModeIllustration: React.FC<{ modeId: string }> = ({ modeId }) => {
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
