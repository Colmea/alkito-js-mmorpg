import 'phaser';
import config from './config';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';
import UIScene from './scenes/UIScene';

console.log('Starting Alkito World...');

new Phaser.Game(
  Object.assign(config, {
    scene: [
        BootScene,
        WorldScene,
        UIScene,
    ],
  })
);