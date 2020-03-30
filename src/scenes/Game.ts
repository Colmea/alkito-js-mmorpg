import 'phaser';
import PhaserNavMeshPlugin from "phaser-navmesh";

type ArcadeSprite = Phaser.Physics.Arcade.Sprite;

export default class Game extends Phaser.Scene {
  navMeshPlugin: any;

  map: any;
  mapLayers = {};
  player: any;
  cursors: any;

  constructor() {
    super('GameScene');
  }

  preload() {

  }

  create() {
    this.map = this.make.tilemap({ key: 'map' });
  
    const tiles = this.map.addTilesetImage('tileset', 'tiles');
        
    this.mapLayers['grass'] = this.map.createStaticLayer('Grass', tiles, 0, 0);
    this.mapLayers['objects'] = this.map.createStaticLayer('Objects', tiles, 0, 0);
    this.mapLayers['objects'].setCollisionByExclusion([-1]);
    this.mapLayers['decorations'] = this.map.createStaticLayer('Decorations', tiles, 0, 0);

    // Player
    this.player = this.physics.add.sprite(50, 100, 'player', 1);

    this.physics.world.bounds.width = this.map.widthInPixels;
    this.physics.world.bounds.height = this.map.heightInPixels;
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, this.mapLayers['objects']);

    console.log('plugin', this);
    // const navMesh = this.navMeshPlugin.buildMeshFromTiled(
    //   "mesh",
    //   this.mapLayers['objects'],
    //   12.5
    // );

    // const path = navMesh.findPath({ x: 0, y: 0 }, { x: 300, y: 400 });
    //   console.log(path);

    // Player animation
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('player', { frames: [4, 3, 4, 5]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { frames: [7, 6, 7, 8]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'up',
      frames: this.anims.generateFrameNumbers('player', { frames: [10, 9, 10, 11]}),
      frameRate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'down',
      frames: this.anims.generateFrameNumbers('player', { frames: [1, 0, 1, 2 ]}),
      frameRate: 10,
      repeat: -1
    });

    // Enemies
    const enemy001 = this.physics.add.sprite(120, 150, 'enemy-1', 1);
    
    // Check collision with enemy
    this.physics.add.overlap(this.player, enemy001, this.onMeetEnemy);

    // Inputs
    this.cursors = this.input.keyboard.createCursorKeys();
  
    this.input.on('pointerdown', () => {
      const x = this.input.mousePointer.x;
      const y = this.input.mousePointer.y;
      this.physics.moveTo(this.player, x, y);
    });
    
    // Camera follow player
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;
  }

  update() {
    this.player.body.setVelocity(0);
 
    // Update position
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-80);
    }
    else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(80);
    }
    if (this.cursors.up.isDown) {
      this.player.body.setVelocityY(-80);
    }
    else if (this.cursors.down.isDown) {
      this.player.body.setVelocityY(80);
    }

    // Udate player animation
    if (this.cursors.left.isDown) {
      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.anims.play('right', true);
    }
    else if (this.cursors.up.isDown) {
      this.player.anims.play('up', true);
    }
    else if (this.cursors.down.isDown) {
      this.player.anims.play('down', true);
    }
    else {
      this.player.anims.stop();
    }
  }

  onMeetEnemy = (player: ArcadeSprite, enemy: ArcadeSprite) => {
    enemy.x = Phaser.Math.RND.between(0, 300);
    enemy.z = Phaser.Math.RND.between(0, 300);

    // shake the world
    this.cameras.main.fade(1000);
  }
}