// Collision-free scatter placement algorithm with jitter, tilt, and random sizes

export interface ItemPlacement {
  id: string;
  x: number; // percentage from 0 to 100
  y: number; // percentage from 0 to 100
  rotation: number; // tilt in degrees, e.g. -12 to +12
  scale: number; // random sizing, e.g. 0.9 to 1.2
  color: string; // color hex
  shadowColor: string; // 3D drop shadow hex
  textColor: string;
}

export const ITEM_COLORS = [
  { bg: '#DC2626', shadow: '#B91C1C', text: '#DC2626', name: 'Red' },
  { bg: '#2563EB', shadow: '#1D4ED8', text: '#2563EB', name: 'Blue' },
  { bg: '#16A34A', shadow: '#15803D', text: '#16A34A', name: 'Green' },
  { bg: '#EAB308', shadow: '#CA8A04', text: '#CA8A04', name: 'Yellow' },
  { bg: '#9333EA', shadow: '#7E22CE', text: '#9333EA', name: 'Purple' },
  { bg: '#FF6B00', shadow: '#EA580C', text: '#FF6B00', name: 'Orange' },
  { bg: '#0891B2', shadow: '#0E7490', text: '#0891B2', name: 'Cyan' },
  { bg: '#EC4899', shadow: '#DB2777', text: '#EC4899', name: 'Pink' },
  { bg: '#92400E', shadow: '#78350F', text: '#92400E', name: 'Brown' },
  { bg: '#65A30D', shadow: '#4D7C0F', text: '#65A30D', name: 'Lime' },
  { bg: '#334155', shadow: '#1E293B', text: '#334155', name: 'Charcoal' },
  { bg: '#831843', shadow: '#701A75', text: '#831843', name: 'Plum' },
  { bg: '#1E3A8A', shadow: '#172554', text: '#1E3A8A', name: 'Navy' },
  { bg: '#F43F5E', shadow: '#E11D48', text: '#F43F5E', name: 'Coral' },
];

/**
 * Generates non-overlapping positions using a 4x3 grid (or 5x3 for >12 items)
 * with slight randomized position jitter and tilt within each assigned cell.
 * Guarantees zero collisions while ensuring all distinct colors are used before any repeat.
 */
export function generatePlacements(count: number): Array<{
  x: number;
  y: number;
  rotation: number;
  scale: number;
  colorIndex: number;
}> {
  // 4 columns x 3 rows for up to 12 items; 5 columns x 3 rows for up to 15 items
  let cols = 4;
  let rows = 3;
  if (count > 12) {
    cols = 5;
    rows = 3;
  }

  const marginX = 6;
  const marginTop = 3;
  const marginBottom = 4;
  const availW = 100 - marginX * 2;
  const availH = 100 - marginTop - marginBottom;
  const cellW = availW / cols;
  const cellH = availH / rows;

  // Generate all grid slots
  const slots: Array<{ r: number; c: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      slots.push({ r, c });
    }
  }

  // Shuffle slots so items are scattered across the grid
  const shuffledSlots = slots.sort(() => Math.random() - 0.5).slice(0, count);

  // Playful scale presets: compact 0.9x to giant 1.65x
  const scaleOptions = [0.9, 1.15, 1.4, 1.65];

  // Distinct color sampling: use each distinct color from the palette before repeating!
  // Uses the 12 core colors for count <= 12, or all 14 colors for count 14.
  const distinctColorIndices: number[] = [];
  const basePaletteSize = Math.min(Math.max(count, 12), ITEM_COLORS.length);
  while (distinctColorIndices.length < count) {
    const pool = Array.from({ length: basePaletteSize }, (_, i) => i).sort(() => Math.random() - 0.5);
    distinctColorIndices.push(...pool);
  }

  return shuffledSlots.map((slot, idx) => {
    // Gentle randomized jitter safely within cell bounds
    const jitterX = (Math.random() - 0.5) * (cellW * 0.20);
    const jitterY = (Math.random() - 0.5) * (cellH * 0.16);

    const x = Math.round((marginX + (slot.c + 0.5) * cellW + jitterX) * 10) / 10;
    const y = Math.round((marginTop + (slot.r + 0.5) * cellH + jitterY) * 10) / 10;

    // Gentle organic tilt between -8deg and +8deg
    const rotation = Math.round((Math.random() * 16 - 8) * 10) / 10;

    const scale = scaleOptions[idx % scaleOptions.length];
    const colorIndex = distinctColorIndices[idx];

    return {
      x,
      y,
      rotation,
      scale,
      colorIndex,
    };
  });
}
