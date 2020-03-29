import 'phaser';

export default class Boot extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // map tiles
    this.load.image('tiles', 'assets/map/tileset.png');
    // map in json format
    this.load.tilemapTiledJSON('map', 'assets/map/world.json');
    // player
    this.load.spritesheet('player', 'assets/player-sprite.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('enemy-1', 'assets/pnj/ennemies/enemy-001.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.scene.start('GameScene');
  }
}