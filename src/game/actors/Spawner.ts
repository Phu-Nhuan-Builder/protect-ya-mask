import * as ex from 'excalibur';
import { MaskType } from '@/store/initialState';
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  ENEMY_BASE_SPEED,
  SPAWN_MARGIN,
  ENEMY_TYPES,
  LEVELS,
} from '@/game/constants';
import { Enemy } from '@/game/actors/Enemy';
import * as StoreBridge from '@/game/storeBridge';

export interface WaveEntry {
  time: number;
  type: MaskType;
  speed: number;
}

export class Spawner {
  private scene: ex.Scene;
  private currentLevel: number = 1;
  private spawnTimer: number = 0;
  private levelTimer: number = 0;
  private isActive: boolean = false;
  private waveData: WaveEntry[] = [];
  private waveIndex: number = 0;

  constructor(scene: ex.Scene) {
    this.scene = scene;
    this.generateWaveData();
  }

  private generateWaveData(): void {
    // Generate procedural wave data for current level
    const levelConfig = LEVELS[this.currentLevel - 1] || LEVELS[0];
    const waves: WaveEntry[] = [];
    
    let time = 0;
    const duration = levelConfig.duration;
    
    while (time < duration) {
      const type = ENEMY_TYPES[Math.floor(Math.random() * ENEMY_TYPES.length)];
      const speed = ENEMY_BASE_SPEED * levelConfig.speedMultiplier * (0.8 + Math.random() * 0.4);
      
      waves.push({ time, type, speed });
      time += levelConfig.spawnInterval * (0.7 + Math.random() * 0.6);
    }

    this.waveData = waves;
    this.waveIndex = 0;
  }

  public start(): void {
    this.isActive = true;
    this.spawnTimer = 0;
    this.levelTimer = 0;
    this.generateWaveData();
    StoreBridge.setLevel(this.currentLevel);
  }

  public stop(): void {
    this.isActive = false;
  }

  public update(delta: number): void {
    if (!this.isActive) return;

    this.levelTimer += delta;

    // Check for level completion
    const levelConfig = LEVELS[this.currentLevel - 1] || LEVELS[0];
    if (this.levelTimer >= levelConfig.duration) {
      this.advanceLevel();
      return;
    }

    // Check wave data for spawns
    while (
      this.waveIndex < this.waveData.length &&
      this.waveData[this.waveIndex].time <= this.levelTimer
    ) {
      const wave = this.waveData[this.waveIndex];
      this.spawnEnemy(wave.type, wave.speed);
      this.waveIndex++;
    }
  }

  private advanceLevel(): void {
    if (this.currentLevel >= LEVELS.length) {
      // Victory!
      StoreBridge.victory();
      this.stop();
    } else {
      this.currentLevel++;
      this.levelTimer = 0;
      this.generateWaveData();
      StoreBridge.setLevel(this.currentLevel);
    }
  }

  private spawnEnemy(type: MaskType, speed: number): void {
    const spawnPos = this.getRandomSpawnPosition();
    const targetX = GAME_WIDTH / 2;
    const targetY = GAME_HEIGHT / 2;

    const enemy = new Enemy(spawnPos.x, spawnPos.y, type, speed, targetX, targetY);
    this.scene.add(enemy);
  }

  private getRandomSpawnPosition(): { x: number; y: number } {
    const side = Math.floor(Math.random() * 4);
    
    switch (side) {
      case 0: // Top
        return { x: Math.random() * GAME_WIDTH, y: -SPAWN_MARGIN };
      case 1: // Right
        return { x: GAME_WIDTH + SPAWN_MARGIN, y: Math.random() * GAME_HEIGHT };
      case 2: // Bottom
        return { x: Math.random() * GAME_WIDTH, y: GAME_HEIGHT + SPAWN_MARGIN };
      case 3: // Left
      default:
        return { x: -SPAWN_MARGIN, y: Math.random() * GAME_HEIGHT };
    }
  }

  public reset(): void {
    this.currentLevel = 1;
    this.spawnTimer = 0;
    this.levelTimer = 0;
    this.waveIndex = 0;
    this.generateWaveData();
  }
}
