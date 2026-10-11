// 5-Star calculation with ceiling rounding to nearest 0.5 stars

export function calculateStars(points: number, maxPoints: number): number {
  if (points <= 0 || maxPoints <= 0) return 0;
  
  // Raw 5-star calculation
  const rawStars = Math.min(5, (points / maxPoints) * 5);
  
  // Ceiling rounding to every 0.5 stars
  // e.g. 2.01 -> ceil(4.02) / 2 = 5 / 2 = 2.5
  const roundedStars = Math.ceil(rawStars * 2) / 2;
  
  return Math.min(5, Math.max(0.5, roundedStars));
}

export type StarType = 'full' | 'half' | 'empty';

export function getStarTypes(stars: number): StarType[] {
  const result: StarType[] = [];
  for (let i = 1; i <= 5; i++) {
    if (stars >= i) {
      result.push('full');
    } else if (stars >= i - 0.5) {
      result.push('half');
    } else {
      result.push('empty');
    }
  }
  return result;
}
