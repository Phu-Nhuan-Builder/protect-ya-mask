import { MaskType } from '@/store/initialState';

// Canvas dimensions
export const GAME_WIDTH = 800;
export const GAME_HEIGHT = 600;

// Player settings
export const PLAYER_SIZE = 64;
export const ZONE_CIRCLE_RADIUS = 80;

// Enemy settings
export const ENEMY_SIZE = 40;
export const ENEMY_BASE_SPEED = 100;
export const SPAWN_MARGIN = 50; // Spawn offset from screen edge

// Gameplay
export const DAMAGE_PER_HIT = 10;
export const SCORE_PER_KILL = 10;

// Level configurations
export interface LevelConfig {
  name: string;
  timeLabel: string;
  speedMultiplier: number;
  spawnInterval: number;
  duration: number; // in ms
}

export const LEVELS: LevelConfig[] = [
  {
    name: 'Morning Rush',
    timeLabel: '07:00 AM - Áp lực gia đình',
    speedMultiplier: 1.0,
    spawnInterval: 2000,
    duration: 60000, // 1 minute
  },
  {
    name: 'The Grind',
    timeLabel: '09:00 AM - Địa ngục công sở',
    speedMultiplier: 1.3,
    spawnInterval: 1500,
    duration: 60000,
  },
  {
    name: 'The Void',
    timeLabel: '23:00 PM - Đối mặt bản ngã',
    speedMultiplier: 1.6,
    spawnInterval: 1000,
    duration: 60000,
  },
];

// Enemy types for spawning
export const ENEMY_TYPES: MaskType[] = ['WORK', 'FAMILY', 'SOCIAL'];

// Color hex values for rendering
export const MASK_HEX_COLORS = {
  NEUTRAL: '#ffffff',
  WORK: '#3B82F6',
  FAMILY: '#F97316',
  SOCIAL: '#8B5CF6',
} as const;
