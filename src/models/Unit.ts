import 'phaser';
import Mover from '../systems/Mover';

export enum UnitType {
    PLAYER,
    PNJ,
    ENEMY,
};


export default class Unit extends Phaser.GameObjects.Container {
    // Info
    unitType: UnitType;
    private unitName: string;
    hp: number = 100;
    damage: number = 10;
    // Systems
    follower: Mover;
    body: Phaser.Physics.Arcade.Body;
    unitSprite: Phaser.GameObjects.Sprite;
    nameText: Phaser.GameObjects.Text;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        navMesh: any,
        texture: string,
        frame: number = 1,
    ) {
        super(scene, x, y);

        this.setSize(32, 32);
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