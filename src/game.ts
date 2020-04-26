import 'phaser';
import config from './config';
import BootScene from './scenes/BootScene';
import WorldScene from './scenes/WorldScene';
import UIScene from './scenes/UIScene';
import ReactScene from './scenes/ReactScene';
import 'semantic-ui-css/semantic.min.css';

console.log('Starting Alkito World...');

new Phaser.Game(
  Object.assign(config, {
    scene: [
        BootScene,
        WorldScene,
        UIScene,
        ReactScene,
    ],
  })
);