import 'phaser';
import config from './config';
import BootScene from './scenes/Boot';
import GameScene from './scenes/Game';

console.log('Starting Alkito World...');

new Phaser.Game(
  Object.assign(config, {
    scene: [
        BootScene,
        GameScene,
    ],
  })
);