import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';

export default class Resource extends Entity {
    unitType = EntityType.OBJECT;

    constructor(scene: WorldScene, x: number, y: number, navMesh: any, name: string = 'Resource', frame?: number) {
        super(scene, x, y, navMesh, 'tileset', frame);

        this.name = name;
    }
}