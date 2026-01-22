import * as PIXI from 'pixi.js';

export class Character extends PIXI.Sprite {
  constructor() {
    super(PIXI.Assets.get('char'));
    this.anchor.set(0.5, 1);
  }
}
