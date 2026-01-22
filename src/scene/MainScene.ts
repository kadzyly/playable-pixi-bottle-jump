import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { Shelf } from '../entities/Shelf';
import { Sofa } from '../entities/Sofa';

export class MainScene {
  private background: PIXI.TilingSprite;
  private character: Character;
  private shelf: Shelf;
  private sofa: Sofa;
  private interactionCount = 0;

  constructor(private app: PIXI.Application) {
    this.createBackground();
    this.createEntities();
    this.setupInteraction();
  }

  private createBackground(): void {
    const texture = PIXI.Assets.get('bg');
    texture.source.addressModeX = 'repeat';

    this.background = new PIXI.TilingSprite({
      texture,
      width: 1,
      height: texture.height
    });

    this.background.anchor.set(0, 1);
    this.app.stage.addChild(this.background);
  }

  private createEntities(): void {
    this.shelf = new Shelf();
    this.sofa = new Sofa();
    this.character = new Character();

    this.app.stage.addChild(this.shelf, this.sofa, this.character);
  }

  private setupInteraction(): void {
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen;

    this.app.stage.on('pointerdown', () => this.onClick());

    sdk.start();
  }

  private onClick(): void {
    if (this.interactionCount === 0) {
      this.character.position.copyFrom(this.sofa.position);
    } else {
      sdk.install();
    }

    this.interactionCount++;
  }

  public resize(width: number, height: number): void {
    if (!this.background) return;

    this.background.width = width;
    this.background.y = height;

    const scale = Math.min(width / 400, height / 600) * 0.5;

    this.shelf.position.set(width * 0.25, height * 0.45);
    this.sofa.position.set(width * 0.75, height * 0.8);

    if (this.interactionCount === 0) {
      this.character.position.copyFrom(this.shelf.position);
    } else {
      this.character.position.copyFrom(this.sofa.position);
    }

    this.character.scale.set(scale);
    this.shelf.scale.set(scale);
    this.sofa.scale.set(scale);
  }
}
