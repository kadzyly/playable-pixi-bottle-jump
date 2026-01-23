import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { Shelf } from '../entities/Shelf';
import { Sofa } from '../entities/Sofa';
import { Dust } from '../entities/Dust';

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

  public resize(width: number, height: number): void {
    if (!this.background) return;

    // background
    const bgScale = height / this.background.texture.height;
    this.background.scale.set(bgScale);
    this.background.width = width / bgScale;
    this.background.position.set(0, height);

    // floor
    const floorHeightOnBackgroundImage = 367;
    const floorY = height - floorHeightOnBackgroundImage * bgScale;

    // offsets
    const shelfOffset = 350 * bgScale;
    const sofaOffset = 200 * bgScale;

    // calculate scale
    const entityScale = Math.min(width / 400, height / 600) * 0.5;

    // scale
    this.character.scale.set(entityScale);
    this.shelf.scale.set(entityScale);
    this.sofa.scale.set(entityScale);

    this.shelf.x = width * 0.25;
    this.shelf.placeOn(floorY - shelfOffset);

    this.sofa.x = width * 0.7;
    this.sofa.placeOn(floorY - sofaOffset);

    // character position
    if (this.interactionCount === 0) {
      this.character.x = this.shelf.x;
      this.character.placeOn(this.shelf.y);
    } else {
      this.character.x = this.sofa.x;
      this.character.placeOn(this.sofa.y);
    }
  }

  private createBackground(): void {
    const texture = PIXI.Assets.get('bg');
    texture.source.addressModeX = 'repeat';

    this.background = new PIXI.TilingSprite({
      texture,
      width: 1,
      height: texture.height
    });

    // position: left bottom
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

  private spawnDustUnderCharacter(x: number, y: number): void {
    const dust = new Dust();
    const scale = this.character.scale.x;
    const offsetY = 10;
    const finalY = y + offsetY;

    const characterIndex = this.app.stage.getChildIndex(this.character);
    this.app.stage.addChildAt(dust, Math.max(0, characterIndex));

    dust.playAt(x, finalY, scale);
  }

  private onClick(): void {
    if (this.interactionCount === 0) {
      // find coordinates for character to jump from shelf to sofa
      const toX = this.sofa.x;

      // find the Y position before jump
      const tempY = this.character.y;
      this.character.placeOn(this.sofa.y);
      const toY = this.character.y;
      this.character.y = tempY;

      void this.character.jumpTo(toX, toY).then(() => {
        this.spawnDustUnderCharacter(this.character.x, this.character.getFootY());
      });
    } else {
      sdk.install();
    }

    this.interactionCount++;
  }
}
