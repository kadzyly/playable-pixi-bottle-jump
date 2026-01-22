import * as PIXI from 'pixi.js';

export async function createApp(
  width: number,
  height: number
): Promise<PIXI.Application> {
  const app = new PIXI.Application();

  await app.init({
    width,
    height,
    backgroundColor: 0x87ceeb,
    resolution: 1.5,
    autoDensity: true
  });

  document.body.appendChild(app.canvas);

  return app;
}
