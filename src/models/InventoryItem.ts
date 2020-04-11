import { v4 as uuid } from 'uuid';
import ObjectEntity from './ObjectEntity';

export default class InventoryItem {
  id: string = uuid();
  quantity: number = 1;
  entity: ObjectEntity;

  constructor(entity: ObjectEntity, quantity: number = 1) {
    this.entity = entity;
    this.quantity = quantity;
  }
}