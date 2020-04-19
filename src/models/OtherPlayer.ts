import 'phaser';
import Entity, { EntityType} from './Entity';
import WorldScene from '../scenes/WorldScene';
import Inventory, { HasInventory } from '../systems/InventorySystem';

export default class OtherPlayer extends Entity implements HasInventory {
    unitType = EntityType.PLAYER;
    name = 'Player #' + Math.floor(Math.random() * 1000);
    inventory: Inventory = new Inventory();
    isNameAlwaysVisible = true;
    animationKey = 'other-player';

    constructor(scene: WorldScene, x: number, y: number, navMesh: any) {
        super(scene, x, y, navMesh, 'other-player', 1);

        this.nameText.setVisible(this.isNameAlwaysVisible);
    }
}