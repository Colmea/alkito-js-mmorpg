import 'phaser';
import CONFIG from '../gameConfig';
import { getTilePosition } from '../utils/tileUtils';
import Mover from '../systems/Mover';

export enum UnitType {
    PLAYER,
    PNJ,
    ENEMY,
    OBJECT,
};

export default class Unit extends Phaser.GameObjects.Container {
    // Info
    unitType: UnitType;
    private unitName: string;
    hp: number = 100;
    damage: number = 10;
    isMoving: boolean = true;

    // Systems
    follower: Mover;
    body: Phaser.Physics.Arcade.Body;
    unitSprite: Phaser.GameObjects.Sprite;
    nameText: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        xTile: number,
        yTile: number,
        navMesh: any,
        texture: string,
        frame: number = 1,
    ) {
        super(scene, getTilePosition(xTile, yTile).x, getTilePosition(xTile, yTile).y);

        this.setSize(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        this.scene.physics.world.enable(this);
        
        scene.add.existing(this);

        // Create Unit sprite
        this._createUnitSprite(navMesh, texture, frame);
        // Create name info
        this._createName();

        // Register update loop
        scene.events.on("update", this.update, this);
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
            console.log('Element clicked:', this.unitName, );
        });

        // Register "follower" behavior
        this.follower = new Mover(this.scene, navMesh, this.body);
    }

    private _createName() {
        this.nameText = new Phaser.GameObjects.Text(this.scene, 0, 0, this.unitName, {
            fontSize: '8',
        });
        this.nameText.setOrigin(0.5, 2.4);

        this.scene.add.existing(this.nameText);
        this.add(this.nameText);
    }

    public goTo(destination: Phaser.Math.Vector2) {
        if (this.follower) {
            this.follower.goTo(destination);
        }
    }

    public attack(target: Unit) {
        target.takeDamage(this.damage);      
    }

    public takeDamage (damage: number) {
        this.hp -= damage;        
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