import * as ex from 'excalibur';
import { MaskType } from '@/store/initialState';
import { PLAYER_SIZE, ZONE_CIRCLE_RADIUS, MASK_HEX_COLORS } from '@/game/constants';
import * as StoreBridge from '@/game/storeBridge';

export class Player extends ex.Actor {
  public currentMask: MaskType = 'NEUTRAL';
  private zoneCircle: ex.Actor;
  private maskSprite: ex.Actor;

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
      y: -10,
      width: PLAYER_SIZE * 0.6,
      height: PLAYER_SIZE * 0.4,
    });
  }

  onInitialize(engine: ex.Engine): void {
    // Draw player body (simple circle representation)
    const playerGraphic = new ex.Circle({
      radius: PLAYER_SIZE / 2,
      color: ex.Color.fromHex('#e0e0e0'),
      strokeColor: ex.Color.fromHex('#ffffff'),
      lineWidth: 2,
    });
    this.graphics.use(playerGraphic);

    // Draw zone circle
    const zoneGraphic = new ex.Circle({
      radius: ZONE_CIRCLE_RADIUS,
      color: ex.Color.Transparent,
      strokeColor: ex.Color.fromHex('#ffffff33'),
      lineWidth: 2,
    });
    this.zoneCircle.graphics.use(zoneGraphic);
    this.addChild(this.zoneCircle);

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
    
    // Update player glow color
    const playerGraphic = new ex.Circle({
      radius: PLAYER_SIZE / 2,
      color: ex.Color.fromHex('#1a1a2e'),
      strokeColor: color,
      lineWidth: 4,
    });
    this.graphics.use(playerGraphic);

    // Update zone circle color
    const zoneColor = color.clone();
    zoneColor.a = 0.3;
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
