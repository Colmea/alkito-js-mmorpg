import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';
import { ObjectType } from '../types/Objects';
import * as ItemsData from '../data/items.json';

export default class ObjectEntity extends Entity {
    unitType = EntityType.OBJECT;
    objectType: string;
    
    constructor(scene: WorldScene, x: number, y: number, navMesh: any, type: ObjectType) {
        super(scene, x, y, navMesh, ItemsData[type].texture, ItemsData[type].frame);

        this.objectType = ItemsData[type].id;
        this.name = ItemsData[type].name;
    }
}