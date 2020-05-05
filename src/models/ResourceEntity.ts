import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';
import { ObjectType } from '../types/Objects';
import * as ResourcesData from '../data/resources.json';
import Item from './Item';
import { SkillType } from '../systems/SkillsSystem';

export default class ResourceEntity extends Entity {
    unitType = EntityType.OBJECT;
    resourceData: any;
    resourceId: string | number;
    // Item droped by this resource
    item: Item;
    itemQuantity: number;
    harvestingSkill?: SkillType = SkillType.FARMING;
    harvestingSkillXp?: number = 15;
    frameLevels: number[];
    level: number = 1;

    constructor(scene: WorldScene, x: number, y: number, type: ObjectType) {
        super(scene, x, y, scene.navMesh, ResourcesData[type].texture, ResourcesData[type].frameLevels[1]);

        this.resourceData = ResourcesData[type];
        this.name = ResourcesData[type].name;

        this.item = new Item(this.resourceData.item);
        this.itemQuantity = this.resourceData.itemQuantity || 1;
        this.frameLevels = this.resourceData.frameLevels;
    }

    grow(newLevel?: number) {
        this.level = newLevel || this.level + 1;

        this.unitSprite.setFrame(this.frameLevels[this.level]);
    }
}