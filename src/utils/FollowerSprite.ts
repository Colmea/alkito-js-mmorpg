class FollowerSprite extends Phaser.GameObjects.Sprite {
    MAX_SPEED: number = 120;

    navMesh: any;
    path: Phaser.Geom.Point[];
    currentTarget: Phaser.Geom.Point;
    body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, x: number, y: number, navMesh: any) {
      super(scene, x, y, "player", 1);
  
      this.navMesh = navMesh;
      this.path = null;
      this.currentTarget = null;
      this.scene = scene;
  
      // Enable arcade physics for moving with velocity
      scene.physics.world.enable(this);
  
      scene.add.existing(this);
      scene.events.on("update", this.update, this);
      scene.events.once("shutdown", this.destroy, this);
    }
  
    goTo(targetPoint) {
      // Find a path to the target
      this.path = this.navMesh.findPath(new Phaser.Math.Vector2(this.x, this.y), targetPoint);
  
      // If there is a valid path, grab the first point from the path and set it as the target
      if (this.path && this.path.length > 0) this.currentTarget = this.path.shift();
      else this.currentTarget = null;
    }
  
    update(time: number, deltaTime: number) {
        if (!this.body) return;
        
        // Stop any previous movement
        this.body.velocity.set(0);

        if (this.currentTarget) {
            const { x, y } = this.currentTarget;
            const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);

            // If we approach current target
            if (distance < 4) {
                // Move to next path checkpoint (if one available)
                if (this.path.length > 0) {
                    this.currentTarget = this.path.shift();
                }
                // Otherwise => End of move
                // => Clear target, and stop body
                else {
                    this.currentTarget = null;
                    this.body.stop();
        
                    // This is a workaround to reset position *after* next thick
                    // because body still has velocity and will move a little after this tick.
                    // @TODO check if prettier solution available.
                    setTimeout(() => {
                        this.setPosition(x, y);
                    });
                }
            }

            // If target, move towards
            if (this.currentTarget) this.moveTowards(this.currentTarget, this.MAX_SPEED, deltaTime / 1000);
        }

        // Animate player following current velocity
        const velocity = this.body.velocity;
        if (velocity.y > 0 && Math.abs(velocity.y) > Math.abs(velocity.x)) {
            this.anims.play('down', true);
        }
        else if (this.body.velocity.y < 0 && Math.abs(velocity.y) > Math.abs(velocity.x)) {
            this.anims.play('up', true);
        }
        else if (velocity.x > 0) {
            this.anims.play('right', true);
        }
        else if (this.body.velocity.x < 0) {
            this.anims.play('left', true);
        }
        else {
            this.anims.stop();
        }
    }
  
    moveTowards(targetPosition, maxSpeed = 200, elapsedSeconds) {      
        const { x, y } = targetPosition;

        const angle = Phaser.Math.Angle.Between(this.x, this.y, x, y);
        const distance = Phaser.Math.Distance.Between(this.x, this.y, x, y);
        const targetSpeed = distance / elapsedSeconds;
        const magnitude = Math.min(maxSpeed, targetSpeed);

        this.scene.physics.velocityFromRotation(angle, magnitude, this.body.velocity);
    }
  
    destroy() {
      if (this.scene) this.scene.events.off("update", this.update, this);
      super.destroy();
    }
  }
  
  export default FollowerSprite;