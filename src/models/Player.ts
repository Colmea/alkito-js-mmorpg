import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';
import Inventory, { HasInventory } from '../systems/InventorySystem';
import SkillsSystem, { HasSkills } from '../systems/SkillsSystem';
import WoodCuttingSkill from './skills/WoodCuttingSkill';
import FarmingSkill from './skills/FarmingSkill';
import MiningSkill from './skills/MiningSkill';

export default class Player extends Entity implements HasInventory, HasSkills {
    unitType = EntityType.PLAYER;
    name = 'Player';
    animationKey = 'player';
    avatar: string;

    // behaviors
    inventory: Inventory = new Inventory();
    skills: SkillsSystem = new SkillsSystem([
        new WoodCuttingSkill(),
        new FarmingSkill(),
        new MiningSkill(),
    ]);
    
    constructor(scene: WorldScene, x: number, y: number, navMesh: any) {
        super(scene, x, y, navMesh, 'player', 1);
    }
}