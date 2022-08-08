import "phaser";
import React from "react";
import EventDispatcher from "../services/EventDispatcher";
import Player from "../models/Player";
import InventoryItem from "../models/InventoryItem";
import { POINTER_CURSOR } from "../utils/cursorUtils";
import { SkillType } from "../systems/SkillsSystem";
import { ActionType, ServerEvent } from "../types/Actions";
import * as CONFIG from "../gameConfig";
import SquareButton from "../models/ui/SquareButton";
import ProfessionPopup from "../ui-components/common/ProfessionPopup";
import ChatPopup from "../ui-components/common/ChatPopup";
import { ChatMessage } from "../types/Chat";
import NotificationManager from "../services/NotificationManager";
import NotificationContainer from "../ui-components/NotificationsContainer";

type MapLayer = Phaser.Tilemaps.TilemapLayer;

export default class UIScene extends Phaser.Scene {
  NB_INVENTORY_SLOT: number = 7;

  emitter: EventDispatcher = EventDispatcher.getInstance();
  player: Player;
  hud: Phaser.GameObjects.Image;
  mapLayer: MapLayer;
  map: {
    x: number;
    y: number;
    bg: Phaser.GameObjects.Image;
    minimap: Phaser.GameObjects.Image;
    cursor: Phaser.GameObjects.Text;
  };
  menu: Phaser.GameObjects.Container;
  skillsText: { [key: string]: Phaser.GameObjects.Text } = {};
  inventorySlots: Phaser.GameObjects.Image[] = [];
  inventorySlotsQuantity: Phaser.GameObjects.Text[] = [];
  inventoryItems: Phaser.GameObjects.Sprite[] = [];
  chatMessages: ChatMessage[] = [];

  notificationManager: NotificationManager = new NotificationManager();

  // ui components
  popup: any;
  popupChat: any;
  notificationsContainer: any;

  constructor() {
    super("UIScene");
  }

  init(data: { player: Player; mapLayer: MapLayer }) {
    this.player = data.player;
    this.mapLayer = data.mapLayer;
  }

  getMinimapPosition() {
    const minimapScalingFactor =
      (this.mapLayer.width * CONFIG.TILE_SIZE) /
      (this.map.minimap.width * this.map.minimap.scaleX);
    const playerXOffsetFromCenter =
      this.player.x / CONFIG.TILE_SIZE - this.mapLayer.width / 2;
    const playerYOffsetFromCenter =
      this.player.y / CONFIG.TILE_SIZE - this.mapLayer.height / 2;

    const playerOffsetXMap =
      (playerXOffsetFromCenter * CONFIG.TILE_SIZE) / minimapScalingFactor;
    const playerOffsetYMap =
      (playerYOffsetFromCenter * CONFIG.TILE_SIZE) / minimapScalingFactor;

    return {
      x: this.map.x - playerOffsetXMap,
      y: this.map.y - playerOffsetYMap,
    };
  }

  create() {
    // Create HUD
    this._createHUD();
    // Create Minimap
    this._createMinimap();
    // Create Menu
    this._createMenu();
    // Create Popup
    this._createPopup();
    // Create Notifications container
    this._createNotificationsContainer();
    // Create Inventory
    this._createInventory();
  }

  update() {
    const minimapPos = this.getMinimapPosition();
    this.map.minimap.setPosition(minimapPos.x, minimapPos.y);
  }

  private _createHUD() {
    this.hud = this.add.image(110, this.scale.height - 40, "ui.hud");
    this.hud.setInteractive({ cursor: POINTER_CURSOR });
  }

  handleClosePopup = () => {
    this.data.set("currentPanel", null);
  };

  handleSendChatMessage = (message: string) => {
    const newMessage: ChatMessage = {
      author: this.player.unitName,
      message: message,
      creationDate: Date.now(),
      image: this.player.avatar,
    };

    this.emitter.emit(ActionType.CHAT_SEND_MESSAGE, newMessage);
  };

  private _createNotificationsContainer() {
    this.notificationsContainer = this.add.reactDom((props) => (
      <NotificationContainer
        {...props}
        notifs={this.notificationManager.notifs}
      />
    ));

    this.notificationManager.onUpdate(() => {
      this.notificationsContainer.setState({
        notifs: this.notificationManager.notifs,
      });
    });

    this.notificationManager.listen();
  }

