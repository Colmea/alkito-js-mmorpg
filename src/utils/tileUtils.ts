import * as CONFIG from '../gameConfig';

export function getTilePosition(xIndex: number, yIndex: number) {
  return {
    x: xIndex * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
    y: yIndex * CONFIG.TILE_SIZE + CONFIG.TILE_SIZE / 2,
  };
}