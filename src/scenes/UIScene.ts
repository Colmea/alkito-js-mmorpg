import 'phaser';
import EventDispatcher from '../managers/EventDispatcher';
import Player from '../models/Player';
import Item from '../models/Item';

export default class UIScene extends Phaser.Scene {
  NB_INVENTORY_SLOT: number = 8;

  emitter: EventDispatcher = EventDispatcher.getInstance();
  player: Player;
  slots: Phaser.GameObjects.Image[] = [];
  items: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super('UIScene');
  }

  init(data: { player: Player }) {
    this.player = data.player;
  }

  create() {
    const x = this.scale.width / 2 - (this.NB_INVENTORY_SLOT * 40 / 2);
    const y = this.scale.height - 30;

    for (let i=0; i < this.NB_INVENTORY_SLOT; i++) {
      const slot = this.add.image(x + (i*40), y, 'ui.slot');
      slot.setInteractive({ useHandCursor: true });
    
      slot.on('pointerover', () => {
        slot.setTint(0x999999);
      });
      slot.on('pointerout', () => {
        slot.clearTint();
      });
      slot.on('pointerdown', () => {
        this.emitter.emit('ui.slot.select', slot, i);
      });

      this.slots.push(slot);
    }

    // Listen for inventory update and update its render in UI
    this.player.inventory.onUpdate(() => {
      this.drawInventory();
    });
  }

  drawInventory() {
    const inventory = this.player.inventory;
    const x = this.scale.width / 2 - (this.NB_INVENTORY_SLOT * 40 / 2);
    const y = this.scale.height - 30;

    inventory.items.forEach((item: Item, index: number) => {
      const slotItemSprite = this.items[index];

      // Create item
      if (!slotItemSprite) {
        const itemSprite = this.add.sprite(x + (index*40), y, item.entity.unitSprite.texture.key, item.entity.unitSprite.frame.name);
        this.items[index] = itemSprite;
      }
    });
  }

}