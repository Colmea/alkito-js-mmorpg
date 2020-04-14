export default class ProgressBar extends Phaser.GameObjects.Container {
  BAR_WIDTH: number = 8;
  NB_BARS = 8;

  visible: boolean = false;
  background: Phaser.GameObjects.Image;
  progress: Phaser.GameObjects.Image[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    
    this.setDepth(9999999999);
    this.setScale(.1);

    // Add background
    this.background = new Phaser.GameObjects.Image(this.scene, 0, 0, 'ui.progress-bar');
    this.scene.add.existing(this.background);
    this.add(this.background);

    // add progress bars
    const leftProgress = -(this.background.width/2) + 9;
    for (let i=0; i < this.NB_BARS; i++) {
      const image = i === 0 ? 'ui.green-bar-start' : i === this.NB_BARS-1 ? 'ui.green-bar-end' : 'ui.green-bar';

      let left = leftProgress + i*this.BAR_WIDTH;
      if (i === this.NB_BARS-1) left -= 1;

      const progressBar = new Phaser.GameObjects.Image(this.scene, left, 0, image);
      progressBar.visible = false;

      this.scene.add.existing(progressBar);
      this.add(progressBar);
      this.progress.push(progressBar);
    }
   
  }

  public setProgress(progress: number) {
    for (let i=0; i < this.NB_BARS; i++) {
      if (progress >= i*(100/this.NB_BARS)) {
        this.progress[i].setVisible(true);
      } else {
        this.progress[i].setVisible(false);
      }
    }
  }

  public setVisible(newVisible: boolean): this {
    if (this.visible === newVisible) return this;

    if (newVisible) super.setVisible(newVisible);
 
    const animScale = newVisible ? { from: .1, to: 1 } : { from: 1, to: .1 };

    const tween = this.scene.tweens.add({
        targets: this,
        scale: animScale,
        ease: 'Bounce',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
        duration: 100,
        onComplete: () => {
          if (!newVisible) super.setVisible(newVisible);
        },
    });

    return this;
  }
}