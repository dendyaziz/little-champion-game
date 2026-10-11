// Game modes definitions, round generators, and shape/color models

export type GameType = 'order' | 'pick';

export interface GameItem {
  id: string; // unique item id in the round
  value: string; // display value or shape name or color name
  kind: 'number' | 'letter' | 'shape' | 'color';
  isTarget: boolean; // whether this item is the target to tap
  orderIndex?: number; // for sequential order games (0, 1, 2...)
  x: number; // percentage
  y: number; // percentage
  rotation: number; // degrees
  scale?: number; // random sizing scale factor
  bgColor: string;
  shadowColor: string;
  textColor: string;
  shape?: ShapeType;
  colorHex?: string;
  strokeColor?: string;
  isPopping?: boolean;
  isPopped?: boolean;
  isShaking?: boolean;
}

export type ShapeType = 'square' | 'rectangle' | 'triangle' | 'rhombus' | 'heart' | 'star' | 'circle' | 'oval';

export interface ShapeDefinition {
  id: ShapeType;
  name: string;
}

export const SHAPES: ShapeDefinition[] = [
  { id: 'square', name: 'Square' },
  { id: 'rectangle', name: 'Rectangle' },
  { id: 'triangle', name: 'Triangle' },
  { id: 'rhombus', name: 'Rhombus' },
  { id: 'heart', name: 'Heart' },
  { id: 'star', name: 'Star' },
  { id: 'circle', name: 'Circle' },
  { id: 'oval', name: 'Oval' },
];

export interface ColorDefinition {
  id: string;
  name: string;
  hex: string;
  shadowHex: string;
  strokeHex?: string;
}

export const COLORS: ColorDefinition[] = [
  { id: 'blue', name: 'Blue', hex: '#2563EB', shadowHex: '#1D4ED8' },
  { id: 'red', name: 'Red', hex: '#EF4444', shadowHex: '#B91C1C' },
  { id: 'green', name: 'Green', hex: '#16A34A', shadowHex: '#15803D' },
  { id: 'purple', name: 'Purple', hex: '#9333EA', shadowHex: '#7E22CE' },
  { id: 'yellow', name: 'Yellow', hex: '#EAB308', shadowHex: '#CA8A04' },
  { id: 'orange', name: 'Orange', hex: '#FF6B00', shadowHex: '#EA580C' },
  { id: 'pink', name: 'Pink', hex: '#EC4899', shadowHex: '#DB2777' },
  { id: 'white', name: 'White', hex: '#FFFFFF', shadowHex: '#E2E8F0', strokeHex: '#CCC' },
  { id: 'black', name: 'Black', hex: '#1E293B', shadowHex: '#0F172A' },
];

export interface GameModeConfig {
  id: string;
  title: string;
  subtitle: string;
  type: GameType;
  category: 'numbers' | 'alphabet' | 'shapes' | 'colors';
  icon: string; // lucide icon identifier
  accentColor: string;
  shadowColor: string;
}

export const GAME_MODES: GameModeConfig[] = [
  {
    id: 'order-numbers',
    title: 'Order Numbers',
    subtitle: 'Tap numbers in order: 0 to 11',
    type: 'order',
    category: 'numbers',
    icon: 'ListOrdered',
    accentColor: '#38BDF8',
    shadowColor: '#0284C7',
  },
  {
    id: 'pick-number',
    title: 'Find Number',
    subtitle: 'Find and tap the target number',
    type: 'pick',
    category: 'numbers',
    icon: 'Search',
    accentColor: '#FBBF24',
    shadowColor: '#D97706',
  },
  {
    id: 'order-letters-al',
    title: 'Order Letters A–L',
    subtitle: 'Tap letters in order: A to L',
    type: 'order',
    category: 'alphabet',
    icon: 'BookOpen',
    accentColor: '#34D399',
    shadowColor: '#059669',
  },
  {
    id: 'order-letters-mz',
    title: 'Order Letters M–Z',
    subtitle: 'Tap letters in order: M to Z',
    type: 'order',
    category: 'alphabet',
    icon: 'Sparkles',
    accentColor: '#A78BFA',
    shadowColor: '#7C3AED',
  },
  {
    id: 'pick-letter-al',
    title: 'Find Letter A–L',
    subtitle: 'Find and tap the target letter (A–L)',
    type: 'pick',
    category: 'alphabet',
    icon: 'Eye',
    accentColor: '#FB923C',
    shadowColor: '#EA580C',
  },
  {
    id: 'pick-letter-mz',
    title: 'Find Letter M–Z',
    subtitle: 'Find and tap the target letter (M–Z)',
    type: 'pick',
    category: 'alphabet',
    icon: 'Eye',
    accentColor: '#6366F1',
    shadowColor: '#4F46E5',
  },
  {
    id: 'pick-shape',
    title: 'Find Shape',
    subtitle: 'Find shapes: Star, Circle, Heart & more',
    type: 'pick',
    category: 'shapes',
    icon: 'Shapes',
    accentColor: '#F472B6',
    shadowColor: '#DB2777',
  },
  {
    id: 'pick-color',
    title: 'Find Color',
    subtitle: 'Find matching colors: Red, Blue & more',
    type: 'pick',
    category: 'colors',
    icon: 'Palette',
    accentColor: '#2DD4BF',
    shadowColor: '#0D9488',
  },
];
