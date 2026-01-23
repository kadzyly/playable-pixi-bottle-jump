import * as PIXI from 'pixi.js';

export class Dust extends PIXI.AnimatedSprite {
  constructor() {
    const sheet = PIXI.Cache.get('dustSheet') as PIXI.Spritesheet;

    const textures = Array.from({ length: 26 }, (_, i) => sheet.textures[`dust_${i}.png`]).filter(
      Boolean
    ) as PIXI.Texture[];

    super(textures);

    this.anchor.set(0.5, 1);
    this.animationSpeed = 0.4;
    this.loop = false;

    this.onComplete = () => {
      this.parent?.removeChild(this);
      this.destroy();
    };
  }

  public playAt(x: number, y: number, scale: number): void {
    this.position.set(x, y);
    this.scale.set(scale);
    this.gotoAndPlay(0);
  }
}


