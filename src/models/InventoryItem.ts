import { v4 as uuid } from 'uuid';
import ResourceEntity from './ResourceEntity';
import Item from './Item';

export default class InventoryItem {
  id: string = uuid();
  item: Item;
  quantity: number = 1;

  constructor(item: Item, quantity: number = 1) {
    this.item = item;
    this.quantity = quantity;
  }
}