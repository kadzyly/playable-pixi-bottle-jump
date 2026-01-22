import * as PIXI from 'pixi.js';

export class Character extends PIXI.Sprite {
  private readonly footOffsetY = -12;

  constructor() {
    super(PIXI.Assets.get('char'));
    this.anchor.set(0.5, 1);
  }

  placeOn(surfaceY: number): void {
    this.y = surfaceY - this.footOffsetY * this.scale.y;
  }
}
