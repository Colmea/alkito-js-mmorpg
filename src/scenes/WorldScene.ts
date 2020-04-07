import 'phaser';
import Player from '../models/Player';
import Item from '../models/Item';
import Unit from '../models/Unit';
import EventDispatcher from '../EventDispatcher';

type ArcadeSprite = Phaser.Physics.Arcade.Sprite;
type MapLayer = Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer;

export default class WorldScene extends Phaser.Scene {
  TILE_SIZE: number = 32;

  emitter: EventDispatcher;
  navMeshPlugin: any;
  navMesh: any;
  marker: Phaser.GameObjects.Graphics;
  map: Phaser.Tilemaps.Tilemap;
  mapLayers: { [key: string]: MapLayer } = {};

  player: Player;
  currentSelection: Unit | null;

  constructor() {
    super('WorldScene');

    this.emitter = EventDispatcher.getInstance();
  }

  create() {
    this._createMap();
    this._createAnims();

    // Player
    this.player = new Player(this, 11, 8, this.navMesh);
    // Objects
    const object001 = new Item(this, 12, 10, this.navMesh);

    // Camera follow player
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    this._createEvents();
  }

  private _createMap() {
    this.map = this.make.tilemap({ key: 'map' });

    const tiles = this.map.addTilesetImage('tileset', 'tiles');

    this.mapLayers['grass'] = this.map.createStaticLayer('Grass', tiles, 0, 0);
    this.mapLayers['objects'] = this.map.createStaticLayer('Objects', tiles, 0, 0);
    this.mapLayers['objects'].setCollisionByExclusion([-1]);
    this.mapLayers['decorations'] = this.map.createStaticLayer('Decorations', tiles, 0, 0);
    this.mapLayers['ui'] = this.map.createBlankDynamicLayer('UI', tiles);

    const obstaclesLayer = this.map.getObjectLayer("Obstacles");
    this.navMesh = this.navMeshPlugin.buildMeshFromTiled(
      "mesh",
      obstaclesLayer,
    );

    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;

    // Tile marker
    // Create a simple graphic that can be used to show which tile the mouse is over
    const markerWidth = 4;
    this.marker = this.add.graphics();
    this.marker.lineStyle(markerWidth, 0xffffff, .3);
    this.marker.strokeRect(-markerWidth / 2, -markerWidth / 2, this.map.tileWidth + markerWidth, this.map.tileHeight + markerWidth);

    // DEBUG NAVMESH
    //
    // this.navMesh.enableDebug();
    // this.navMesh.debugDrawMesh({
    //   drawCentroid: true,
    //   drawBounds: false,
    //   drawNeighbors: true,
    //   drawPortals: true
    // });
  }

  private _createAnims() {
    // Player animation (used mainly in the Player class when moving)
    // Need refactoring
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 3, 4, 5] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [7, 6, 7, 8] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [10, 9, 10, 11] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 0, 1, 2] }),
      frameRate: 10,
      repeat: -1
    });
  }

  private _createEvents() {
    // On map click
    this.input.on('pointerdown', this.onMapClick);
    // On unit.created event
    this.emitter.on('unit.goTo', (unit: Unit, tile: Phaser.Tilemaps.Tile) => {
      unit.goTo(tile);
    });
    this.emitter.on('unit.select', (unit: Unit, flag: boolean = true) => {
      if (this.currentSelection) {
        this.currentSelection.select(false);
      }

      if (flag) 
        this.currentSelection = unit;
      else
        this.currentSelection = null;

      unit.select(flag);
    });
  }

  onMapClick = (pointer: Phaser.Input.Pointer) => {
    // If something is selected, unselected
    if (this.currentSelection) {
      this.emitter.emit('unit.select', null);
      return;
    }

    const end = new Phaser.Math.Vector2(pointer.x, pointer.y);
    // Find corresponding tile from click
    const tile = this.map.getTileAtWorldXY(end.x, end.y, false, this.cameras.main, this.mapLayers['grass']);
      
    // Move Player to this position
    // Player will automatically find its path to the point and update its position accordingly
    this.emitter.emit('unit.goTo', this.player, tile);
  }

  update() {
    if (!this.currentSelection)
      this.updateMapMarker();
  }

  private updateMapMarker() {
    // Convert the mouse position to world position within the camera
    const worldPoint: any = this.input.activePointer.positionToCamera(this.cameras.main);

    // Move map marker over pointed tile
    const pointerTileXY = this.mapLayers['ui'].worldToTileXY(worldPoint.x, worldPoint.y);
    const snappedWorldPoint = this.mapLayers['ui'].tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
    this.marker.setPosition(snappedWorldPoint.x, snappedWorldPoint.y);
  }

  onMeetEnemy = (player: ArcadeSprite, enemy: ArcadeSprite) => {
    enemy.x = Phaser.Math.RND.between(0, 300);
    enemy.z = Phaser.Math.RND.between(0, 300);

    // shake the world
    this.cameras.main.fade(1000);
  }
}