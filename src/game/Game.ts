import * as ex from 'excalibur';
import { GAME_WIDTH, GAME_HEIGHT } from '@/game/constants';
import { Player } from '@/game/actors/Player';
import { Spawner } from '@/game/actors/Spawner';

export class GameEngine {
  private engine: ex.Engine;
  private player: Player | null = null;
  private spawner: Spawner | null = null;
  private isInitialized: boolean = false;
  private lastUpdateTime: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.engine = new ex.Engine({
      canvasElement: canvas,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
      backgroundColor: ex.Color.fromHex('#0a0a14'),
      displayMode: ex.DisplayMode.FitScreen,
      antialiasing: true,
    });
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    // Create main scene
    const mainScene = new ex.Scene();
    this.engine.addScene('main', mainScene);
    this.engine.goToScene('main');

    // Initialize player at center
    this.player = new Player(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    mainScene.add(this.player);

    // Initialize spawner
    this.spawner = new Spawner(mainScene);

    // Add background grid effect
    this.addBackgroundEffect(mainScene);

    // Setup update loop for spawner
    this.lastUpdateTime = performance.now();
    mainScene.on('preupdate', () => {
      const now = performance.now();
      const delta = now - this.lastUpdateTime;
      this.lastUpdateTime = now;
      if (this.spawner) {
        this.spawner.update(delta);
      }
    });

    this.isInitialized = true;
  }

  private addBackgroundEffect(scene: ex.Scene): void {
    // Add subtle grid lines
    const gridSize = 50;
    const gridColor = ex.Color.fromHex('#1a1a2e');

    for (let x = 0; x <= GAME_WIDTH; x += gridSize) {
      const line = new ex.Actor({
        x: x,
        y: GAME_HEIGHT / 2,
        width: 1,
        height: GAME_HEIGHT,
        color: gridColor,
      });
      scene.add(line);
    }

    for (let y = 0; y <= GAME_HEIGHT; y += gridSize) {
      const line = new ex.Actor({
        x: GAME_WIDTH / 2,
        y: y,
        width: GAME_WIDTH,
        height: 1,
        color: gridColor,
      });
      scene.add(line);
    }
  }

  public start(): void {
    if (!this.isInitialized) {
      console.warn('Game not initialized');
      return;
    }
    
    this.engine.start();
    this.spawner?.start();
  }

  public stop(): void {
    this.spawner?.stop();
    this.engine.stop();
  }

  public restart(): void {
    // Clear all enemies
    const mainScene = this.engine.currentScene;
    if (mainScene) {
      const actors = mainScene.actors;
      actors.forEach((actor) => {
        if (actor !== this.player) {
          actor.kill();
        }
      });
    }

    // Reset spawner
    this.spawner?.reset();
    this.spawner?.start();

    // Reset player
    if (this.player) {
      this.player.setMask('NEUTRAL');
    }
  }

  public pause(): void {
    this.spawner?.stop();
  }

  public resume(): void {
    this.spawner?.start();
  }

  public dispose(): void {
    this.stop();
  }

  public getEngine(): ex.Engine {
    return this.engine;
  }
}

// Singleton instance
let gameInstance: GameEngine | null = null;

export function createGame(canvas: HTMLCanvasElement): GameEngine {
  if (gameInstance) {
    gameInstance.dispose();
  }
  gameInstance = new GameEngine(canvas);
  return gameInstance;
}

export function getGame(): GameEngine | null {
  return gameInstance;
}
