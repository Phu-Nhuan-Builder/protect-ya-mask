import * as ex from 'excalibur';
import { GAME_WIDTH, GAME_HEIGHT, LEVELS } from '@/game/constants';
import { Player } from '@/game/actors/Player';
import { Spawner } from '@/game/actors/Spawner';
import { loader, Images, Sounds } from '@/game/resources';

export class GameEngine {
  private engine: ex.Engine;
  private player: Player | null = null;
  private spawner: Spawner | null = null;
  private isInitialized: boolean = false;
  private lastUpdateTime: number = 0;
  private backgroundActor: ex.Actor | null = null;
  private currentMusicTrack: ex.Sound | null = null;

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

    // Load all resources
    await this.engine.start(loader);

    // Create main scene
    const mainScene = new ex.Scene();
    this.engine.addScene('main', mainScene);
    this.engine.goToScene('main');

    // Add background
    this.backgroundActor = new ex.Actor({
      x: GAME_WIDTH / 2,
      y: GAME_HEIGHT / 2,
      anchor: ex.vec(0.5, 0.5),
      z: -100,
    });
    this.setLevelBackground(1);
    mainScene.add(this.backgroundActor);

    // Initialize player at center
    this.player = new Player(GAME_WIDTH / 2, GAME_HEIGHT / 2);
    mainScene.add(this.player);

    // Initialize spawner
    this.spawner = new Spawner(mainScene);

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
    this.engine.stop(); // Stop until game starts
  }

  public setLevelBackground(level: number): void {
    if (!this.backgroundActor) return;

    let bgImage: ex.ImageSource | null = null;
    switch (level) {
      case 1:
        bgImage = Images.level1Bg;
        break;
      case 2:
        bgImage = Images.level2Bg;
        break;
      case 3:
        bgImage = Images.level3Bg;
        break;
    }

    if (bgImage && bgImage.isLoaded()) {
      const sprite = bgImage.toSprite();
      // Scale to fit game dimensions
      sprite.scale = ex.vec(GAME_WIDTH / sprite.width, GAME_HEIGHT / sprite.height);
      this.backgroundActor.graphics.use(sprite);
    }
  }

  public playLevelMusic(level: number): void {
    // Stop current music
    this.stopMusic();

    let music: ex.Sound | null = null;
    switch (level) {
      case 1:
        music = Sounds.level1Music;
        break;
      case 2:
        music = Sounds.level2Music;
        break;
      case 3:
        music = Sounds.level3Music;
        break;
    }

    if (music && music.isLoaded()) {
      music.loop = true;
      // Use promise to handle autoplay restrictions
      const playPromise = music.play(0.3);
      if (playPromise) {
        playPromise.catch((error) => {
          console.log('Audio autoplay blocked, will retry on user interaction:', error);
        });
      }
      this.currentMusicTrack = music;
    } else {
      console.log('Music not loaded yet for level:', level, 'isLoaded:', music?.isLoaded());
    }
  }

  public stopMusic(): void {
    if (this.currentMusicTrack) {
      this.currentMusicTrack.stop();
      this.currentMusicTrack = null;
    }
  }

  public playGameOverSound(): void {
    if (Sounds.gameOver.isLoaded()) {
      Sounds.gameOver.play(0.5);
    }
  }

  public start(): void {
    if (!this.isInitialized) {
      console.log('Game not initialized yet, waiting...');
      return;
    }
    
    this.engine.start();
    this.spawner?.start();
    this.setLevelBackground(1);
    this.playLevelMusic(1);
  }

  public isReady(): boolean {
    return this.isInitialized;
  }

  public stop(): void {
    this.spawner?.stop();
    this.stopMusic();
    this.engine.stop();
  }

  public restart(): void {
    // Clear all enemies (keep player and background)
    const mainScene = this.engine.currentScene;
    if (mainScene) {
      const actors = mainScene.actors;
      actors.forEach((actor) => {
        if (actor !== this.player && actor !== this.backgroundActor) {
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

    // Reset background and music
    this.setLevelBackground(1);
    this.playLevelMusic(1);
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

  public onLevelChange(level: number): void {
    this.setLevelBackground(level);
    this.playLevelMusic(level);
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
