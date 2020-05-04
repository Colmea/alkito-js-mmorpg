import EventDispatcher from './EventDispatcher';
import EventListener from './EventListenerInterface';
import Entity from '../models/Entity';
import { HasInventory } from '../systems/InventorySystem';
import InventoryItem from '../models/InventoryItem';
import ResourceEntity from '../models/ResourceEntity';
import { ActionType, ServerEvent } from '../types/Actions';


export default class EntityActionProcessor implements EventListener {
    emitter = EventDispatcher.getInstance();

    listen() {
      this.emitter.on(ServerEvent.ENTITY_MOVED, (unit: Entity, tile: Phaser.Tilemaps.Tile) => {
        unit.goTo(tile);
      });

      this.emitter.on(ActionType.RESOURCE_COLLECT, (unit: Entity & HasInventory, object: ResourceEntity) => {
        // Look at object
        unit.lookAt(object);

        if (unit.inventory) {
          // Create inventory's item and add it to unit's inventory
          const itemInventory = new InventoryItem(object.item, object.itemQuantity);
          unit.inventory.add(itemInventory);

          // Hide object
          object.setVisible(false);

          // Increase harvesting skill
          if (object.harvestingSkill) {
            this.emitter.emit(ActionType.SKILL_INCREASE, unit, object.harvestingSkill, object.harvestingSkillXp)
          }
        }
      });

      this.emitter.on(ActionType.ACTION_PROGRESS, (owner: Entity, progress: number, target: Entity) => {
        target.displayProgress(progress);
      });
    }
}