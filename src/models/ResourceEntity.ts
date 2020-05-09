import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';
import { ObjectType } from '../types/Objects';
import * as ResourcesData from '../data/resources.json';
import Item from './Item';
import { SkillType } from '../systems/SkillsSystem';
import CONFIG from '../gameConfig';
import { ActionType } from '../types/Actions';
import { EntityAction } from '../services/EntityActionManager';
import Player from './Player';

export default class ResourceEntity extends Entity {
    unitType = EntityType.OBJECT;
    resourceData: any;
    resourceId: string | number;
    // Item droped by this resource
    item: Item;
    itemQuantity: number;
    harvestingSkill?: SkillType;

    harvestingSkillXp?: number;
    harvestingRequiredSkillLevel: number = 1;
    frameLevels: number[];
    level: number = 1;

    customActions = [
        {
            id: 'collect',
            name: 'Collect',
            iconFrame: 5,
            onClick: () => {
                const player = this.scene.player;
                const skill = player.skills.get(this.harvestingSkill);

                if (skill.level < this.harvestingRequiredSkillLevel) {
                    alert(`You cannot collect this resource. You must be level ${this.harvestingRequiredSkillLevel} in ${this.harvestingSkill} !`);
                } else {
                    this.collectResource(player);
                }   
            }
        },
    ];

    constructor(scene: WorldScene, x: number, y: number, type: ObjectType) {
        super(scene, x, y, scene.navMesh, ResourcesData[type].texture, ResourcesData[type].frameLevels[1]);

        this.resourceData = ResourcesData[type];
        this.name = ResourcesData[type].name;

        this.item = new Item(this.resourceData.item);
        this.itemQuantity = this.resourceData.itemQuantity || 1;
        this.frameLevels = this.resourceData.frameLevels;

        this.harvestingSkill = this.resourceData.skill || SkillType.FARMING;
        this.harvestingSkillXp = this.resourceData.skillXp || 10;
        this.harvestingRequiredSkillLevel = this.resourceData.skillRequiredLevel || 1;

        // Set container size following resource size
        const resourceWidth = this.resourceData.tileWidth || 1;
        const resourceHeight = this.resourceData.tileHeight || 1;
        this.setSize(resourceWidth * CONFIG.TILE_SIZE, resourceHeight * CONFIG.TILE_SIZE);

        // Enable custom actions
        this.enableCustomActions();
    }

    grow(newLevel?: number) {
        this.level = newLevel || this.level + 1;

        this.unitSprite.setFrame(this.frameLevels[this.level]);
    }

    private collectResource(player: Player) {
        const playerPos = new Phaser.Geom.Point(player.body.x, player.body.y);

        // Find tile next to object and move player
        const tileNextToObject = this.getNearestFreeTile(playerPos);
        this.emitter.emit(ActionType.ENTITY_SELECT, this, false);

        this.actions.enqueue(player, {
            type: ActionType.ENTITY_GO_TO,
            args: [tileNextToObject],
            isCompleted: (action: EntityAction, player: Entity) => {
                const playerTile = player.getTile();

                // Move is completed when player's tile = tile next to object
                return (player.getTile() === tileNextToObject);
            }
        });

        const timeToCollect = 3000;
        this.actions.enqueue(this.scene.player, {
            type: ActionType.RESOURCE_COLLECT_BEGIN,
            args: [this],
            progress: (action: EntityAction) => {
                const elapsedTime = Date.now() - action.startedDate;

                return Math.floor(elapsedTime / timeToCollect * 100)
            },
            isCompleted: (action: EntityAction) => {
                const elapsedTime = Date.now() - action.startedDate;
                return elapsedTime >= timeToCollect;
            },
        });
        this.actions.enqueue(this.scene.player, {
            type: ActionType.RESOURCE_COLLECT,
            args: [this],
        });
    }
}