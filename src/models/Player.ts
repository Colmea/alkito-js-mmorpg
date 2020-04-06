import 'phaser';
import Unit, { UnitType} from './Unit';
import WorldScene from '../scenes/WorldScene';

export default class Player extends Unit {
    unitType = UnitType.PLAYER;
    name = 'Colmea';

    constructor(scene: WorldScene, x: number, y: number, navMesh: any) {
        super(scene, x, y, navMesh, 'player', 1);
    }
}