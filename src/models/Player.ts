import 'phaser';
import Unit, { UnitType} from './Unit';

export default class Player extends Unit {
    unitType = UnitType.PLAYER;
    name = 'Colmea';

    constructor(scene, x, y, navMesh) {
        super(scene, x, y, navMesh, 'player', 1);
    }
}