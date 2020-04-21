import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';
import { ObjectType } from '../types/Objects';
import * as ResourcesData from '../data/resources.json';
import Item from './Item';
import { SkillType } from '../systems/SkillsSystem';

export default class ResourceEntity extends Entity {
    unitType = EntityType.OBJECT;
    // Item droped by this resource
    item: Item;
    itemQuantity: number;
    harvestingSkill?: SkillType = SkillType.FARMING;
    harvestingSkillXp?: number = 15;
    
    constructor(scene: WorldScene, x: number, y: number, type: ObjectType) {
        super(scene, x, y, scene.navMesh, ResourcesData[type].texture, ResourcesData[type].frame);

        const resourceData = ResourcesData[type];
        this.name = ResourcesData[type].name;

        this.item = new Item(resourceData.item);
        this.itemQuantity = resourceData.itemQuantity || 1;
    }
}