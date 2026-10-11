import { test } from 'node:test';
import assert from 'node:assert/strict';
import { fitPlayfield } from '../src/utils/playfieldLayout.ts';

const viewports = [[320, 488], [390, 764], [430, 852], [844, 326], [768, 944], [1024, 688]];
function itemsFor(count, seed) {
  const cols = count > 12 ? 5 : 4;
  return Array.from({ length: count }, (_, i) => ({
    id: `item-${i}`, value: `${i}`, kind: 'number',
    x: 6 + (i % cols + .5) * 88 / cols + (seed % 2 ? 1 : -1) * 88 / cols * .1,
    y: 3 + (Math.floor(i / cols) + .5) * 31 + (seed % 3 ? 1 : -1) * 31 * .08,
    scale: [0.9, 1.15, 1.4, 1.65][i % 4], rotation: i % 2 ? 8 : -8,
  }));
}
test('every answer touch region fits and stays disjoint across supported sizes', () => {
  for (const [width, height] of viewports) for (const count of [12, 14]) for (let seed = 0; seed < 6; seed++) {
    const layout = fitPlayfield(itemsFor(count, seed), width, height);
    assert.equal(layout.length, count);
    for (const a of layout) {
      assert.ok(a.side >= 48, `touch size ${a.side} at ${width}x${height}`);
      assert.ok(a.x - a.side / 2 >= 0 && a.x + a.side / 2 <= width);
      assert.ok(a.y - a.side / 2 >= 0 && a.y + a.side / 2 <= height);
      for (const b of layout) if (a !== b) {
        assert.ok(Math.abs(a.x - b.x) >= (a.side + b.side) / 2 || Math.abs(a.y - b.y) >= (a.side + b.side) / 2);
      }
    }
  }
});
test('popping answers never repacks or changes the surviving positions', () => {
  const items = itemsFor(14, 1);
  const before = fitPlayfield(items, 390, 764);
  const after = fitPlayfield(items.map((item, i) => ({ ...item, isPopped: i % 2 === 0 })), 390, 764);
  assert.deepEqual(after.map(({ x, y, side }) => [x, y, side]), before.map(({ x, y, side }) => [x, y, side]));
  assert.deepEqual(items, itemsFor(14, 1));
});
