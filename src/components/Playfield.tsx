import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { GameItem } from '../utils/gameModes';
import { PlayItem } from './items/PlayItem';
import { fitPlayfield } from '../utils/playfieldLayout';

/** Presentation only: keep every item (including popped ones) in its original slot. */
export function Playfield({ items, onTap }: { items: GameItem[]; onTap: (item: GameItem) => void }) {
  const field = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const element = field.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);
  const layout = useMemo(() => fitPlayfield(items, size.width, size.height), [items, size]);
  return (
    <div ref={field} className="playfield">
      {layout.map(({ item, x, y, side }) => (
        <PlayItem key={item.id} item={item} onTap={onTap} layout={{ x, y, side }} />
      ))}
    </div>
  );
}
