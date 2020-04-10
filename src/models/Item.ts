import { v4 as uuid } from 'uuid';

export default class Item {
    id: string = uuid();
    name: string;
    price: number = 0;
}