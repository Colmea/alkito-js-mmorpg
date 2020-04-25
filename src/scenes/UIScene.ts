import 'phaser';
import EventDispatcher from '../managers/EventDispatcher';
import Player from '../models/Player';
import InventoryItem from '../models/InventoryItem';
import { POINTER_CURSOR } from '../utils/cursorUtils';
import { SkillType } from '../systems/SkillsSystem';
import { ActionType } from '../types/Actions';

export default class UIScene extends Phaser.Scene {
  NB_INVENTORY_SLOT: number = 7;

  emitter: EventDispatcher = EventDispatcher.getInstance();

  player: Player;
  hud: Phaser.GameObjects.Image;
  map: Phaser.GameObjects.Image;
  skillsText: { [key: string]: Phaser.GameObjects.Text } = {};
  inventorySlots: Phaser.GameObjects.Image[] = [];
  inventorySlotsQuantity: Phaser.GameObjects.Text[] = [];
  inventoryItems: Phaser.GameObjects.Sprite[] = [];

  constructor() {
    super('UIScene');
  }

  init(data: { player: Player }) {
    this.player = data.player;

    // Update Skills HUD
    this.emitter.on(ActionType.SKILL_INCREASE, () => {
      const farmingSkill = this.player.skills.get(SkillType.FARMING);
      const newLabel = `Farming (lvl ${farmingSkill.level}): ${farmingSkill.xp} / ${farmingSkill.xpLevel} xp.`
      
      this.skillsText[SkillType.FARMING].setText(newLabel);
    });
  }

  create() {
    // Create HUD
    this._createHUD();

    // Create mini Map
    this.map = this.add.image(this.scale.width - 75, 80, 'ui.map');
    this.map.setInteractive({ cursor: POINTER_CURSOR });

    // Create Inventory
    this._createInventory();
  }

  private _createHUD() {
    this.hud = this.add.image(110, this.scale.height - 40, 'ui.hud');
    this.hud.setInteractive({ cursor: POINTER_CURSOR });

    // Skills
    // Farming
    const farmingSkill = this.player.skills.get(SkillType.FARMING);
    const label = `Farming (lvl ${farmingSkill.level}): ${farmingSkill.xp} / ${farmingSkill.xpLevel} xp.`
    this.skillsText[SkillType.FARMING] = this.add.text(20, this.scale.height - 100, label, {
      fontSize: 13,
    });
  }

  private _createInventory() {
    const x = this.scale.width / 2 - (this.NB_INVENTORY_SLOT * 40 / 2);
    const y = this.scale.height - 30;

    // Background
    this.add.image(x + 130, y, 'ui.inventory');

    for (let i=0; i < this.NB_INVENTORY_SLOT; i++) {
      const slotX = x + (i*43.5);

      // Create inventory slot
      const slot = this.add.image(slotX, y, 'ui.slot');
      slot.setInteractive({ cursor: POINTER_CURSOR });
    
      slot.on('pointerover', () => {
        slot.setTint(0x999999);
      });
      slot.on('pointerout', () => {
        slot.clearTint();
      });
      slot.on('pointerdown', () => {
        this.emitter.emit('ui.slot.select', slot, i);
      });

      this.inventorySlots.push(slot);

      // Create slot quantity
      const slotQuantity = this.add.text(slotX + 3, y + 5, 'x0', { fontSize: '10px' });
      slotQuantity.setVisible(false);
      this.inventorySlotsQuantity.push(slotQuantity);
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

    inventory.items.forEach((inventoryItem: InventoryItem, index: number) => {
      const slotItemSprite = this.inventoryItems[index];
      const slotQuantity = this.inventorySlotsQuantity[index];

      // Create item slot
      if (!slotItemSprite) {
        const itemSprite = this.add.sprite(x + (index*40), y, inventoryItem.item.texture, inventoryItem.item.frame);
        this.inventoryItems[index] = itemSprite;
      }
      // Update item slot
      else {
        slotItemSprite.setTexture(inventoryItem.item.texture, inventoryItem.item.frame);

        // Update slot quantity
        if (inventoryItem.quantity > 1) {
          slotQuantity.setText(`x${inventoryItem.quantity}`);
          slotQuantity.setDepth(10);
          slotQuantity.setVisible(true);
        } else {
          slotQuantity.setVisible(false);
        }
      }
    });
  }

}