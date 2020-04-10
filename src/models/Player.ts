import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';

export default class Player extends Entity {
    unitType = EntityType.PLAYER;
    name = 'Colmea';

    constructor(scene: WorldScene, x: number, y: number, navMesh: any) {
        super(scene, x, y, navMesh, 'player', 1);
    }
}