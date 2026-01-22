import { sdk } from '@smoud/playable-sdk';
import * as PIXI from 'pixi.js';
// Using assets/* alias configured in tsconfig.json for direct assets import
import charAsset from 'assets/character.png';
import shelfAsset from 'assets/shelf.png';
import sofaAsset from 'assets/chair.png';
import bgSegment from 'assets/BG_seg.png';

export class Game {
  private app: PIXI.Application;
  private background: PIXI.TilingSprite;
  private character: PIXI.Sprite;
  private shelf: PIXI.Sprite;
  private sofa: PIXI.Sprite;
  private interactionCount: number = 0;

  constructor(width: number, height: number) {
    // Create PIXI application
    this.app = new PIXI.Application();

    this.app
      .init({
        width,
        height,
        backgroundColor: 0x87CEEB,
        resolution: 1.5,
        autoDensity: true
      })
      .then(() => {
        document.body.appendChild(this.app.canvas);

        // Load textures and create game
        const assets = [
          { alias: 'bgTexture', src: bgSegment },
          { alias: 'char', src: charAsset },
          { alias: 'shelf', src: shelfAsset },
          { alias: 'sofa', src: sofaAsset }
        ];

        PIXI.Assets.load(assets).then(() => {
          this.create();
        });
      });
  }

  public create(): void {
    const bgTexture = PIXI.Assets.get('bgTexture');
    bgTexture.source.addressModeX = 'repeat';
    bgTexture.source.addressModeY = 'clamp';
    this.background = new PIXI.TilingSprite({
      texture: bgTexture,
      width: this.app.screen.width,
      height: bgTexture.height,
    });
    this.background.anchor.set(0, 1);
    this.app.stage.addChildAt(this.background, 0);

    // 1. shelf
    this.shelf = new PIXI.Sprite(PIXI.Assets.get('shelf'));
    this.shelf.anchor.set(0.5, 1);
    this.app.stage.addChild(this.shelf);


    // 2. sofa
    this.sofa = new PIXI.Sprite(PIXI.Assets.get('sofa'));
    this.sofa.anchor.set(0.5, 1);
    this.app.stage.addChild(this.sofa);


    // 3. character
    this.character = new PIXI.Sprite(PIXI.Assets.get('char'));
    this.character.anchor.set(0.5, 1);
    this.app.stage.addChild(this.character);


    this.resize(this.app.screen.width, this.app.screen.height);


    // 4. global click
    this.app.stage.eventMode = 'static';
    this.app.stage.hitArea = this.app.screen; // Кликабельная вся область

    this.app.stage.on('pointerdown', () => this.handleGlobalClick());

    // Set up interaction listener
    sdk.on('interaction', (count: number) => {
      console.log(`Interaction count: ${count}`);

      if (sdk.interactions >= 10) {
        sdk.finish();
      }
    });

    sdk.start();
  }

  private handleGlobalClick(): void {
    if (this.interactionCount === 0) {
      // TODO add jump animation here
      this.character.x = this.sofa.x;
      this.character.y = this.sofa.y;
    } else {
      sdk.install();
    }
    this.interactionCount++;
  }

  public resize(width: number, height: number): void {
    this.app.renderer.resize(width, height);
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);

    if (this.background) {
      this.background.width = width;
      this.background.height = height;
      this.background.y = height;

      const bgScale = height / this.background.texture.source.height;
      this.background.tileScale.set(bgScale);

      this.background.tilePosition.y = 0;
    }

    // update click area
    this.app.stage.hitArea = new PIXI.Rectangle(0, 0, width, height);

    if (this.character && this.shelf && this.sofa) {
      this.shelf.x = width * 0.25;
      this.shelf.y = height * 0.45;

      this.sofa.x = width * 0.75;
      this.sofa.y = height * 0.8;

      // before jump
      if (this.interactionCount === 0) {
        this.character.x = this.shelf.x;
        this.character.y = this.shelf.y;
      } else {
        // after jump
        this.character.x = this.sofa.x;
        this.character.y = this.sofa.y;
      }

      const scale = Math.min(width / 400, height / 600) * 0.5;
      this.character.scale.set(scale);
      this.shelf.scale.set(scale);
      this.sofa.scale.set(scale);
    }
  }

  public pause(): void {
    console.log('Game paused');
  }

  public resume(): void {
    console.log('Game resumed');
  }

  public volume(value: number): void {
    console.log(`Volume changed to: ${value}`);
  }

  public finish(): void {
    console.log('Game finished');
  }
}
