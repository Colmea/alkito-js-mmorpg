import { ActionType } from '../../types/Actions';
import { POINTER_CURSOR } from '../../utils/cursorUtils';

type ClickCallback = (pointer?: Phaser.Input.Pointer, x?: number, y?: number, e?: MouseEvent) => void;
export type Action = {
  id: string,
  name: string,
  iconFrame: number | string,
  onClick: ClickCallback,
};

export default class UIActions extends Phaser.GameObjects.Container {
  visible: boolean = false;

  icon: Phaser.GameObjects.Sprite;
  background: Phaser.GameObjects.Image;
  onClickCallback: ClickCallback = () => {};
  actions: {
    background: Phaser.GameObjects.Image,
    icon: Phaser.GameObjects.Sprite,
    onClickCallback: ClickCallback,
  }[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number, actions: Action[]) {
    super(scene, x, y);

    actions.forEach((action: Action, index: number) => {
      const left = index * 30;
      const background = new Phaser.GameObjects.Image(this.scene, left, 0, 'ui.slot-round');
      background.setScale(.1);
      const icon = new Phaser.GameObjects.Sprite(this.scene, left -6, 0, 'icons', action.iconFrame);
      icon.setScale(.5);
      icon.setInteractive({ cursor: POINTER_CURSOR });

      const newAction = {
        background,
        icon,
        onClickCallback: action.onClick,
      };

      this.actions.push(newAction);
      this.scene.add.existing(background);
      this.scene.add.existing(icon);
      this.add(background);
      this.add(icon);

      // Events
      newAction.icon.on('pointerover', () => {
        icon.setScale(.7);
      });

      newAction.icon.on('pointerout', () => {
        icon.setScale(.5);
      });

      newAction.icon.on('pointerdown', (pointer: Phaser.Input.Pointer, x: number, y: number, e: MouseEvent) => {
        // stop propagation
        e.stopPropagation();

        newAction.onClickCallback(pointer, x, y, e);
      });
    });
  }

  public setVisible(newVisible: boolean): this {
    if (this.visible === newVisible) return this;

    if (newVisible) super.setVisible(newVisible);
 
    const animScale = newVisible ? { from: .1, to: 1 } : { from: 1, to: .1 };
    const animY = newVisible ? { from: 0, to: -50 } : { from: -50, to: 0 };

    const tween = this.scene.tweens.add({
        targets: this,
        scale: animScale,
        y: animY,
        ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 100,
        onComplete: () => {
          if (!newVisible) super.setVisible(newVisible);
        },
    });

    return this;
  }

  public onClick(callback: ClickCallback) {
    this.onClickCallback = callback;
  }
}