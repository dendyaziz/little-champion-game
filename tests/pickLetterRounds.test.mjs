import test from 'node:test';
import assert from 'node:assert/strict';
import { generateRound } from '../src/utils/roundGenerator.ts';

for (const gameId of ['pick-letter-al', 'pick-letter-mz']) {
  test(`${gameId}: Round 1 has all uppercase target and items`, () => {
    for (let i = 0; i < 50; i++) {
      const round = generateRound(gameId, 1, []);
      assert.match(round.targetValue, /^[A-Z]$/);
      assert.ok(round.items.every((it) => it.value === it.value.toUpperCase()));
      const targetItems = round.items.filter((it) => it.isTarget);
      assert.ok(targetItems.length >= 3 && targetItems.length <= 5);
      assert.ok(targetItems.every((it) => it.value === round.targetValue));
    }
  });

  test(`${gameId}: Round 2 has all lowercase target and items`, () => {
    for (let i = 0; i < 50; i++) {
      const round = generateRound(gameId, 2, ['A']);
      assert.match(round.targetValue, /^[a-z]$/);
      assert.ok(round.items.every((it) => it.value === it.value.toLowerCase()));
      const targetItems = round.items.filter((it) => it.isTarget);
      assert.ok(targetItems.length >= 3 && targetItems.length <= 5);
      assert.ok(targetItems.every((it) => it.value === round.targetValue));
    }
  });

  test(`${gameId}: Round 3 has randomly cased target, matching target items, mixed distractors, and no uppercase I / lowercase l shape clash`, () => {
    let seenUpper = false;
    let seenLower = false;

    for (let i = 0; i < 100; i++) {
      const round = generateRound(gameId, 3, ['A', 'b']);
      if (round.targetValue === round.targetValue.toUpperCase()) seenUpper = true;
      if (round.targetValue === round.targetValue.toLowerCase()) seenLower = true;

      const targetItems = round.items.filter((it) => it.isTarget);
      const distractors = round.items.filter((it) => !it.isTarget);

      // Target items strictly match target letter capitalization
      assert.ok(targetItems.every((it) => it.value === round.targetValue));

      // Distractors must have a mix of upper and lower
      const upperDistractors = distractors.filter((it) => it.value === it.value.toUpperCase());
      const lowerDistractors = distractors.filter((it) => it.value === it.value.toLowerCase());
      assert.ok(upperDistractors.length > 0, 'must have uppercase distractors');
      assert.ok(lowerDistractors.length > 0, 'must have lowercase distractors');

      // Crucial: uppercase 'I' and lowercase 'l' must never be shown on the board
      assert.ok(!round.items.some((it) => it.value === 'I'), "Never show bare uppercase 'I' in mixed round 3");
      assert.ok(!round.items.some((it) => it.value === 'l'), "Never show bare lowercase 'l' in mixed round 3");
    }

    assert.ok(seenUpper, 'Round 3 targets should include uppercase');
    assert.ok(seenLower, 'Round 3 targets should include lowercase');
  });
}
