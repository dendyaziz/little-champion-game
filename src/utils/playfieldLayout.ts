import type { GameItem } from './gameModes';

/** Reproject the existing random slots without generating answers or randomizing again. */
export function fitPlayfield(items: GameItem[], width: number, height: number) {
  if (!width || !height || !items.length) return [];
  const count = items.length;
  const inset = Math.min(24, width * 0.04);
  const w = width - inset * 2;
  const h = height - inset * 2;
  const preferred = width < 600 && height > width ? 3 : count > 12 ? 5 : 4;
  // Maximize the shortest cell dimension, gently favoring the intended orientation.
  const columns = [2, 3, 4, 5, 6, 7].reduce((best, cols) => {
    const quality = (c: number) => Math.min(w / c, h / Math.ceil(count / c)) * (c === preferred ? 1.08 : 1);
    return quality(cols) > quality(best) ? cols : best;
  }, preferred);
  const rows = Math.ceil(count / columns);
  const cellW = w / columns;
  const cellH = h / rows;
  const side = Math.min(cellW, cellH) * 0.84;
  const originalCols = count > 12 ? 5 : 4;
  const originalCellW = 88 / originalCols;
  const originalCellH = 93 / 3;
  const sourceSlot = (item: GameItem) => {
    const col = Math.min(originalCols - 1, Math.max(0, Math.floor((item.x - 6) / originalCellW)));
    const row = Math.min(2, Math.max(0, Math.floor((item.y - 3) / originalCellH)));
    return row * originalCols + col;
  };
  const ordered = [...items].sort((a, b) => sourceSlot(a) - sourceSlot(b));
  return ordered.map((item, index) => {
    const col = index % columns;
    const row = Math.floor(index / columns);
    const source = sourceSlot(item);
    // Retain the existing jitter, bounded so the entire touch rectangle stays in its cell.
    const jitterX = (item.x - (6 + (source % originalCols + 0.5) * originalCellW)) / originalCellW;
    const jitterY = (item.y - (3 + (Math.floor(source / originalCols) + 0.5) * originalCellH)) / originalCellH;
    const slackX = (cellW - side) / 2;
    const slackY = (cellH - side) / 2;
    return { item, side,
      x: inset + (col + 0.5) * cellW + Math.max(-slackX, Math.min(slackX, jitterX * cellW * 0.5)),
      y: inset + (row + 0.5) * cellH + Math.max(-slackY, Math.min(slackY, jitterY * cellH * 0.5)),
    };
  });
}
