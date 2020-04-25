import { POINTER_CURSOR } from "../../utils/cursorUtils";

type ClickCallback = (pointer: Phaser.Input.Pointer) => void;

export default class SquareButton extends Phaser.GameObjects.Container {
  
  background: Phaser.GameObjects.Image;
  icon: Phaser.GameObjects.Image;
  clickCallback: ClickCallback = () => {};

  constructor(scene: Phaser.Scene, x: number, y: number, clickCallback: ClickCallback = () => {}) {
    super(scene, x, y);
  
    this.clickCallback = clickCallback;

    // Create background
    this.background = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ui.menu-button').setInteractive({ cursor: POINTER_CURSOR });
    this.scene.add.existing(this.background);
    this.add(this.background);

    // Create icon
    // ...
    
    // on Hover
    this.background.on('pointerover', this.handleHover.bind(null, true));
    this.background.on('pointerout', this.handleHover.bind(null, false));
    // on Click
    this.background.on('pointerdown', this.handleClick);
  }

  onClick(clickCallback: ClickCallback) {
    this.clickCallback = clickCallback;
  }

  handleHover = (isHovered: boolean) => {
    if (isHovered)
      this.background.setTint(0x999999);
    else
      this.background.clearTint();
  }

  handleClick = (pointer: Phaser.Input.Pointer) => {
    this.clickCallback(pointer);
  }

  setFocus(isFocused: boolean = true): SquareButton {
    this.background.setTexture(isFocused ? 'ui.menu-button-active' : 'ui.menu-button');

    return this;
  }
}