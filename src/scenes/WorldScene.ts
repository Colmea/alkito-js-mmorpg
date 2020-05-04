declare global {
  interface Window {
    io: any;
  }
}

import 'phaser';
import Player from '../models/Player';
import OtherPlayer from '../models/OtherPlayer';
import ResourceEntity from '../models/ResourceEntity';
import Entity from '../models/Entity';
import EventDispatcher from '../services/EventDispatcher';
import EntityActionManager from '../services/EntityActionManager';
import EntityActionProcessor from '../services/EntityActionProcessor';
import defaultIO from 'socket.io-client';
import SkillsManager from '../services/SkillsManager';
import { ActionType, ServerEvent } from '../types/Actions';
import ServerConnectorService from '../services/ServerConnectorService';
import GameState from '../services/GameState';


type ArcadeSprite = Phaser.Physics.Arcade.Sprite;
type MapLayer = Phaser.Tilemaps.StaticTilemapLayer | Phaser.Tilemaps.DynamicTilemapLayer;

export default class WorldScene extends Phaser.Scene {
  TILE_SIZE: number = 32;

  server: any;
  emitter: EventDispatcher = EventDispatcher.getInstance();
  entityActions: EntityActionManager;
  gameState: GameState = new GameState(this, this.emitter);

  navMeshPlugin: any;
  navMesh: any;
  marker: Phaser.GameObjects.Graphics;
  map: Phaser.Tilemaps.Tilemap;
  mapLayers: { [key: string]: MapLayer } = {};

  player: Player;
  otherPlayers: { [key: string]: OtherPlayer } = {};
  currentSelection: Entity | null;

  constructor() {
    super('WorldScene');
  }

  create() {
    this.input.setDefaultCursor('url(assets/ui/cursor-brown.cur), default');
    this.entityActions = EntityActionManager.init(this);

    this._createMap();
    this._createAnims();

    // Connect to Server World
    this.server = window.io ? window.io() : defaultIO('http://localhost:3000');

    // Create player
    this.server.on('playerCreated', (player: any) => {
      this.player = new Player(this, player.x, player.y, this.navMesh);
      this.player.id = player.id;
      this.player.name = player.name;
      this.player.avatar = player.avatar;

      // Camera follow player
      this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
      this.cameras.main.startFollow(this.player);
      this.cameras.main.roundPixels = true;

      this._createEvents();

      this.scene.launch('UIScene', { player: this.player, mapLayer: this.map });
      this.scene.launch('ReactScene', { player: this.player });
    });

    // Create other players
    this.server.on('currentPlayers', (players: any) => {
      for (const playerId in players) {
        const otherPlayer = players[playerId];

        if (otherPlayer.id === this.player.id) continue;

        const newPlayer = new OtherPlayer(this, otherPlayer.x, otherPlayer.y, this.navMesh);
        newPlayer.name = otherPlayer.name;
        this.otherPlayers[otherPlayer.id] = newPlayer;
      }
    });

    // New player connected
    this.server.on('newPlayer', (newPlayer: any) => {
        const player = new OtherPlayer(this, newPlayer.x, newPlayer.y, this.navMesh);
        player.name = newPlayer.name;
        this.otherPlayers[newPlayer.id] = player;
    });

    // Player disconnected
    this.server.on('playerDisconnected', (disconnectedPlayer: any) => {
      const player = this.otherPlayers[disconnectedPlayer.id];
      player.destroy(true);

      delete this.otherPlayers[disconnectedPlayer.id];
    });
  }

  private _createMap() {
    this.map = this.make.tilemap({ key: 'map' });

    const tiles = this.map.addTilesetImage('tileset', 'tiles');
    const tiles2 = this.map.addTilesetImage('tileset2', 'tiles2', 32, 32, 1, 2);
    const tilesetGrass = this.map.addTilesetImage('Grass', 'tileset_grass', 32, 32, 1, 2);

    this.mapLayers['grass'] = this.map.createStaticLayer('Grass', [tiles, tiles2, tilesetGrass], 0, 0);
    this.mapLayers['decorations'] = this.map.createStaticLayer('Decorations', [tiles, tiles2], 0, 0);
    this.mapLayers['objects'] = this.map.createStaticLayer('Objects', [tiles, tiles2], 0, 0);
    // this.mapLayers['objects'].setCollisionByExclusion([-1]);
    this.mapLayers['ui'] = this.map.createBlankDynamicLayer('UI', [tiles, tiles2]);

    // Resources from Map
    const resources = this.map.getObjectLayer("Items");
    // Create Resources from data map
    resources.objects.forEach((object: any) => {
        const tile =  this.map.getTileAtWorldXY(object.x, object.y, false, this.cameras.main, this.mapLayers['grass']);
        new ResourceEntity(this, tile.x, tile.y, object.type);
    });

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
      key: 'player-left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 3, 4, 5] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'player-right',
      frames: this.anims.generateFrameNumbers('player', { frames: [7, 6, 7, 8] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'player-up',
      frames: this.anims.generateFrameNumbers('player', { frames: [10, 9, 10, 11] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'player-down',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 0, 1, 2] }),
      frameRate: 10,
      repeat: -1
    });

    // Other Players animation
    this.anims.create({
      key: 'other-player-left',
      frames: this.anims.generateFrameNumbers('other-player', { frames: [4, 3, 4, 5] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'other-player-right',
      frames: this.anims.generateFrameNumbers('other-player', { frames: [7, 6, 7, 8] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'other-player-up',
      frames: this.anims.generateFrameNumbers('other-player', { frames: [10, 9, 10, 11] }),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'other-player-down',
      frames: this.anims.generateFrameNumbers('other-player', { frames: [1, 0, 1, 2] }),
      frameRate: 10,
      repeat: -1
    });
  }

  private _createEvents() {
    // Server Connector Listener
    const serverConnectorService = new ServerConnectorService(this.server, this, this.emitter);
    serverConnectorService.listen();
    // Entity Action Listener
    const entityActionProcessor = new EntityActionProcessor();
    entityActionProcessor.listen();

    // Skills Manager
    const skillsManager = new SkillsManager();
    skillsManager.listen();

    // On map click
    this.input.on('pointerdown', this.onMapClick);
   
    this.emitter.on(ActionType.ENTITY_SELECT, (unit: Entity | null, flag: boolean = true) => {
      if (this.currentSelection) {
        this.currentSelection.select(false);
      }

      if (flag) 
        this.currentSelection = unit;
      else
        this.currentSelection = null;

      if (unit)
        unit.select(flag);
    });
  }

  onMapClick = (pointer: Phaser.Input.Pointer) => {
    // If something is selected, unselected
    if (this.currentSelection) {
      this.emitter.emit('unit.select', null);
      return;
    }

    this._moveEntity(this.player, pointer.worldX, pointer.worldY);
  }

  private _moveEntity(entity: Entity, x: number, y: number): Phaser.Tilemaps.Tile {
    const tile = this.map.getTileAtWorldXY(x, y, false, this.cameras.main, this.mapLayers['grass']);
      
    // Move Player to this position
    // Player will automatically find its path to the point and update its position accordingly
    this.entityActions.processNow(entity, { type: ActionType.ENTITY_GO_TO, args: [tile] });

    return tile;
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
}