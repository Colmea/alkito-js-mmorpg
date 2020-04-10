import { v4 as uuid } from 'uuid';
import Entity from './Entity';

export default class Item {
  id: string = uuid();
  quantity: number = 1;
  entity: Entity;

  constructor(entity: Entity, quantity: number = 1) {
    this.entity = entity;
    this.quantity = quantity;
  }
}