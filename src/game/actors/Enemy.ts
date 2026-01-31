import * as ex from 'excalibur';
import { MaskType } from '@/store/initialState';
import { ENEMY_SIZE, MASK_HEX_COLORS, ZONE_CIRCLE_RADIUS } from '@/game/constants';
import { Player } from '@/game/actors/Player';
import * as StoreBridge from '@/game/storeBridge';
import { Images, Sounds } from '@/game/resources';

export class Enemy extends ex.Actor {
  public enemyType: MaskType;
  private speed: number;
  private targetX: number;
  private targetY: number;
  private hasCollided: boolean = false;
  private currentLevel: number;
  
  // Level 3 unpredictable movement
  private zigzagTimer: number = 0;
  private zigzagInterval: number = 300; // Change direction every 300ms
  private zigzagAmplitude: number = 0;
  private perpendicularDir: ex.Vector = ex.vec(0, 0);

  constructor(
    x: number,
    y: number,
    type: MaskType,
    speed: number,
    targetX: number,
    targetY: number,
    level: number = 1
  ) {
    super({
      x,
      y,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      anchor: ex.vec(0.5, 0.5),
      collisionType: ex.CollisionType.Active,
    });

    this.enemyType = type;
    this.speed = speed;
    this.targetX = targetX;
    this.targetY = targetY;
    this.currentLevel = level;
    
    // Setup unpredictable movement for Level 3
    if (this.currentLevel >= 3) {
      this.zigzagAmplitude = 80 + Math.random() * 60; // Random amplitude
      this.zigzagInterval = 200 + Math.random() * 200; // Random interval
    }
  }

  onInitialize(): void {
    // Get enemy sprite based on type
    let enemyImage: ex.ImageSource | null = null;
    switch (this.enemyType) {
      case 'WORK':
        enemyImage = Images.enemyWork;
        break;
      case 'FAMILY':
        enemyImage = Images.enemyFamily;
        break;
      case 'SOCIAL':
        enemyImage = Images.enemySocial;
        break;
    }

    if (enemyImage && enemyImage.isLoaded()) {
      const sprite = enemyImage.toSprite();
      sprite.scale = ex.vec(ENEMY_SIZE / sprite.width * 1.5, ENEMY_SIZE / sprite.height * 1.5);
      this.graphics.use(sprite);
    } else {
      // Fallback to colored circle
      const color = ex.Color.fromHex(MASK_HEX_COLORS[this.enemyType]);
      const enemyGraphic = new ex.Circle({
        radius: ENEMY_SIZE / 2,
        color: color,
        strokeColor: ex.Color.White,
        lineWidth: 2,
      });
      this.graphics.use(enemyGraphic);
    }

    // Calculate direction to target
    const direction = ex.vec(this.targetX - this.pos.x, this.targetY - this.pos.y).normalize();
    this.vel = direction.scale(this.speed);

    // Add slight rotation for visual effect
    this.angularVelocity = 2;
  }

  onPreUpdate(engine: ex.Engine, delta: number): void {
    // Level 3: Unpredictable zigzag movement
    if (this.currentLevel >= 3) {
      this.zigzagTimer += delta;
      
      if (this.zigzagTimer >= this.zigzagInterval) {
        this.zigzagTimer = 0;
        // Randomize next interval for more chaos
        this.zigzagInterval = 150 + Math.random() * 250;
        
        // Calculate new velocity with random perpendicular offset
        const toTarget = ex.vec(this.targetX - this.pos.x, this.targetY - this.pos.y).normalize();
        
        // Get perpendicular vector (rotate 90 degrees)
        this.perpendicularDir = ex.vec(-toTarget.y, toTarget.x);
        
        // Random zigzag direction and amplitude
        const zigzagOffset = (Math.random() - 0.5) * 2 * this.zigzagAmplitude;
        
        // Combine forward movement with zigzag
        const newVel = toTarget.scale(this.speed).add(this.perpendicularDir.scale(zigzagOffset));
        this.vel = newVel;
        
        // Add slight rotation change for visual chaos
        this.angularVelocity = (Math.random() - 0.5) * 8;
      }
    }
    
    // Check distance to center
    const distanceToCenter = this.pos.distance(ex.vec(this.targetX, this.targetY));
    
    if (distanceToCenter < ZONE_CIRCLE_RADIUS && !this.hasCollided) {
      this.checkCollisionWithPlayer(engine);
    }

    // Kill if past center
    if (distanceToCenter < 10) {
      this.kill();
    }
  }

  private checkCollisionWithPlayer(engine: ex.Engine): void {
    this.hasCollided = true;
    
    // Find player in scene
    const player = engine.currentScene.actors.find(
      (actor) => actor instanceof Player
    ) as Player | undefined;

    if (!player) return;

    // Check mask match
    if (player.currentMask === this.enemyType) {
      // Success! Player blocked with correct mask
      this.onSuccessfulBlock();
    } else {
      // Fail! Wrong mask or no mask
      this.onFailedBlock();
    }

    this.kill();
  }

  private onSuccessfulBlock(): void {
    StoreBridge.addScore(10);
    
    // Play success sound
    if (Sounds.glassCling.isLoaded()) {
      Sounds.glassCling.play(0.5);
    }
    
    // Spawn success effect
    this.spawnEffect('success');
  }

  private onFailedBlock(): void {
    StoreBridge.takeDamage(10);
    StoreBridge.resetCombo();
    StoreBridge.triggerShake();
    
    // Play fail sound
    if (Sounds.glassBreaking.isLoaded()) {
      Sounds.glassBreaking.play(0.5);
    }
    
    // Spawn fail effect
    this.spawnEffect('fail');
  }

  private spawnEffect(type: 'success' | 'fail'): void {
    const effect = new ex.Actor({
      x: this.pos.x,
      y: this.pos.y,
      anchor: ex.vec(0.5, 0.5),
    });

    // Use FX sprites
    const fxImage = type === 'success' ? Images.fxSuccess : Images.fxBrokenMask;
    
    if (fxImage && fxImage.isLoaded()) {
      const sprite = fxImage.toSprite();
      sprite.scale = ex.vec(0.5, 0.5);
      effect.graphics.use(sprite);
    } else {
      // Fallback to colored circle
      const color = type === 'success' 
        ? ex.Color.fromHex('#FFD700')
        : ex.Color.fromHex('#FF4444');
      const effectGraphic = new ex.Circle({
        radius: 30,
        color: color,
      });
      effect.graphics.use(effectGraphic);
    }
    
    effect.graphics.opacity = 0.8;

    // Add to scene
    this.scene?.add(effect);

    // Animate and remove
    effect.actions
      .scaleTo(ex.vec(1.5, 1.5), ex.vec(3, 3))
      .callMethod(() => {
        effect.graphics.opacity = 0;
      })
      .die();
  }
}
