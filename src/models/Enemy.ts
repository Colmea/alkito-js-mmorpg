import 'phaser';
import Unit, { UnitType} from './Unit';

export default class Enemy extends Unit {
    unitType: UnitType.ENEMY;
}