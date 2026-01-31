export type MaskType = 'NEUTRAL' | 'WORK' | 'FAMILY' | 'SOCIAL';

export interface GameState {
  hp: number;
  maxHp: number;
  score: number;
  combo: number;
  level: number;
  currentMask: MaskType;
  isPlaying: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  isPaused: boolean;
  screenShake: boolean;
}

export const initialState: GameState = {
  hp: 100,
  maxHp: 100,
  score: 0,
  combo: 0,
  level: 1,
  currentMask: 'NEUTRAL',
  isPlaying: false,
  isGameOver: false,
  isVictory: false,
  isPaused: false,
  screenShake: false,
};

// Mask color mapping for Excalibur
export const MASK_COLORS = {
  NEUTRAL: '#ffffff',
  WORK: '#3B82F6',
  FAMILY: '#F97316',
  SOCIAL: '#8B5CF6',
} as const;

// Key bindings
export const KEY_BINDINGS = {
  WORK: 'KeyQ',
  FAMILY: 'KeyW',
  SOCIAL: 'KeyE',
  START: 'Space',
  PAUSE: 'Escape',
} as const;
