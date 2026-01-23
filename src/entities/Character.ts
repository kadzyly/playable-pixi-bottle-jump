import * as PIXI from 'pixi.js';
import { JumpAnimator, JumpConfig } from './JumpAnimator';
import { CHARACTER_ANIMATIONS } from './CharacterConfig';

type CharacterState = keyof typeof CHARACTER_ANIMATIONS;

export class Character extends PIXI.AnimatedSprite {
  private readonly footOffsetY = 20;
  private isJumping = false;
  private textureCache: Record<string, PIXI.Texture[]> = {};

  constructor() {
    const sheet = PIXI.Cache.get('imposterSheet') as PIXI.Spritesheet;

    // init with a default texture first
    super([PIXI.Texture.EMPTY]);

    (Object.keys(CHARACTER_ANIMATIONS) as CharacterState[]).forEach((state) => {
      this.textureCache[state] = CHARACTER_ANIMATIONS[state].frames.map((frame) => sheet.textures[frame]).filter(Boolean);
    });

    // update textures after init
    this.textures = this.textureCache['idle'];
    this.anchor.set(0.5, 1);
    this.setState('idle');
  }

  public getFootY(): number {
    return this.y + this.footOffsetY * this.scale.y;
  }

  public setState(state: CharacterState): void {
    const config = CHARACTER_ANIMATIONS[state];
    this.textures = this.textureCache[state];
    this.animationSpeed = config.speed;
    this.loop = config.loop;
    this.gotoAndPlay(0);
  }

  placeOn(surfaceY: number): void {
    this.y = surfaceY + this.footOffsetY * this.scale.y;
  }

  public async jumpTo(targetX: number, targetY: number, duration: number = 1000): Promise<void> {
    if (this.isJumping) return;
    this.isJumping = true;

    // anchor: change to center for the jump
    const startX = this.x;
    const startY = this.y;
    this.anchor.set(0.5, 0.5);

    const yOffset = this.height / 2;
    this.setState('jump');

    const config: JumpConfig = {
      from: { x: startX, y: startY - yOffset },
      to: { x: targetX, y: targetY - yOffset },
      duration,
      jumpHeight: 150 * Math.abs(this.scale.y)
    };

    return new Promise((resolve) => {
      const startTime = performance.now();

      const update = () => {
        const elapsed = performance.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const { x, y, rotation } = JumpAnimator.getTransform(progress, config);

        this.x = x;
        this.y = y;
        this.rotation = rotation;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          this.onJumpComplete(targetX, targetY);
          resolve();
        }
      };

      update();
    });
  }

  private onJumpComplete(finalX: number, finalY: number): void {
    this.isJumping = false;
    this.rotation = 0;
    // anchor: return to bottom
    this.anchor.set(0.5, 1);
    this.x = finalX;
    this.y = finalY;
    this.setState('idle');
  }
}
