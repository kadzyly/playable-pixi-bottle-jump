import * as PIXI from 'pixi.js';

import charAsset from 'assets/character.png';
import shelfAsset from 'assets/shelf.png';
import sofaAsset from 'assets/chair.png';
import bgSegment from 'assets/BG_seg.png';

export async function loadAssets(): Promise<void> {
  await PIXI.Assets.load([
    { alias: 'bg', src: bgSegment },
    { alias: 'char', src: charAsset },
    { alias: 'shelf', src: shelfAsset },
    { alias: 'sofa', src: sofaAsset }
  ]);
}
