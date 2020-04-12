import InventoryItem from "../models/InventoryItem";
import Entity from "../models/Entity";

export interface HasInventory {
  inventory: InventorySystem;
}

export default class InventorySystem {
  notifyUpdate: () => void = () => {};
  items: InventoryItem[] = [];

  add(items: InventoryItem | InventoryItem[]) {
    if (!Array.isArray(items)) items = [items];

    items.forEach((item: InventoryItem) => {
      const existingSameItem = this.getFirstItemByType(item);

      if (existingSameItem)
        existingSameItem.quantity += item.quantity;
      else
        this.items.push(item);
    });
    
    this.notifyUpdate();
  }

  private getFirstItemByType(item: InventoryItem): InventoryItem | null {
    const items = this.items.filter((itemInventory: InventoryItem) => {
      return item.item.type === itemInventory.item.type;
    });

    return items[0];
  }

  onUpdate(callback: () => void) {
    this.notifyUpdate = callback;
  }
}