import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GAME_MODES, type GameModeConfig } from '../utils/gameModes';
import {
  loadAllRecords,
  deleteSpeedRecord,
  formatDurationText,
  formatDurationShort,
  formatRecordDateTime,
  type SpeedRecordEntry,
} from '../utils/recordsStore';
import { GameModeIllustration } from './GameModeIllustration';
import { ChampionTrophy } from './ui/ChampionTrophy';
import { StarRating } from './ui/StarRating';
import { sound } from '../audio/soundEngine';
import {
  ArrowLeft,
  Trophy,
  Timer,
  Trash2,
  TrendingDown,
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
  const chartRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(360);

  useEffect(() => {
    setRecords(loadAllRecords());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [selectedGameId]);

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

  useEffect(() => {
    if (!chartRef.current) return;
    const observer = new ResizeObserver(([entry]) => setChartWidth(entry.contentRect.width));
    observer.observe(chartRef.current);
    return () => observer.disconnect();
  }, [selectedGameId, selectedGameRecords.length]);

  // Best record ID for the selected game
  const selectedBestRecord = useMemo(() => {
    if (selectedGameRecords.length === 0) return null;
    return selectedGameRecords.reduce((best, curr) => {
      if (curr.durationSeconds < best.durationSeconds) return curr;
      if (curr.durationSeconds === best.durationSeconds && curr.durationMs < best.durationMs) return curr;
      return best;
    }, selectedGameRecords[0]);
  }, [selectedGameRecords]);

  // Render SVG Historical Line & Area Chart for the selected game
  const renderHistoryGraph = () => {
    if (selectedGameRecords.length === 0) {
      return (
        <div className="record-panel record-empty-panel">
          <div className="record-empty-art" aria-hidden="true"><Trophy /></div>
          <h3>No records yet</h3>
          <p>Completed games will appear here.</p>
        </div>
      );
    }

    // Preserve readable chart labels on phones; long histories scroll inside the chart.
    const width = Math.max(chartWidth, 360, 96 + selectedGameRecords.length * 84);
    const height = 270;
    const padLeft = 96;
    const padRight = 64;
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
      <div className="record-panel record-progress-panel">
        <div className="record-panel-heading">
          <TrendingDown aria-hidden="true" />
          <div><h3>Speed progress</h3><p>Lower time is faster</p></div>
        </div>

        <div className="record-chart-scroll" ref={chartRef} tabIndex={0} aria-label="Scrollable speed progress chart">
          <svg
            viewBox={`0 0 ${width} ${height}`}
            className="record-chart select-none"
            style={{ width, minWidth: width, height }}
            role="img"
            aria-label="Completion times by attempt. Full times and dates are listed in the history below."
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
                    className="fill-slate-500 text-[14px] font-semibold"
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
                    className={`text-[16px] font-semibold ${
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
                    className="fill-slate-500 text-[14px] font-semibold"
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
                      className="fill-slate-500 text-[12px] font-medium"
                    >
                      {new Date(p.rec.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
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
      <main className="parent-records record-detail">
        {/* Top Bar */}
        <header className="records-header records-shell">
          <button
            type="button"
            onClick={() => {
              sound.playPop();
              setSelectedGameId(null);
            }}
            className="records-back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            <span>All Games</span>
          </button>

          <div className="records-title">
            <div className="records-title-preview" aria-hidden="true"><GameModeIllustration modeId={selectedMode.id} /></div>
            <h1>{selectedMode.title}</h1>
          </div>

          <div className="records-header-spacer" aria-hidden="true" />
        </header>

        <div className="records-shell records-detail-grid">
          {/* Best Record Banner */}
          {selectedBestRecord && (
            <section className="record-best-banner" aria-label="Fastest completed game">
              <ChampionTrophy className="record-trophy" />
              <div className="record-best-info">
                <span className="record-best-label">Fastest time</span>
                <div className="record-best-time">{formatDurationText(selectedBestRecord.durationSeconds)}</div>
                <div className="record-best-date"><Calendar aria-hidden="true" /><span>{formatRecordDateTime(selectedBestRecord.timestamp)}</span></div>
              </div>
              <div className="record-stars" aria-label={`${selectedBestRecord.stars} out of 5 stars on this record`}>
                <StarRating stars={selectedBestRecord.stars} size="md" animated={false} />
              </div>
            </section>
          )}

          {/* Historical Speed Graph */}
          {renderHistoryGraph()}

          {/* Historical Records List with Delete Button */}
          {selectedGameRecords.length > 0 && (
            <section className="record-panel record-history-panel" aria-label="Game history">
              <div className="record-panel-heading">
                <Timer aria-hidden="true" />
                <div><h3>History</h3><p>{selectedGameRecords.length} {selectedGameRecords.length === 1 ? 'attempt' : 'attempts'}</p></div>
              </div>

              <div className="record-history-list" tabIndex={0} role="region" aria-label="Scrollable history entries">
                {selectedGameRecords.map((rec, idx) => {
                  const isBest = selectedBestRecord?.id === rec.id;
                  return (
                    <div
                      key={rec.id}
                      className={`record-history-row ${
                        isBest
                          ? 'bg-amber-50/90 border-amber-300'
                          : 'bg-slate-50/80 border-slate-200/80'
                      }`}
                    >
                      <div className="record-history-content">
                        <span className="record-attempt">
                          #{idx + 1}
                        </span>

                        <span className="record-history-time">
                          {formatDurationText(rec.durationSeconds)}
                        </span>

                        {isBest && (
                          <span className="record-history-best">
                            <Sparkles aria-hidden="true" />
                            Best
                          </span>
                        )}

                        <span className="record-history-date">
                          {formatRecordDateTime(rec.timestamp)}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={(e) => handleDeleteEntry(e, rec.id)}
                        aria-label="Delete record entry"
                        title="Delete entry"
                        className="record-delete"
                      >
                        <Trash2 className="w-5 h-5 stroke-[2.2]" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </main>
    );
  }

  // OVERVIEW: ALL GAMES BEST RECORD CARDS
  return (
    <main className="parent-records">
      {/* Top Bar */}
      <header className="records-header records-shell">
        <button
          type="button"
          onClick={() => {
            sound.playPop();
            onBackToHome();
          }}
          className="records-back"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          <span>Home</span>
        </button>

        <div className="records-title">
          <ChampionTrophy className="records-heading-trophy" />
          <h1>
            Speed Records
          </h1>
        </div>

        <div className="records-header-spacer" aria-hidden="true" />
      </header>

      {/* Show the best time only; dates, counts, and history live in the detail view. */}
      <div className="records-grid records-shell">
        {GAME_MODES.map((mode) => {
          const best = records.filter((record) => record.gameId === mode.id).reduce<SpeedRecordEntry | null>((current, record) =>
            !current || record.durationSeconds < current.durationSeconds ||
            (record.durationSeconds === current.durationSeconds && record.durationMs < current.durationMs)
              ? record : current, null);
          return (
            <button
              key={mode.id}
              type="button"
              onClick={() => {
                sound.playPop();
                setSelectedGameId(mode.id);
              }}
              className="record-card"
              aria-label={`${mode.title}.${best ? ` Best time: ${formatDurationText(best.durationSeconds)}.` : ''} Open history.`}
              data-mode={mode.id}
              style={{ '--accent': mode.accentColor } as React.CSSProperties}
            >
              <div className="record-preview" aria-hidden="true">
                <GameModeIllustration modeId={mode.id} />
              </div>
              <h2 className="record-game-title">{mode.title.replace('–', '\u2060–\u2060')}</h2>
              <div className="record-list-time">{best && <><Timer aria-hidden="true" /><span>{formatDurationText(best.durationSeconds)}</span></>}</div>
              <div className="record-card-footer">
                <span className="record-open" aria-hidden="true"><ChevronRight /></span>
              </div>
            </button>
          );
        })}
      </div>
    </main>
  );
};
