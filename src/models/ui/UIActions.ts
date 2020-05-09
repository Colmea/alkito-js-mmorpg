import { ActionType } from '../../types/Actions';
import { POINTER_CURSOR } from '../../utils/cursorUtils';

type ClickCallback = (pointer?: Phaser.Input.Pointer, x?: number, y?: number, e?: MouseEvent) => void;

export default class UIActions extends Phaser.GameObjects.Container {
  visible: boolean = false;
  icon: Phaser.GameObjects.Sprite;
  background: Phaser.GameObjects.Image;
  onClickCallback: ClickCallback = () => {};

  constructor(scene: Phaser.Scene, x: number, y: number, iconFrame: number = 5, onClick = () => {}) {
    super(scene, x, y);

    this.onClickCallback = onClick;
    
    this.background = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ui.slot-round');
    this.background.setScale(1.5);
    this.icon = new Phaser.GameObjects.Sprite(this.scene, -6, 0, 'icons', iconFrame);
    this.icon.setScale(.5);
    this.icon.setInteractive({ cursor: POINTER_CURSOR });

    this.scene.add.existing(this.background);
    this.scene.add.existing(this.icon);
    this.add(this.background);
    this.add(this.icon);

    this.setScale(.1);

    this.icon.on('pointerover', () => {
      this.setScale(1.1);
    });

    this.icon.on('pointerout', () => {
      this.setScale(1);
    });

    this.icon.on('pointerdown', (pointer: Phaser.Input.Pointer, x: number, y: number, e: MouseEvent) => {
      // stop propagation
      e.stopPropagation();

      this.onClickCallback(pointer, x, y, e);
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