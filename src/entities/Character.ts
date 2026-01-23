import * as PIXI from 'pixi.js';

export class Character extends PIXI.AnimatedSprite {
  private readonly footOffsetY = -20;
  private isJumping = false;

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
  }

  placeOn(surfaceY: number): void {
    this.y = surfaceY - this.footOffsetY * this.scale.y;
  }

  async jumpToSofa(fromX: number, fromY: number, toX: number, toY: number, duration: number = 1000): Promise<void> {
    if (this.isJumping) return;

    this.isJumping = true;

    // anchor center for jump
    this.anchor.set(0.5, 0.5);
    const halfHeight = this.height / 2;
    const startYAdjusted = fromY - halfHeight;
    const endYAdjusted = toY - halfHeight;

    this.animationSpeed = 0.5;
    this.play();

    const startTime = performance.now();

    return new Promise((resolve) => {
      const animate = () => {
        const now = performance.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const isComplete = this.updateJumpAnimation(progress, fromX, startYAdjusted, toX, endYAdjusted);

        if (isComplete) {
          PIXI.Ticker.shared.remove(animate);

          // anchor bottom (start position)
          this.anchor.set(0.5, 1);
          this.x = toX;
          this.y = toY;
          this.rotation = 0;
          this.animationSpeed = 0.3;
          this.gotoAndStop(0);
          this.isJumping = false;

          resolve();
        }
      };

      PIXI.Ticker.shared.add(animate);
    });
  }

  private updateJumpAnimation(progress: number, startX: number, startY: number, endX: number, endY: number): boolean {
    const t = progress;

    const currentLineX = startX + (endX - startX) * t;
    const currentLineY = startY + (endY - startY) * t;

    const jumpHeight = 150 * Math.abs(this.scale.y);
    const arc = Math.sin(t * Math.PI) * jumpHeight;

    this.x = currentLineX;
    this.y = currentLineY - arc;

    const direction = endX > startX ? 1 : -1;
    this.rotation = t * Math.PI * 2 * direction;

    return progress >= 1;
  }
}
