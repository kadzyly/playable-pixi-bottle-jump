import * as PIXI from 'pixi.js';

export class Sofa extends PIXI.Sprite {
  constructor() {
    super(PIXI.Assets.get('sofa'));
    this.anchor.set(0.5, 0);
  }
}
