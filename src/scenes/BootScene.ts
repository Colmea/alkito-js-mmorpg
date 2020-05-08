import 'phaser';

export default class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  preload() {
    // Map
    this.load.image('tiles', 'assets/map/tileset/tileset.png');
    this.load.image('tiles2', 'assets/map/tileset/tileset2_extruded.png');
    this.load.image('tileset_grass', 'assets/map/tileset/tileset_grass_extruded.png');
    this.load.tilemapTiledJSON('map', 'assets/map/world.json');

    // player
    this.load.spritesheet('tileset', 'assets/map/tileset/tileset.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('player', 'assets/player-sprite.png', { frameWidth: 32, frameHeight: 32 });
    this.load.spritesheet('other-player', 'assets/other-player-sprite.png', { frameWidth: 32, frameHeight: 32 });

    // ui
    this.load.image('ui.hud', 'assets/ui/hud.png');
    this.load.image('ui.map', 'assets/ui/map.png');
    this.load.image('ui.map-mask', 'assets/ui/map-mask.png');
    this.load.image('ui.minimap', 'assets/map/minimap.jpg');
    this.load.image('ui.menu', 'assets/ui/menu.png');
    this.load.image('ui.menu-button', 'assets/ui/menu-button.png');
    this.load.image('ui.menu-button-active', 'assets/ui/menu-button-active.png');
    this.load.image('ui.inventory', 'assets/ui/inventory.png');
    this.load.image('ui.slot', 'assets/ui/slot.png');
    this.load.image('ui.slot-round', 'assets/ui/slot-round.png');
    this.load.image('ui.progress-bar', 'assets/ui/progress-bar.png');
    this.load.image('ui.icon-skills', 'assets/ui/icon-skills.png');
    this.load.spritesheet('ui.bars', 'assets/ui/bars.png', { frameWidth: 10, frameHeight: 14 });
    this.load.spritesheet('icons', 'assets/icons.png', { frameWidth: 64, frameHeight: 64 });

    // Items
    this.load.spritesheet('items/plants', 'assets/items/plants_items.png', { frameWidth: 32, frameHeight: 32 });

    // Resources
    this.load.spritesheet('plants', 'assets/items/plants.png', { frameWidth: 32, frameHeight: 64 });
    this.load.spritesheet('resources.woodcutting', 'assets/items/resources-tree.png', { frameWidth: 96, frameHeight: 64 });
  }

  create() {
    this.scene.start('WorldScene');
  }
}