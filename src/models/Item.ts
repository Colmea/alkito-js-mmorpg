import * as ItemsData from '../data/items.json';

export default class Item {
    type: string;
    price: number;
    name: string;
    texture: string;
    frame: number;

    constructor(type: string) {
        const itemData = ItemsData[type];

        if (!itemData) throw new Error(`Error: Item type "${type}" is not a valid type.`);

        this.type = type;
        this.price = itemData.price;
        this.name = itemData.name;
        this.texture = itemData.texture;
        this.frame = itemData.frame; 
    }
}