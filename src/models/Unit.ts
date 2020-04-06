import 'phaser';
import CONFIG from '../gameConfig';
import { getTilePosition } from '../utils/tileUtils';
import Mover from '../systems/Mover';
import WorldScene from '../scenes/WorldScene';
import EventDispatcher from '../EventDispatcher';

export enum UnitType {
    PLAYER,
    PNJ,
    ENEMY,
    OBJECT,
};

export default class Unit extends Phaser.GameObjects.Container {
    // Info
    unitType: UnitType;
    unitName: string;
    hp: number = 100;
    damage: number = 10;
    isMoving: boolean = true;

    // States
    isSelected: boolean = false;

    // Systems
    scene: WorldScene;
    emitter: EventDispatcher;
    follower: Mover;
    body: Phaser.Physics.Arcade.Body;
    unitSprite: Phaser.GameObjects.Sprite;
    nameText: Phaser.GameObjects.Text;
    actionIcon: Phaser.GameObjects.Sprite;

    constructor(
        scene: WorldScene,
        xTile: number,
        yTile: number,
        navMesh: any,
        texture: string,
        frame: number = 1,
    ) {
        super(scene, getTilePosition(xTile, yTile).x, getTilePosition(xTile, yTile).y);

        this.emitter = EventDispatcher.getInstance();

        this.setSize(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        this.scene.physics.world.enable(this);
        
        scene.add.existing(this);

        // Create Unit sprite
        this._createUnitSprite(navMesh, texture, frame);
        // Create name info
        this._createName();
        this._createAction();

        // Register update loop
        scene.events.on('update', this.update, this);
    }

    set name(name: string) {
        this.unitName = name;

        if (this.nameText)
            this.nameText.setText(this.unitName);
    }

    private _createUnitSprite(navMesh: any, texture: string, frame: number) {
        this.unitSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, texture, frame);
        this.scene.add.existing(this.unitSprite);
        this.add(this.unitSprite);
        this.unitSprite.setInteractive();

        this.unitSprite.on('pointerover', () => {
            this.unitSprite.setTint(0xFFFF000);
        });
    
        this.unitSprite.on('pointerout', () => {
            this.unitSprite.clearTint();
        });

        this.unitSprite.on('pointerdown', (pointer, x, y, e) => {
            // stop propagation (void detect click on map)
            e.stopPropagation();
            // Find tile next to object and move player
            const tileNextToObject = this.getTile('next');
            this.emitter.emit('unit.select', this);
        });

        // Register "follower" behavior
        this.follower = new Mover(this.scene, navMesh, this.body);
    }

    private _createAction() {
        this.actionIcon = new Phaser.GameObjects.Sprite(this.scene, -10, -50, 'icons', 5);
        this.actionIcon.setScale(.8);
        this.actionIcon.setVisible(false);
        this.scene.add.existing(this.actionIcon);
        this.add(this.actionIcon);
        this.actionIcon.setInteractive();

        this.actionIcon.on('pointerdown', (pointer, x, y, e) => {
            // stop propagation (void detect click on map)
            e.stopPropagation();
            // Find tile next to object and move player
            const tileNextToObject = this.getTile('next');
            this.emitter.emit('unit.select', this, false);
            this.emitter.emit('unit.goTo', this.scene.player, tileNextToObject);
        });
    }

    private _createName() {
        this.nameText = new Phaser.GameObjects.Text(this.scene, 0, 0, this.unitName, {
            fontSize: '8',
        });
        this.nameText.setOrigin(0.5, 2.4);

        this.scene.add.existing(this.nameText);
        this.add(this.nameText);
    }

    public goTo(tileDestination: Phaser.Tilemaps.Tile) {
        if (this.follower) {
            this.follower.goTo(tileDestination);
        }
    }

    public attack(target: Unit) {
        target.takeDamage(this.damage);      
    }

    public takeDamage(damage: number) {
        this.hp -= damage;        
    }

    public select(flag: boolean) {
        this.isSelected = flag;
        this.actionIcon.setVisible(flag);
    }

    public getTile(position?: 'next') {
        let x = this.x;
        let y = this.y;

        if (position === 'next') {
            x += CONFIG.TILE_SIZE;
        }

        return this.scene.map.getTileAtWorldXY(x, y, false, this.scene.cameras.main, this.scene.mapLayers['grass']);
    }

    update() {
        if (!this.isMoving) return;

        // Animate player following current velocity
        const velocity = this.body.velocity;
        if (velocity.y > 0 && Math.abs(velocity.y) > Math.abs(velocity.x)) {
            console.log('down');
            this.unitSprite.play('down', true);
        }
        else if (this.body.velocity.y < 0 && Math.abs(velocity.y) > Math.abs(velocity.x)) {
            this.unitSprite.play('up', true);
        }
        else if (velocity.x > 0) {
            this.unitSprite.play('right', true);
        }
        else if (this.body.velocity.x < 0) {
            this.unitSprite.play('left', true);
        }
        else {
           this.unitSprite.anims.stop();
        }
    }
}