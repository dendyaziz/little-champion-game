export const DIGIT_WORDS = ['ZERO', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE'];

export function isParentPath(path: string): boolean {
  return path === '/parents' || path.startsWith('/parents/');
}

export function canonicalAppPath(path: string): string {
  return path.replace(/\/$/, '') === '/records' ? '/parents/records' : path;
}

export function createParentChallenge(): string {
  const values = new Uint32Array(3);
  globalThis.crypto.getRandomValues(values);
  return `${1 + values[0] % 9}${values[1] % 10}${values[2] % 10}`;
}
