import * as PIXI from 'pixi.js';

export class Character extends PIXI.AnimatedSprite {
  private readonly footOffsetY = -20;
  private isJumping = false;
  private readonly jumpTicker?: PIXI.Ticker;

  constructor(app?: PIXI.Application) {
    const spritesheet = PIXI.Cache.get('imposterSheet') as PIXI.Spritesheet;

    const textures: PIXI.Texture[] = [];
    const frameNames = [
      'imp_0.png',
      'imp_1.png',
      'imp_2.png',
      'imp_3.png',
      'imp_4.png',
      'imp_5.png',
      'imp_6.png',
      'imp_7.png',
      'imp_8.png',
      'imp_9.png',
      'imp_10.png',
      'imp_11.png',
      'imp_12.png',
      'imp_13.png',
      'imp_14.png',
      'imp_15.png',
      'imp_16.png',
      'imp_17.png',
      'imp_18.png'
    ];

    for (const frameName of frameNames) {
      const texture = spritesheet.textures[frameName];
      if (texture) {
        textures.push(texture);
      }
    }

    super(textures);
    this.anchor.set(0.5, 1);
    this.animationSpeed = 0.3;
    this.play();

    if (app) {
      this.jumpTicker = app.ticker;
    }
  }

  placeOn(surfaceY: number): void {
    this.y = surfaceY - this.footOffsetY * this.scale.y;
  }

  async jumpToSofa(fromX: number, fromY: number, toX: number, toY: number, duration: number = 1000): Promise<void> {
    if (this.isJumping) return;

    this.isJumping = true;
    this.animationSpeed = 0.5; // increase speed for jump animation
    this.gotoAndPlay(0); // start roll

    const startTime = performance.now();

    return new Promise((resolve) => {
      const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const isComplete = this.updateJumpAnimation(progress, fromX, fromY, toX, toY);

        if (isComplete) {
          // stop timer
          PIXI.Ticker.shared.remove(animate);

          this.x = toX;
          this.y = toY;
          this.rotation = 0;
          this.animationSpeed = 0.3; // return to normal speed
          this.gotoAndStop(0); // stop roll
          this.isJumping = false;

          resolve();
        }
      };

      PIXI.Ticker.shared.add(animate);
    });
  }

  private updateJumpAnimation(progress: number, startX: number, startY: number, endX: number, endY: number): boolean {
    const easeProgress = this.easeInOutQuad(progress);

    this.x = startX + (endX - startX) * easeProgress;

    // calculate jump height and Y-offset
    const jumpHeight = 150 * this.scale.y;
    const yOffset = Math.sin(progress * Math.PI) * jumpHeight;
    this.y = startY + (endY - startY) * easeProgress - yOffset;

    // calculate rotation (360-degree flip)
    this.rotation = progress * Math.PI * 2;

    return progress >= 1;
  }

  private easeInOutQuad(t: number): number {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }
}
