import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // map tiles
    this.load.image('tiles', 'assets/map/tileset.png');
    // map in json format
    this.load.tilemapTiledJSON('map', 'assets/map/world.json');
    // player
    this.load.spritesheet('tileset', 'assets/map/tileset.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player', 'assets/player-sprite.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('icons', 'assets/icons.png', { frameWidth: 64, frameHeight: 64 });
  }

  create() {
    this.scene.start('WorldScene');
  }
}