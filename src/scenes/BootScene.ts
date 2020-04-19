import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // map tiles
    this.load.image('tiles', 'assets/map/tileset.png');
    this.load.spritesheet('plants', 'assets/items/plants.png', { frameWidth: 32, frameHeight: 64 });
    // map in json format
    this.load.tilemapTiledJSON('map', 'assets/map/world.json');
    // player
    this.load.spritesheet('tileset', 'assets/map/tileset.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player', 'assets/player-sprite.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('other-player', 'assets/other-player-sprite.png', { frameWidth: 32, frameHeight: 32 });
    // ui
    this.load.image('ui.hud', 'assets/ui/hud.png');
    this.load.image('ui.map', 'assets/ui/map.png');
    this.load.image('ui.inventory', 'assets/ui/inventory.png');
    this.load.image('ui.slot', 'assets/ui/slot.png');
    this.load.image('ui.slot-round', 'assets/ui/slot-round.png');
    this.load.image('ui.progress-bar', 'assets/ui/progress-bar.png');
    this.load.spritesheet('ui.bars', 'assets/ui/bars.png', { frameWidth: 10, frameHeight: 14 });
    this.load.spritesheet('icons', 'assets/icons.png', { frameWidth: 64, frameHeight: 64 });
    // items
    this.load.spritesheet('items/plants', 'assets/items/plants_items.png', { frameWidth: 32, frameHeight: 32 });
  }

  create() {
    this.scene.start('WorldScene');
  }
}