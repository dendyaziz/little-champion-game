import React, { useState, useEffect, useMemo } from 'react';
import { GAME_MODES, type GameModeConfig } from '../utils/gameModes';
import {
  loadAllRecords,
  deleteSpeedRecord,
  formatDurationText,
  formatDurationShort,
  formatRecordDateTime,
  formatRecordShortDate,
  type SpeedRecordEntry,
} from '../utils/recordsStore';
import { ShapeSVG } from './items/ShapeSVG';
import { sound } from '../audio/soundEngine';
import {
  ArrowLeft,
  Trophy,
  Timer,
  Trash2,
  TrendingDown,
  Search,
  Calendar,
  Sparkles,
  ChevronRight,
} from 'lucide-react';

interface RecordsViewProps {
  onBackToHome: () => void;
}

export const RecordsView: React.FC<RecordsViewProps> = ({ onBackToHome }) => {
  const [records, setRecords] = useState<SpeedRecordEntry[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(loadAllRecords());
  }, []);

  const handleDeleteEntry = (e: React.MouseEvent, recordId: string) => {
    e.stopPropagation();
    sound.playPop();
    const updated = deleteSpeedRecord(recordId);
    setRecords(updated);
  };

  const selectedMode: GameModeConfig | undefined = useMemo(
    () => GAME_MODES.find((m) => m.id === selectedGameId),
    [selectedGameId]
  );

  // Chronological records (oldest -> newest) for the selected game
  const selectedGameRecords = useMemo(() => {
    if (!selectedGameId) return [];
    return records
      .filter((r) => r.gameId === selectedGameId)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [records, selectedGameId]);

  // Best record ID for the selected game
  const selectedBestRecord = useMemo(() => {
    if (selectedGameRecords.length === 0) return null;
    return selectedGameRecords.reduce((best, curr) => {
      if (curr.durationSeconds < best.durationSeconds) return curr;
      if (curr.durationSeconds === best.durationSeconds && curr.durationMs < best.durationMs) return curr;
      return best;
    }, selectedGameRecords[0]);
  }, [selectedGameRecords]);

  // Small visual preview matching HomeMenu
  const renderMiniPreview = (modeId: string) => {
    switch (modeId) {
      case 'order-numbers':
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-black text-3xl text-sky-500 font-['Fredoka'] -rotate-6">0</span>
            <span className="font-black text-3xl text-amber-500 font-['Fredoka'] rotate-3">1</span>
            <span className="font-black text-3xl text-emerald-500 font-['Fredoka'] -rotate-3">2</span>
          </div>
        );
      case 'pick-number':
        return (
          <div className="flex items-center gap-1.5">
            <Search className="w-7 h-7 text-amber-500 stroke-[3]" />
            <span className="font-black text-4xl text-amber-500 font-['Fredoka']">7</span>
          </div>
        );
      case 'order-letters-al':
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-black text-3xl text-emerald-500 font-['Fredoka'] -rotate-6">A</span>
            <span className="font-black text-3xl text-sky-500 font-['Fredoka'] rotate-3">B</span>
            <span className="font-black text-3xl text-amber-500 font-['Fredoka'] -rotate-3">C</span>
          </div>
        );
      case 'order-letters-mz':
        return (
          <div className="flex items-center gap-1.5">
            <span className="font-black text-3xl text-purple-500 font-['Fredoka'] -rotate-6">M</span>
            <span className="font-black text-3xl text-pink-500 font-['Fredoka'] rotate-3">N</span>
            <span className="font-black text-3xl text-orange-500 font-['Fredoka'] -rotate-3">O</span>
          </div>
        );
      case 'pick-letter':
      case 'pick-letter-al':
        return (
          <div className="flex items-center gap-1.5">
            <Search className="w-7 h-7 text-orange-500 stroke-[3]" />
            <span className="font-black text-4xl text-orange-500 font-['Fredoka']">A</span>
          </div>
        );
      case 'pick-letter-mz':
        return (
          <div className="flex items-center gap-1.5">
            <Search className="w-7 h-7 text-indigo-500 stroke-[3]" />
            <span className="font-black text-4xl text-indigo-500 font-['Fredoka']">M</span>
          </div>
        );
      case 'pick-shape':
        return (
          <div className="flex items-center gap-2">
            <ShapeSVG shape="star" fill="#F59E0B" className="w-8 h-8" />
            <ShapeSVG shape="heart" fill="#EC4899" className="w-8 h-8" />
          </div>
        );
      case 'pick-color':
        return (
          <div className="flex items-center gap-1.5">
            <span className="w-6 h-6 rounded-full bg-red-500 shadow-xs" />
            <span className="w-6 h-6 rounded-full bg-blue-500 shadow-xs" />
            <span className="w-6 h-6 rounded-full bg-yellow-400 shadow-xs" />
          </div>
        );
      default:
        return null;
    }
  };

  // Render SVG Historical Line & Area Chart for the selected game
  const renderHistoryGraph = () => {
    if (selectedGameRecords.length === 0) {
      return (
        <div className="w-full py-12 px-6 bg-white/90 rounded-3xl border-3 border-white shadow-sm text-center flex flex-col items-center justify-center gap-2">
          <Timer className="w-12 h-12 text-slate-300 stroke-[2]" />
          <p className="text-xl font-bold text-slate-500 font-['Fredoka']">
            No speed records for this game yet!
          </p>
        </div>
      );
    }

    const width = 760;
    const height = 270;
    const padLeft = 58;
    const padRight = 38;
    const padTop = 38;
    const padBottom = 52;
    const plotW = width - padLeft - padRight;
    const plotH = height - padTop - padBottom;

    const durations = selectedGameRecords.map((r) => r.durationSeconds);
    const minVal = Math.max(0, Math.min(...durations) - 4);
    const maxVal = Math.max(...durations, minVal + 10) + 4;
    const valRange = Math.max(1, maxVal - minVal);

    const points = selectedGameRecords.map((rec, idx) => {
      const x =
        selectedGameRecords.length === 1
          ? padLeft + plotW / 2
          : padLeft + (idx / (selectedGameRecords.length - 1)) * plotW;
      const y = padTop + plotH - ((rec.durationSeconds - minVal) / valRange) * plotH;
      return { x, y, rec, idx };
    });

    const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');
    const areaPath =
      points.length > 1
        ? `M ${points[0].x},${padTop + plotH} ` +
          points.map((p) => `L ${p.x},${p.y}`).join(' ') +
          ` L ${points[points.length - 1].x},${padTop + plotH} Z`
        : '';

    const yTicks = [minVal, Math.round((minVal + maxVal) / 2), maxVal];

    return (
      <div className="w-full bg-white/95 rounded-3xl p-4 sm:p-6 border-4 border-white shadow-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-emerald-500 stroke-[2.5]" />
            <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka']">
              Speed Progress Over Time (Lower is Faster)
            </h3>
          </div>
          <span className="text-xs sm:text-sm font-bold text-slate-400">
            {selectedGameRecords.length} {selectedGameRecords.length === 1 ? 'run' : 'runs'}
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="w-full h-auto min-w-[420px] select-none"
          >
            <defs>
              <linearGradient id="speedAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.32" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.02" />
              </linearGradient>
            </defs>

            {/* Horizontal Grid Lines & Y-Axis Labels */}
            {yTicks.map((tickVal, i) => {
              const y = padTop + plotH - ((tickVal - minVal) / valRange) * plotH;
              return (
                <g key={i}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={width - padRight}
                    y2={y}
                    stroke="#E2E8F0"
                    strokeDasharray="5 5"
                    strokeWidth="1.5"
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-slate-400 text-[12px] font-bold"
                  >
                    {formatDurationShort(tickVal)}
                  </text>
                </g>
              );
            })}

            {/* Area under curve */}
            {areaPath && <path d={areaPath} fill="url(#speedAreaGrad)" />}

            {/* Connecting Line */}
            {points.length > 1 && (
              <polyline
                fill="none"
                stroke="#10B981"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylinePoints}
              />
            )}

            {/* Data Points */}
            {points.map((p) => {
              const isBest = selectedBestRecord?.id === p.rec.id;
              return (
                <g key={p.rec.id}>
                  {/* Point circle */}
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={isBest ? 8 : 6}
                    fill={isBest ? '#F59E0B' : '#10B981'}
                    stroke="#FFFFFF"
                    strokeWidth="3"
                  />
                  {/* Duration label above point */}
                  <text
                    x={p.x}
                    y={p.y - 13}
                    textAnchor="middle"
                    className={`text-[12px] font-black ${
                      isBest ? 'fill-amber-600' : 'fill-slate-700'
                    }`}
                  >
                    {formatDurationShort(p.rec.durationSeconds)}
                  </text>
                  {/* X-axis attempt # and short date */}
                  <text
                    x={p.x}
                    y={padTop + plotH + 20}
                    textAnchor="middle"
                    className="fill-slate-500 text-[11px] font-bold"
                  >
                    #{p.idx + 1}
                  </text>
                  {(points.length <= 6 ||
                    p.idx === 0 ||
                    p.idx === points.length - 1 ||
                    isBest) && (
                    <text
                      x={p.x}
                      y={padTop + plotH + 36}
                      textAnchor="middle"
                      className="fill-slate-400 text-[10px] font-semibold"
                    >
                      {formatRecordShortDate(p.rec.timestamp)}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // DETAIL VIEW FOR ONE GAME
  if (selectedGameId && selectedMode) {
    return (
      <div className="w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-10 pt-3 pb-24 select-none">
        {/* Top Bar */}
        <header className="w-full max-w-5xl flex items-center justify-between py-2 mb-4 gap-3">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setSelectedGameId(null);
            }}
            className="px-4 py-2.5 rounded-2xl bg-white text-slate-700 font-black text-base sm:text-lg shadow-[0_4px_0_0_#cbd5e1] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer btn-clay border-2 border-white"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>All Games</span>
          </button>

          <div className="flex items-center gap-3">
            {renderMiniPreview(selectedMode.id)}
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka']">
              {selectedMode.title}
            </h1>
          </div>

          <div className="w-20 sm:w-28" />
        </header>

        <div className="w-full max-w-5xl flex flex-col gap-6">
          {/* Best Record Banner */}
          {selectedBestRecord && (
            <div className="w-full bg-gradient-to-r from-amber-100 via-amber-50 to-white rounded-3xl p-4 sm:p-5 border-3 border-amber-300 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-400 text-white flex items-center justify-center shadow-xs">
                  <Trophy className="w-7 h-7 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-amber-700">
                    Fastest Time Record
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-800 font-['Fredoka']">
                    {formatDurationText(selectedBestRecord.durationSeconds)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-600 bg-white/80 px-3.5 py-2 rounded-xl border border-amber-200">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{formatRecordDateTime(selectedBestRecord.timestamp)}</span>
              </div>
            </div>
          )}

          {/* Historical Speed Graph */}
          {renderHistoryGraph()}

          {/* Historical Records List with Delete Button */}
          {selectedGameRecords.length > 0 && (
            <div className="w-full bg-white/95 rounded-3xl p-4 sm:p-6 border-4 border-white shadow-md flex flex-col gap-3">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg sm:text-xl font-black text-slate-800 font-['Fredoka']">
                  History Log
                </h3>
                <span className="text-xs sm:text-sm font-semibold text-slate-400">
                  Tap trash icon to remove accidental entries
                </span>
              </div>

              <div className="flex flex-col gap-2.5">
                {selectedGameRecords.map((rec, idx) => {
                  const isBest = selectedBestRecord?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      className={`w-full rounded-2xl px-4 py-3 flex items-center justify-between gap-3 border-2 transition-colors ${
                        isBest
                          ? 'bg-amber-50/90 border-amber-300'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="w-8 h-8 rounded-xl bg-slate-200/80 text-slate-700 font-black text-sm flex items-center justify-center font-['Fredoka']">
                          #{idx + 1}
                        </span>

                        <span className="font-black text-lg sm:text-xl text-slate-800 font-['Fredoka']">
                          {formatDurationText(rec.durationSeconds)}
                        </span>

                        {isBest && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-400 text-amber-950 font-black text-xs">
                            <Sparkles className="w-3.5 h-3.5" />
                            BEST
                          </span>
                        )}

                        <span className="text-xs sm:text-sm font-semibold text-slate-500 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          {formatRecordDateTime(rec.timestamp)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteEntry(e, rec.id)}
                        aria-label="Delete record entry"
                        title="Delete entry"
                        className="w-10 h-10 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-500 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer active:scale-90 border border-rose-200/80"
                      >
                        <Trash2 className="w-5 h-5 stroke-[2.2]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // OVERVIEW: ALL GAMES BEST RECORD CARDS
  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 md:px-8 lg:px-10 pt-3 pb-24 select-none">
      {/* Top Bar */}
      <header className="w-full max-w-6xl flex items-center justify-between py-2 mb-4">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToHome();
          }}
          className="px-4 py-2.5 rounded-2xl bg-white text-slate-700 font-black text-base sm:text-lg shadow-[0_4px_0_0_#cbd5e1] active:translate-y-1 active:shadow-none flex items-center gap-2 cursor-pointer btn-clay border-2 border-white"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Home</span>
        </button>

        <div className="flex items-center gap-2.5">
          <Trophy className="w-7 h-7 sm:w-8 sm:h-8 text-amber-500 stroke-[2.5]" />
          <h1 className="text-2xl sm:text-4xl font-black text-slate-800 font-['Fredoka']">
            Speed Records
          </h1>
        </div>

        <div className="w-20 sm:w-24" />
      </header>

      {/* Grid of All 7 Games showing Best Time Record */}
      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {GAME_MODES.map((mode) => {
          const gameRuns = records.filter((r) => r.gameId === mode.id);
          const best =
            gameRuns.length > 0
              ? gameRuns.reduce((b, c) =>
                  c.durationSeconds < b.durationSeconds ||
                  (c.durationSeconds === b.durationSeconds && c.durationMs < b.durationMs)
                    ? c
                    : b
                , gameRuns[0])
              : null;

          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                sound.playPop();
                setSelectedGameId(mode.id);
              }}
              className="group bg-white/95 hover:bg-white rounded-[32px] p-5 border-4 border-white shadow-[0_6px_0_0_#cbd5e1] hover:-translate-y-1 active:translate-y-1 transition-all flex flex-col justify-between text-left cursor-pointer btn-clay"
            >
              {/* Top Row: Mini visual preview + title + chevron */}
              <div className="w-full flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center shrink-0">
                    {renderMiniPreview(mode.id)}
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka'] group-hover:text-amber-600 transition-colors leading-tight">
                      {mode.title}
                    </h2>
                    <span className="text-xs font-bold text-slate-400">
                      {gameRuns.length} {gameRuns.length === 1 ? 'record' : 'records'}
                    </span>
                  </div>
                </div>
                <ChevronRight className="w-6 h-6 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>

              {/* Bottom Row: Best Time Record or Empty Badge */}
              {best ? (
                <div className="w-full rounded-2xl bg-amber-50/90 border-2 border-amber-200 px-4 py-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700 flex items-center gap-1">
                      <Trophy className="w-3.5 h-3.5 text-amber-500" />
                      Best Time
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {formatRecordDateTime(best.timestamp)}
                    </span>
                  </div>
                  <div className="text-xl sm:text-2xl font-black text-slate-800 font-['Fredoka']">
                    {formatDurationText(best.durationSeconds)}
                  </div>
                </div>
              ) : (
                <div className="w-full rounded-2xl bg-slate-50 border-2 border-slate-100 px-4 py-3 flex items-center gap-2 text-slate-400 font-bold text-sm">
                  <Timer className="w-4 h-4" />
                  <span>No record yet — play to set one!</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
