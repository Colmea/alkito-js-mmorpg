import { ActionType } from '../../types/Actions';

type ClickCallback = (pointer?: Phaser.Input.Pointer, x?: number, y?: number, e?: MouseEvent) => void;

export default class UIActions extends Phaser.GameObjects.Container {
  visible: boolean = false;
  icon: Phaser.GameObjects.Sprite;
  onClickCallback: ClickCallback = () => {};

  constructor(scene: Phaser.Scene, x: number, y: number, action: ActionType) {
    super(scene, x, y);
      
    this.icon = new Phaser.GameObjects.Sprite(this.scene, 0, 0, 'icons', 5);
    this.icon.setScale(.8);
    this.icon.setInteractive({ useHandCursor: true });

    this.scene.add.existing(this.icon);
    this.add(this.icon);

    this.icon.on('pointerdown', (pointer: Phaser.Input.Pointer, x: number, y: number, e: MouseEvent) => {
      // stop propagation
      e.stopPropagation();

      this.onClickCallback(pointer, x, y, e);
    });
  }

  public setIsVisible(flag: boolean) {
    this.visible = flag;
  }

  public onClick(callback: ClickCallback) {
    this.onClickCallback = callback;
  }
}