import 'phaser';
import Entity, { EntityType} from './Entity';

export default class Resource extends Entity {
    unitType = EntityType.OBJECT;
    name = 'Plante';

    constructor(scene, x, y, navMesh) {
        super(scene, x, y, navMesh, 'tileset', 10);
    }
}