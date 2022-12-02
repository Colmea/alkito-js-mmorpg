import "phaser";
import CONFIG from "../gameConfig.json";
import Entity, { EntityType } from "./Entity";
import WorldScene from "../scenes/WorldScene";
import { ObjectType } from "../types/Objects";
import ItemsData from "../data/interactive_items.json";
import { ActionType } from "../types/Actions";
import { Action } from "./ui/UIActions";
import { Menu } from "../types/Menus";

export default class ItemEntity extends Entity {
  unitType = EntityType.OBJECT;
  itemData: any;
  customActions: Action[] = [
    {
      id: "blog",
      name: "Blog",
      iconFrame: 25,
      onClick: () => {
        this.actions.enqueue(this, {
          type: ActionType.OPEN_MENU,
          args: [Menu.BLOG],
        });
      },
    },
  ];

  constructor(scene: WorldScene, x: number, y: number, type: ObjectType) {
    super(
      scene,
      x,
      y,
      scene.navMesh,
      ItemsData[type].texture,
      ItemsData[type].frame,
    );

    this.itemData = ItemsData[type];
    this.name = ItemsData[type].name;


    // Set container size following resource size
    const resourceWidth = this.itemData.tileWidth || 1;
    const resourceHeight = this.itemData.tileHeight || 1;
    this.setSize(
      resourceWidth * CONFIG.TILE_SIZE,
      resourceHeight * CONFIG.TILE_SIZE
    );

    // Enable custom actions
    this.enableCustomActions();
  }
}
