import * as PIXI from 'pixi.js';
import { createApp } from './core/App';
import { loadAssets } from './core/Assets';
import { MainScene } from './scene/MainScene';

export class Game {
  private app!: PIXI.Application;
  private scene!: MainScene;

  constructor(width: number, height: number) {
    void this.init(width, height);
  }

  private async init(width: number, height: number): Promise<void> {
    this.app = await createApp(width, height);
    await loadAssets();

    this.scene = new MainScene(this.app);
    this.resize(width, height);
  }

  public resize(width: number, height: number): void {
    if (!this.app || !this.scene) return;

    this.app.renderer.resize(width, height);
    this.scene.resize(width, height);
  }
}
