import * as ex from 'excalibur';
import { MaskType } from '@/store/initialState';
import { ENEMY_SIZE, MASK_HEX_COLORS, ZONE_CIRCLE_RADIUS } from '@/game/constants';
import { Player } from '@/game/actors/Player';
import * as StoreBridge from '@/game/storeBridge';

export class Enemy extends ex.Actor {
  public enemyType: MaskType;
  private speed: number;
  private targetX: number;
  private targetY: number;
  private hasCollided: boolean = false;

  constructor(
    x: number,
    y: number,
    type: MaskType,
    speed: number,
    targetX: number,
    targetY: number
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
  }

  onInitialize(): void {
    // Draw enemy with type color
    const color = ex.Color.fromHex(MASK_HEX_COLORS[this.enemyType]);
    
    const enemyGraphic = new ex.Circle({
      radius: ENEMY_SIZE / 2,
      color: color,
      strokeColor: ex.Color.White,
      lineWidth: 2,
    });
    this.graphics.use(enemyGraphic);

    // Calculate direction to target
    const direction = ex.vec(this.targetX - this.pos.x, this.targetY - this.pos.y).normalize();
    this.vel = direction.scale(this.speed);

    // Add slight rotation for visual effect
    this.angularVelocity = 2;
  }

  onPreUpdate(engine: ex.Engine, delta: number): void {
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
    
    // Spawn success effect (sparkle)
    this.spawnEffect('success');
  }

  private onFailedBlock(): void {
    StoreBridge.takeDamage(10);
    StoreBridge.resetCombo();
    StoreBridge.triggerShake();
    
    // Spawn fail effect (crack)
    this.spawnEffect('fail');
  }

  private spawnEffect(type: 'success' | 'fail'): void {
    // Create visual feedback effect
    const effect = new ex.Actor({
      x: this.pos.x,
      y: this.pos.y,
      width: 60,
      height: 60,
    });

    const color = type === 'success' 
      ? ex.Color.fromHex('#FFD700') // Gold
      : ex.Color.fromHex('#FF4444'); // Red

    const effectGraphic = new ex.Circle({
      radius: 30,
      color: color,
    });
    effect.graphics.use(effectGraphic);
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
