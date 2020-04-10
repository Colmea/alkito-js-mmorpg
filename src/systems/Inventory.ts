import Item from "../models/Item";

export interface HasInventory {
  inventory: InventorySystem;
}

export default class InventorySystem {
  notifyUpdate: () => void = () => {};
  items: Item[] = [];

  add(items: Item | Item[]) {
    if (Array.isArray(items))
      this.items.push(...items);
    else
      this.items.push(items);
    
    this.notifyUpdate();
  }

  onUpdate(callback: () => void) {
    this.notifyUpdate = callback;
  }
}