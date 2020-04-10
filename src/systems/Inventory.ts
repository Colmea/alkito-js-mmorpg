import Item from "../models/Item";

export default class InventorySystem {
    items: Item[];

    add(items: Item[]) {
        this.items.push(...items);
    }
}