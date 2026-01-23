import * as PIXI from 'pixi.js';

import charAsset from 'assets/character.png';
import shelfAsset from 'assets/shelf.png';
import sofaAsset from 'assets/chair.png';
import bgSegment from 'assets/BG_seg.png';

import { imposterData } from '../data/imposterData';
import imposterImage from 'assets/imposter/imposter.png';

import { dustData } from '../data/dustData';
import dustImage from 'assets/dust/dust.png';

export async function loadAssets(): Promise<void> {
  await PIXI.Assets.load([
    { alias: 'bg', src: bgSegment },
    { alias: 'char', src: charAsset },
    { alias: 'shelf', src: shelfAsset },
    { alias: 'sofa', src: sofaAsset },
    { alias: 'imposterTexture', src: imposterImage },
    { alias: 'dustTexture', src: dustImage }
  ]);

  const imposterTexture = PIXI.Assets.get('imposterTexture');
  const imposterSheet = new PIXI.Spritesheet(imposterTexture, imposterData);
  await imposterSheet.parse();
  PIXI.Cache.set('imposterSheet', imposterSheet);

  const dustTexture = PIXI.Assets.get('dustTexture');
  const dustSheet = new PIXI.Spritesheet(dustTexture, dustData);
  await dustSheet.parse();
  PIXI.Cache.set('dustSheet', dustSheet);
}

