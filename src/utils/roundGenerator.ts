import { SHAPES, COLORS, type GameItem, type ShapeType, type ColorDefinition } from './gameModes';
import { generatePlacements, ITEM_COLORS } from './placement';

export interface RoundData {
  roundNumber: number;
  items: GameItem[];
  targetValue?: string;
  targetPrompt: string;
  targetSubPrompt?: string;
  targetKind: 'number' | 'letter' | 'shape' | 'color';
  targetShape?: ShapeType;
  targetColor?: ColorDefinition;
  targetCount: number; // number of targets to find in this round
}

function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateRound(
  gameId: string,
  roundNumber: number,
  previousTargets: string[] = []
): RoundData {
  switch (gameId) {
    case 'order-numbers': {
      const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      const placements = generatePlacements(numbers.length);
      const shuffledIndices = shuffle(numbers.map((_, i) => i));

      const items: GameItem[] = shuffledIndices.map((originalIndex, slotIndex) => {
        const p = placements[slotIndex];
        const color = ITEM_COLORS[p.colorIndex];
        return {
          id: `item-${roundNumber}-${originalIndex}`,
          value: numbers[originalIndex],
          kind: 'number',
          isTarget: originalIndex === 0, // starts at 0
          orderIndex: originalIndex,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: color.bg,
          shadowColor: color.shadow,
          textColor: color.text,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: '0',
        targetPrompt: 'Tap numbers in order!',
        targetKind: 'number',
        targetCount: 12,
      };
    }

    case 'order-letters-al': {
      const baseLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
      const half = Math.floor(baseLetters.length / 2); // 6
      const caseMask = shuffle(
        baseLetters.map((_, idx) => idx < half) // 6 true (upper), 6 false (lower)
      );
      const letters = baseLetters.map((l, idx) => {
        if (roundNumber === 1) return l.toUpperCase();
        if (roundNumber === 2) return l.toLowerCase();
        return caseMask[idx] ? l.toUpperCase() : l.toLowerCase();
      });

      const placements = generatePlacements(letters.length);
      const shuffledIndices = shuffle(letters.map((_, i) => i));

      const items: GameItem[] = shuffledIndices.map((originalIndex, slotIndex) => {
        const p = placements[slotIndex];
        const color = ITEM_COLORS[p.colorIndex];
        return {
          id: `item-${roundNumber}-${originalIndex}`,
          value: letters[originalIndex],
          kind: 'letter',
          isTarget: originalIndex === 0, // starts with A / a
          orderIndex: originalIndex,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: color.bg,
          shadowColor: color.shadow,
          textColor: color.text,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: letters[0],
        targetPrompt: 'Tap letters in order!',
        targetKind: 'letter',
        targetCount: 12,
      };
    }

    case 'order-letters-mz': {
      const baseLetters = ['M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
      const half = Math.floor(baseLetters.length / 2); // 7
      const caseMask = shuffle(
        baseLetters.map((_, idx) => idx < half) // 7 true (upper), 7 false (lower)
      );
      const letters = baseLetters.map((l, idx) => {
        if (roundNumber === 1) return l.toUpperCase();
        if (roundNumber === 2) return l.toLowerCase();
        return caseMask[idx] ? l.toUpperCase() : l.toLowerCase();
      });

      const placements = generatePlacements(letters.length);
      const shuffledIndices = shuffle(letters.map((_, i) => i));

      const items: GameItem[] = shuffledIndices.map((originalIndex, slotIndex) => {
        const p = placements[slotIndex];
        const color = ITEM_COLORS[p.colorIndex];
        return {
          id: `item-${roundNumber}-${originalIndex}`,
          value: letters[originalIndex],
          kind: 'letter',
          isTarget: originalIndex === 0, // starts with M / m
          orderIndex: originalIndex,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: color.bg,
          shadowColor: color.shadow,
          textColor: color.text,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: letters[0],
        targetPrompt: 'Tap letters in order!',
        targetKind: 'letter',
        targetCount: 14,
      };
    }

    case 'pick-number': {
      const allNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'];
      const candidates = allNumbers.filter((n) => !previousTargets.includes(n));
      const available = candidates.length > 0 ? candidates : allNumbers;
      const targetNumber = available[Math.floor(Math.random() * available.length)];
      const targetCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
      const otherNumbers = allNumbers.filter((n) => n !== targetNumber);
      const distractorCount = 12 - targetCount;

      const rawItems: Array<{ value: string; isTarget: boolean }> = [];
      for (let i = 0; i < targetCount; i++) {
        rawItems.push({ value: targetNumber, isTarget: true });
      }
      // Guarantee each distractor number is distinct before repeating
      const distractorNumbers: string[] = [];
      while (distractorNumbers.length < distractorCount) {
        distractorNumbers.push(...shuffle(otherNumbers));
      }
      for (let i = 0; i < distractorCount; i++) {
        rawItems.push({ value: distractorNumbers[i], isTarget: false });
      }

      const shuffled = shuffle(rawItems);
      const placements = generatePlacements(shuffled.length);

      const items: GameItem[] = shuffled.map((item, index) => {
        const p = placements[index];
        const color = ITEM_COLORS[p.colorIndex];
        return {
          id: `item-${roundNumber}-${index}`,
          value: item.value,
          kind: 'number',
          isTarget: item.isTarget,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: color.bg,
          shadowColor: color.shadow,
          textColor: color.text,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: targetNumber,
        targetPrompt: `Find ${targetNumber}!`,
        targetKind: 'number',
        targetCount,
      };
    }

    case 'pick-letter':
    case 'pick-letter-al':
    case 'pick-letter-mz': {
      const allLetters =
        gameId === 'pick-letter-al'
          ? 'ABCDEFGHIJKL'.split('')
          : gameId === 'pick-letter-mz'
          ? 'MNOPQRSTUVWXYZ'.split('')
          : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
      const candidates = allLetters.filter((l) => !previousTargets.includes(l));
      const available = candidates.length > 0 ? candidates : allLetters;
      const targetLetter = available[Math.floor(Math.random() * available.length)];
      const targetCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
      const otherLetters = allLetters.filter((l) => l !== targetLetter);
      const distractorCount = 12 - targetCount;

      const rawItems: Array<{ value: string; isTarget: boolean }> = [];
      for (let i = 0; i < targetCount; i++) {
        rawItems.push({ value: targetLetter, isTarget: true });
      }
      // Guarantee each distractor letter is distinct before repeating
      const distractorLetters: string[] = [];
      while (distractorLetters.length < distractorCount) {
        distractorLetters.push(...shuffle(otherLetters));
      }
      for (let i = 0; i < distractorCount; i++) {
        rawItems.push({ value: distractorLetters[i], isTarget: false });
      }

      const shuffled = shuffle(rawItems);
      const placements = generatePlacements(shuffled.length);

      const items: GameItem[] = shuffled.map((item, index) => {
        const p = placements[index];
        const color = ITEM_COLORS[p.colorIndex];
        return {
          id: `item-${roundNumber}-${index}`,
          value: item.value,
          kind: 'letter',
          isTarget: item.isTarget,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: color.bg,
          shadowColor: color.shadow,
          textColor: color.text,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: targetLetter,
        targetPrompt: `Find ${targetLetter}!`,
        targetKind: 'letter',
        targetCount,
      };
    }

    case 'pick-shape': {
      const candidates = SHAPES.filter(
        (s) => !previousTargets.includes(s.id) && !previousTargets.includes(s.name)
      );
      const available = candidates.length > 0 ? candidates : SHAPES;
      const targetShapeDef = available[Math.floor(Math.random() * available.length)];
      const targetCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
      const otherShapes = SHAPES.filter((s) => s.id !== targetShapeDef.id);
      const distractorCount = 12 - targetCount;

      const rawItems: Array<{ shape: ShapeType; isTarget: boolean }> = [];
      for (let i = 0; i < targetCount; i++) {
        rawItems.push({ shape: targetShapeDef.id, isTarget: true });
      }
      // Guarantee each distractor shape is distinct before repeating
      const distractorShapes: ShapeType[] = [];
      while (distractorShapes.length < distractorCount) {
        distractorShapes.push(...shuffle(otherShapes).map((s) => s.id));
      }
      for (let i = 0; i < distractorCount; i++) {
        rawItems.push({ shape: distractorShapes[i], isTarget: false });
      }

      const shuffled = shuffle(rawItems);
      const placements = generatePlacements(shuffled.length);

      const items: GameItem[] = shuffled.map((item, index) => {
        const p = placements[index];
        const color = ITEM_COLORS[p.colorIndex];
        return {
          id: `item-${roundNumber}-${index}`,
          value: item.shape,
          shape: item.shape,
          kind: 'shape',
          isTarget: item.isTarget,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: color.bg,
          shadowColor: color.shadow,
          textColor: color.text,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: targetShapeDef.name,
        targetShape: targetShapeDef.id,
        targetPrompt: `Find ${targetShapeDef.name}!`,
        targetKind: 'shape',
        targetCount,
      };
    }

    case 'pick-color': {
      const candidates = COLORS.filter(
        (c) => !previousTargets.includes(c.id) && !previousTargets.includes(c.name)
      );
      const available = candidates.length > 0 ? candidates : COLORS;
      const targetColorDef = available[Math.floor(Math.random() * available.length)];
      const targetCount = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
      const otherColors = COLORS.filter((c) => c.id !== targetColorDef.id);
      const distractorCount = 12 - targetCount;

      const rawItems: Array<{ colorDef: ColorDefinition; isTarget: boolean }> = [];
      for (let i = 0; i < targetCount; i++) {
        rawItems.push({ colorDef: targetColorDef, isTarget: true });
      }
      // Guarantee each distractor color is distinct before repeating
      const distractorColors: ColorDefinition[] = [];
      while (distractorColors.length < distractorCount) {
        distractorColors.push(...shuffle(otherColors));
      }
      for (let i = 0; i < distractorCount; i++) {
        rawItems.push({ colorDef: distractorColors[i], isTarget: false });
      }

      const shuffled = shuffle(rawItems);
      const placements = generatePlacements(shuffled.length);

      const items: GameItem[] = shuffled.map((item, index) => {
        const p = placements[index];
        const randomShape = SHAPES[Math.floor(Math.random() * SHAPES.length)].id;
        return {
          id: `item-${roundNumber}-${index}`,
          value: item.colorDef.name,
          kind: 'color',
          shape: randomShape,
          isTarget: item.isTarget,
          x: p.x,
          y: p.y,
          rotation: p.rotation,
          scale: p.scale,
          bgColor: item.colorDef.hex,
          shadowColor: item.colorDef.shadowHex,
          textColor: item.colorDef.hex,
          colorHex: item.colorDef.hex,
        };
      });

      return {
        roundNumber,
        items,
        targetValue: targetColorDef.name,
        targetColor: targetColorDef,
        targetPrompt: `Find ${targetColorDef.name}!`,
        targetKind: 'color',
        targetCount,
      };
    }

    default:
      throw new Error(`Unknown gameId: ${gameId}`);
  }
}
