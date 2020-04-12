import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // map tiles
    this.load.image('tiles', 'assets/map/tileset.png');
    this.load.image('ui.slot', 'assets/ui/slot.png');
    this.load.image('ui.slot-round', 'assets/ui/slot-round.png');
    this.load.spritesheet('plants', 'assets/items/plants.png', { frameWidth: 32, frameHeight: 64 });
    // map in json format
    this.load.tilemapTiledJSON('map', 'assets/map/world.json');
    // player
    this.load.spritesheet('tileset', 'assets/map/tileset.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player', 'assets/player-sprite.png', { frameWidth: 32, frameHeight: 32 });
    // ui
    this.load.spritesheet('icons', 'assets/icons.png', { frameWidth: 64, frameHeight: 64 });
    // items
    this.load.spritesheet('items/plants', 'assets/items/plants_items.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.scene.start('WorldScene');
  }
}