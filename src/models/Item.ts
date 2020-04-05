import 'phaser';
import Unit, { UnitType} from './Unit';

export default class Player extends Unit {
    unitType = UnitType.OBJECT;
    name = 'Plante';

    constructor(scene, x, y, navMesh) {
        super(scene, x, y, navMesh, 'tileset', 10);
    }
}