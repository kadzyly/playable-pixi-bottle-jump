import * as PIXI from 'pixi.js';
import { sdk } from '@smoud/playable-sdk';
import { Character } from '../entities/Character';
import { Shelf } from '../entities/Shelf';
import { Sofa } from '../entities/Sofa';
import { Dust } from '../entities/Dust';

export class MainScene {
  private floorBg: PIXI.TilingSprite;
  private wallBg: PIXI.TilingSprite;
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
    if (!this.floorBg || !this.wallBg) return;

    const floorTexture = this.floorBg.texture;
    const wallTexture = this.wallBg.texture;

    const totalTextureHeight = floorTexture.height + wallTexture.height;
    const bgScale = height / totalTextureHeight;

    this.floorBg.scale.set(bgScale);
    this.wallBg.scale.set(bgScale);

    const wallHeight = wallTexture.height * bgScale;
    const floorHeight = floorTexture.height * bgScale;

    this.floorBg.width = width / bgScale;
    this.floorBg.position.set(0, height);

    this.wallBg.width = width / bgScale;
    this.wallBg.position.set(0, height - floorHeight);

    const entityScale = Math.min(width / 400, height / 600) * 0.5;

    // position between wall and floor
    const floorY = height - floorHeight;

    this.character.scale.set(entityScale);
    this.shelf.scale.set(entityScale);
    this.sofa.scale.set(entityScale);

    // place on center of the wall
    this.shelf.x = width * 0.25;
    this.shelf.placeOn(wallHeight / 2);

    // place sofa on top of the floor
    const sofaHeight = this.sofa.height;
    const sofaTargetY = floorY + sofaHeight * 0.3;

    this.sofa.x = width * 0.7;
    this.sofa.placeOn(sofaTargetY);

    if (this.interactionCount === 0) {
      this.character.x = this.shelf.x;
      this.character.placeOn(this.shelf.y);
    } else {
      const sofaTopY = sofaTargetY - this.sofa.height;
      this.character.x = this.sofa.x;
      this.character.placeOn(sofaTopY);
    }
  }

  private createBackground(): void {
    const floorTexture = PIXI.Assets.get('bgFloor');
    const wallTexture = PIXI.Assets.get('bgWall');

    floorTexture.source.addressModeX = 'repeat';
    wallTexture.source.addressModeX = 'repeat';

    this.floorBg = new PIXI.TilingSprite({
      texture: floorTexture,
      width: 1,
      height: floorTexture.height
    });

    this.wallBg = new PIXI.TilingSprite({
      texture: wallTexture,
      width: 1,
      height: wallTexture.height
    });

    this.floorBg.anchor.set(0, 1);
    this.wallBg.anchor.set(0, 1);

    this.app.stage.addChild(this.wallBg, this.floorBg);
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
      const toY = this.sofa.y - this.sofa.height;

      // find the Y position before jump
      const tempY = this.character.y;
      this.character.placeOn(toY);
      this.character.y = tempY;

      void this.character.jumpTo(toX, toY).then(() => {
        this.spawnDustUnderCharacter(this.character.x, this.character.footY);
      });
    } else {
      sdk.install();
    }

    this.interactionCount++;
  }
}
