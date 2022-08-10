import * as CONFIG from '../gameConfig.json';

export default class Mover {
    MAX_SPEED: number = 120;

    scene: Phaser.Scene;
    navMesh: any;
    path: Phaser.Geom.Point[];
    currentTarget: Phaser.Geom.Point;
    body: Phaser.Physics.Arcade.Body;

    constructor(scene: Phaser.Scene, navMesh: any, body: Phaser.Physics.Arcade.Body) {
      this.navMesh = navMesh;
      this.path = null;
      this.currentTarget = null;
      this.scene = scene;
      this.body = body;
  
      scene.events.on("update", this.update, this);
      scene.events.once("shutdown", this.destroy, this);
    }
  
    goTo(tile: Phaser.Tilemaps.Tile) {
      const targetPoint = new Phaser.Math.Vector2(tile.pixelX + CONFIG.TILE_SIZE / 2, tile.pixelY + CONFIG.TILE_SIZE / 2);
      // Find a path to the target
      this.path = this.navMesh.findPath(new Phaser.Math.Vector2(this.body.x + this.body.width/2, this.body.y + this.body.height/2), targetPoint);

      // DEBUG PATH
    //   this.navMesh.debugDrawPath(this.path, 0xffd900);

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
            const distance = Phaser.Math.Distance.Between(this.body.x + this.body.width/2, this.body.y + this.body.height/2, x, y);

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
                        this.body.reset(x, y);
                    });
                }
            }

            // If target, move towards
            if (this.currentTarget) this.moveTowards(this.currentTarget, this.MAX_SPEED, deltaTime / 1000);
        }
    }
  
    private moveTowards(targetPosition: Phaser.Geom.Point, maxSpeed: number = 200, elapsedSeconds: number) {        
        const { x, y } = targetPosition;
        const xEnd = x - this.body.width/2;
        const yEnd = y - this.body.height/2;

        const angle = Phaser.Math.Angle.Between(this.body.x, this.body.y, xEnd, yEnd);
        const distance = Phaser.Math.Distance.Between(this.body.x, this.body.y, xEnd, yEnd);
        const targetSpeed = distance / elapsedSeconds;
        const magnitude = Math.min(maxSpeed, targetSpeed);

        this.scene.physics.velocityFromRotation(angle, magnitude, this.body.velocity);
    }
  
    destroy() {
      if (this.scene) this.scene.events.off("update", this.update, this);
    }
  }