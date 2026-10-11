// Speed Records Persistence, Formatting, and Management Engine

export interface SpeedRecordEntry {
  id: string;
  gameId: string;
  durationMs: number;
  durationSeconds: number;
  timestamp: string;
  stars: number;
}

const STORAGE_KEY = 'kids_speed_records_v1';

/**
 * Formats seconds into kid & parent friendly readable text:
 * - < 60s -> "56 seconds" ("1 second")
 * - >= 60s -> "1 minute 24 seconds" ("2 minutes")
 */
export function formatDurationText(totalSeconds: number): string {
  const sec = Math.max(1, Math.round(totalSeconds));
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;

  if (mins === 0) {
    return `${remSec} ${remSec === 1 ? 'second' : 'seconds'}`;
  }

  const minLabel = `${mins} ${mins === 1 ? 'minute' : 'minutes'}`;
  if (remSec === 0) {
    return minLabel;
  }

  const secLabel = `${remSec} ${remSec === 1 ? 'second' : 'seconds'}`;
  return `${minLabel} ${secLabel}`;
}

/**
 * Compact format for chart axes & small pills (e.g., "56s" or "1m 24s").
 */
export function formatDurationShort(totalSeconds: number): string {
  const sec = Math.max(1, Math.round(totalSeconds));
  const mins = Math.floor(sec / 60);
  const remSec = sec % 60;
  if (mins === 0) return `${remSec}s`;
  if (remSec === 0) return `${mins}m`;
  return `${mins}m ${remSec}s`;
}

/**
 * Formats an ISO timestamp into a clean human-readable date and time string.
 */
export function formatRecordDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

/**
 * Short date/time label for chart X-axis points.
 */
export function formatRecordShortDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

export function loadAllRecords(): SpeedRecordEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveAllRecords(records: SpeedRecordEntry[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignore storage errors
  }
}

/**
 * Returns all records for a given game sorted chronologically (oldest -> newest).
 */
export function getGameRecordsChronological(gameId: string): SpeedRecordEntry[] {
  return loadAllRecords()
    .filter((r) => r.gameId === gameId)
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
}

/**
 * Returns the fastest (lowest durationSeconds / durationMs) record for a game, or null if none.
 */
export function getBestRecord(gameId: string): SpeedRecordEntry | null {
  const gameRecords = getGameRecordsChronological(gameId);
  if (gameRecords.length === 0) return null;

  return gameRecords.reduce((best, curr) => {
    if (curr.durationSeconds < best.durationSeconds) return curr;
    if (curr.durationSeconds === best.durationSeconds && curr.durationMs < best.durationMs) return curr;
    return best;
  }, gameRecords[0]);
}

/**
 * Records a new completed game run and determines if it's a new fastest record for that game.
 */
export function addSpeedRecord(
  gameId: string,
  durationMs: number,
  stars: number
): { entry: SpeedRecordEntry; isNewBest: boolean } {
  const all = loadAllRecords();
  const existingForGame = all.filter((r) => r.gameId === gameId);

  const durationSeconds = Math.max(1, Math.round(durationMs / 1000));

  let isNewBest = false;
  if (existingForGame.length === 0) {
    isNewBest = true;
  } else {
    const prevBestSeconds = Math.min(...existingForGame.map((r) => r.durationSeconds));
    if (durationSeconds < prevBestSeconds) {
      isNewBest = true;
    }
  }

  const entry: SpeedRecordEntry = {
    id: `rec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    gameId,
    durationMs: Math.max(500, Math.round(durationMs)),
    durationSeconds,
    timestamp: new Date().toISOString(),
    stars,
  };

  all.push(entry);
  saveAllRecords(all);

  return { entry, isNewBest };
}

/**
 * Deletes a specific record entry by ID (e.g., if a parent accidentally played).
 */
export function deleteSpeedRecord(recordId: string): SpeedRecordEntry[] {
  const all = loadAllRecords();
  const filtered = all.filter((r) => r.id !== recordId);
  saveAllRecords(filtered);
  return filtered;
}