  private _createPopup() {
    const farmingSkill = this.player.skills.get(SkillType.FARMING);

    this.popup = this.add.reactDom((props) => (
      <ProfessionPopup
        skills={this.player.skills.getAll()}
        isVisible={false}
        onClose={this.handleClosePopup}
        {...props}
      />
    ));

    this.emitter.on(ActionType.SKILL_INCREASE, () => {
      this.popup.setState({
        skills: this.player.skills.getAll(),
      });
    });

    // Chat Popup
    this.popupChat = this.add.reactDom((props) => (
      <ChatPopup
        messages={this.chatMessages}
        onSend={this.handleSendChatMessage}
        {...props}
      />
    ));

    this.emitter.on(
      ServerEvent.CHAT_NEW_MESSAGE,
      (newMessages: ChatMessage[]) => {
        this.chatMessages = [...this.chatMessages, ...newMessages];

        this.popupChat.setState({
          messages: this.chatMessages,
        });
      }
    );
  }

  private _createMinimap() {
    const mapX = this.scale.width - 75;
    const mapY = 80;

    // Create mini Map
    this.map = {
      x: mapX,
      y: mapY,
      minimap: this.add.image(mapX, mapY, "ui.minimap"),
      bg: this.add.image(mapX, mapY, "ui.map"),
      cursor: this.add.text(mapX - 4, mapY - 7, "ʘ", {
        color: "white",
      }),
    };

    this.map.minimap.setScale(0.2);
    const minimapPos = this.getMinimapPosition();
    this.map.minimap.setPosition(minimapPos.x, minimapPos.y);

    // Set minimap mask
    const mapMask = this.make.image({
      x: this.map.x,
      y: this.map.y,
      key: "ui.map-mask",
      add: false,
    });
    this.map.minimap.mask = new Phaser.Display.Masks.BitmapMask(this, mapMask);
  }

  private _createMenu() {
    this.data.set("currentPanel", null);

    // Create menu
    this.menu = this.add.container(this.map.x + 42, this.map.y + 96);

    const button1 = new SquareButton(this, 0, 0, "ui.icon-skills");
    const button2 = new SquareButton(this, 0, 50);

    button1.onClick(() => {
      this.data.set("currentPanel", "skills");
    });
    button2.onClick(() => {
      this.data.set("currentPanel", "player");
    });

    this.data.events.on("changedata", () => {
      const currentPanel = this.data.get("currentPanel");

      switch (currentPanel) {
        case "skills": {
          button1.setFocus(true);
          button2.setFocus(false);
          this.popup.setState({ isVisible: true });
          break;
        }
        case "player": {
          button1.setFocus(false);
          button2.setFocus(true);
          this.popup.setState({ isVisible: false });
          break;
        }
        default: {
          button1.setFocus(false);
          button2.setFocus(false);
          this.popup.setState({ isVisible: false });
        }
      }
    });

    this.menu.add(this.add.image(0, 0, "ui.menu"));
    this.menu.add(button1);
    this.menu.add(button2);
  }

  private _createInventory() {
    const x = this.scale.width / 2 - (this.NB_INVENTORY_SLOT * 40) / 2;
    const y = this.scale.height - 30;

    // Background
    this.add.image(x + 130, y, "ui.inventory");

    for (let i = 0; i < this.NB_INVENTORY_SLOT; i++) {
      const slotX = x + i * 43.5;

      // Create inventory slot
      const slot = this.add.image(slotX, y, "ui.slot");
      slot.setInteractive({ cursor: POINTER_CURSOR });

      slot.on("pointerover", () => {
        slot.setTint(0x999999);
      });
      slot.on("pointerout", () => {
        slot.clearTint();
      });
      slot.on("pointerdown", () => {
        this.emitter.emit("ui.slot.select", slot, i);
      });

      this.inventorySlots.push(slot);

      // Create slot quantity
      const slotQuantity = this.add.text(slotX + 3, y + 5, "x0", {
        fontSize: "10px",
      });
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
    const x = this.scale.width / 2 - (this.NB_INVENTORY_SLOT * 40) / 2;
    const y = this.scale.height - 30;

    inventory.items.forEach((inventoryItem: InventoryItem, index: number) => {
      const slotItemSprite = this.inventoryItems[index];
      const slotQuantity = this.inventorySlotsQuantity[index];

      // Create item slot
      if (!slotItemSprite) {
        const itemSprite = this.add.sprite(
          x + index * 40,
          y,
          inventoryItem.item.texture,
          inventoryItem.item.frame
        );
        itemSprite.setDisplaySize(32, 32);
        this.inventoryItems[index] = itemSprite;

        // Update slot quantity
        if (inventoryItem.quantity > 1) {
          slotQuantity.setText(`x${inventoryItem.quantity}`);
          slotQuantity.setDepth(10);
          slotQuantity.setVisible(true);
        } else {
          slotQuantity.setVisible(false);
        }
      }
      // Update item slot
      else {
        slotItemSprite.setTexture(
          inventoryItem.item.texture,
          inventoryItem.item.frame
        );

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
