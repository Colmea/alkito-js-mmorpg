import EventDispatcher from './EventDispatcher';
import Entity from '../models/Entity';
import { HasInventory } from '../systems/InventorySystem';
import InventoryItem from '../models/InventoryItem';
import ResourceEntity from '../models/ResourceEntity';


export default class EntityActionProcessor {
    emitter = EventDispatcher.getInstance();

    listen() {
      this.emitter.on('action.go-to', (unit: Entity, tile: Phaser.Tilemaps.Tile) => {
        unit.goTo(tile);
      });

      this.emitter.on('action.take', (unit: Entity & HasInventory, object: ResourceEntity) => {
        // Look at object
        unit.lookAt(object);

        if (unit.inventory) {
          // Create inventory's item and add it to unit's inventory
          const itemInventory = new InventoryItem(object.item, object.itemQuantity);
          unit.inventory.add(itemInventory);

          // Hide object
          object.setVisible(false);
        }
      });

      this.emitter.on('action.progress', (owner: Entity, progress: number, target: Entity) => {
        target.displayProgress(progress);
      });
    }
}