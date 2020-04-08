import 'phaser';
import EventDispatcher from '../EventDispatcher';

export default class UIScene extends Phaser.Scene {
  NB_INVENTORY_SLOT: number = 8;

  emitter: EventDispatcher = EventDispatcher.getInstance();
  slots: Phaser.GameObjects.Image[] = [];

  constructor() {
    super('UIScene');
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
  }
}