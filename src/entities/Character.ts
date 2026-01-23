import * as PIXI from 'pixi.js';

export class Character extends PIXI.AnimatedSprite {
  private readonly footOffsetY = -20;
  private isJumping = false;
  private idleTextures: PIXI.Texture[];
  private jumpTextures: PIXI.Texture[];

  constructor(app?: PIXI.Application) {
    const spritesheet = PIXI.Cache.get('imposterSheet') as PIXI.Spritesheet;

    // idle animation
    const idleTextures: PIXI.Texture[] = [];
    const idleFrameNames = ['imp_7.png', 'imp_8.png'];
    for (const frameName of idleFrameNames) {
      const texture = spritesheet.textures[frameName];
      if (texture) {
        idleTextures.push(texture);
      }
    }

    // jump animation
    const jumpTextures: PIXI.Texture[] = [];
    const jumpFrameNames = [
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

    for (const frameName of jumpFrameNames) {
      const texture = spritesheet.textures[frameName];
      if (texture) {
        jumpTextures.push(texture);
      }
    }

    // start idle animation
    super(idleTextures);
    this.idleTextures = idleTextures;
    this.jumpTextures = jumpTextures;
    this.anchor.set(0.5, 1);
    this.animationSpeed = 0.08;
    this.play();
  }

  setState(state: 'idle' | 'jump'): void {
    if (state === 'idle') {
      this.textures = this.idleTextures;
      this.animationSpeed = 0.08;
      this.loop = true;
    } else if (state === 'jump') {
      this.textures = this.jumpTextures;
      this.animationSpeed = 0.5;
      this.loop = true;
    }
    this.gotoAndPlay(0);
  }

  placeOn(surfaceY: number): void {
    this.y = surfaceY - this.footOffsetY * this.scale.y;
  }

  async jumpToSofa(fromX: number, fromY: number, toX: number, toY: number, duration: number = 1000): Promise<void> {
    if (this.isJumping) return;

    this.isJumping = true;

    this.setState('jump');

    // anchor center for jump
    this.anchor.set(0.5, 0.5);
    const halfHeight = this.height / 2;
    const startYAdjusted = fromY - halfHeight;
    const endYAdjusted = toY - halfHeight;

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

          this.setState('idle');
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
