import 'phaser';
import Entity, { EntityType} from './Entity';

export default class Enemy extends Entity {
    unitType: EntityType.ENEMY;
}