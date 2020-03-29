import 'phaser';

export enum UnitType {
    PLAYER,
    PNJ,
    ENEMY,
};

export default class Unit extends Phaser.GameObjects.Sprite {

    name: string;
    unitType: UnitType;
    hp: number;
    damage: number;

    constructor(
        scene: Phaser.Scene,
        x: number,
        y: number,
        texture: string,
        frame: number,
        name: string,
        hp: number,
        damage: number,
    ) {
        super(scene, x, y, texture, frame);

        this.name = name;
        this.hp = hp;
        this.damage = damage;
    }

    attack(target) {
        target.takeDamage(this.damage);      
    }

    takeDamage (damage) {
        this.hp -= damage;        
    }
}