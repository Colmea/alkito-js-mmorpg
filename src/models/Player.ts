import 'phaser';
import Unit, { UnitType} from './Unit';

export default class Player extends Unit {
    unitType: UnitType.PLAYER;
}