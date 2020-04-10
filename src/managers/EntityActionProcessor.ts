import EventDispatcher from './EventDispatcher';
import Entity from '../models/Entity';
import { HasInventory } from '../systems/Inventory';
import Item from '../models/Item';


export default class EntityActionProcessor {
    emitter = EventDispatcher.getInstance();

    listen() {
      this.emitter.on('action.go-to', (unit: Entity, tile: Phaser.Tilemaps.Tile) => {
        unit.goTo(tile);
      });

      this.emitter.on('action.take', (unit: Entity & HasInventory, object: Entity) => {
        // Look at object
        unit.lookAt(object);

        if (unit.inventory) {
          // Create item and add it to unit's inventory
          const item = new Item(object, 1);
          unit.inventory.add(item);

          // Hide object
          object.setVisible(false);
        }


      });
    }
}