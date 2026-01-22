import * as PIXI from 'pixi.js';

export class Shelf extends PIXI.Sprite {
  constructor() {
    super(PIXI.Assets.get('shelf'));
    this.anchor.set(0.5, 0);
  }
}
