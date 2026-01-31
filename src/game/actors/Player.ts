import * as ex from 'excalibur';
import { MaskType } from '@/store/initialState';
import { PLAYER_SIZE, ZONE_CIRCLE_RADIUS, MASK_HEX_COLORS } from '@/game/constants';
import * as StoreBridge from '@/game/storeBridge';
import { Images } from '@/game/resources';

export class Player extends ex.Actor {
  public currentMask: MaskType = 'NEUTRAL';
  private zoneCircle: ex.Actor;
  private maskSprite: ex.Actor;
  private playerSprite: ex.Sprite | null = null;

  constructor(x: number, y: number) {
    super({
      x,
      y,
      width: PLAYER_SIZE,
      height: PLAYER_SIZE,
      anchor: ex.vec(0.5, 0.5),
      collisionType: ex.CollisionType.Passive,
      collisionGroup: ex.CollisionGroup.collidesWith([]),
    });

    // Create zone circle (collision detection area)
    this.zoneCircle = new ex.Actor({
      x: 0,
      y: 0,
      radius: ZONE_CIRCLE_RADIUS,
      collisionType: ex.CollisionType.Passive,
    });

    // Create mask sprite overlay
    this.maskSprite = new ex.Actor({
      x: 0,
      y: -20,
      anchor: ex.vec(0.5, 0.5),
    });
  }

  onInitialize(engine: ex.Engine): void {
    // Use player sprite (man-02 for gameplay, man-01 is for game over)
    if (Images.player2.isLoaded()) {
      this.playerSprite = Images.player2.toSprite();
      this.playerSprite.scale = ex.vec(PLAYER_SIZE / this.playerSprite.width * 1.5, PLAYER_SIZE / this.playerSprite.height * 1.5);
      this.graphics.use(this.playerSprite);
    } else {
      // Fallback to circle if image not loaded
      const playerGraphic = new ex.Circle({
        radius: PLAYER_SIZE / 2,
        color: ex.Color.fromHex('#e0e0e0'),
        strokeColor: ex.Color.fromHex('#ffffff'),
        lineWidth: 2,
      });
      this.graphics.use(playerGraphic);
    }

    // Draw zone circle
    const zoneGraphic = new ex.Circle({
      radius: ZONE_CIRCLE_RADIUS,
      color: ex.Color.Transparent,
      strokeColor: ex.Color.fromHex('#ffffff33'),
      lineWidth: 2,
    });
    this.zoneCircle.graphics.use(zoneGraphic);
    this.addChild(this.zoneCircle);

    // Add mask sprite as child
    this.addChild(this.maskSprite);

    // Setup keyboard input
    this.setupInput(engine);
  }

  private setupInput(engine: ex.Engine): void {
    // Hold-based mask switching
    engine.input.keyboard.on('hold', (evt) => {
      switch (evt.key) {
        case ex.Keys.Q:
          this.setMask('WORK');
          break;
        case ex.Keys.W:
          this.setMask('FAMILY');
          break;
        case ex.Keys.E:
          this.setMask('SOCIAL');
          break;
      }
    });

    // Release to go back to neutral
    engine.input.keyboard.on('release', (evt) => {
      if (evt.key === ex.Keys.Q || evt.key === ex.Keys.W || evt.key === ex.Keys.E) {
        this.setMask('NEUTRAL');
      }
    });
  }

  public setMask(mask: MaskType): void {
    if (this.currentMask === mask) return;
    
    this.currentMask = mask;
    StoreBridge.setMask(mask);
    
    // Update visual
    this.updateMaskVisual();
  }

  private updateMaskVisual(): void {
    const color = ex.Color.fromHex(MASK_HEX_COLORS[this.currentMask]);

    // Update mask sprite based on current mask
    let maskImage: ex.ImageSource | null = null;
    switch (this.currentMask) {
      case 'WORK':
        maskImage = Images.maskWork;
        break;
      case 'FAMILY':
        maskImage = Images.maskFamily;
        break;
      case 'SOCIAL':
        maskImage = Images.maskSocial;
        break;
      default:
        maskImage = null;
    }

    if (maskImage && maskImage.isLoaded()) {
      const maskSprite = maskImage.toSprite();
      maskSprite.scale = ex.vec(0.5, 0.5);
      this.maskSprite.graphics.use(maskSprite);
      this.maskSprite.graphics.opacity = 1;
    } else {
      this.maskSprite.graphics.opacity = 0;
    }

    // Update zone circle color
    const zoneGraphic = new ex.Circle({
      radius: ZONE_CIRCLE_RADIUS,
      color: ex.Color.Transparent,
      strokeColor: color,
      lineWidth: 3,
    });
    this.zoneCircle.graphics.use(zoneGraphic);
  }

  public getZoneRadius(): number {
    return ZONE_CIRCLE_RADIUS;
  }
}
