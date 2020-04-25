import 'phaser';
import { v4 as uuid } from 'uuid';
import * as CONFIG from '../gameConfig';
import { getTilePosition } from '../utils/tileUtils';
import Mover from '../systems/Mover';
import WorldScene from '../scenes/WorldScene';
import EventDispatcher from '../managers/EventDispatcher';
import EntityActionManager, { EntityAction } from '../managers/EntityActionManager';
import UIActions from './ui/UIActions';
import { ActionType } from '../types/Actions';
import { getPositionBetweenPoints } from '../utils/positionUtils';
import { Position } from '../types/Positions';
import ProgressBar from './ui/ProgressBar';
import { POINTER_CURSOR } from '../utils/cursorUtils';

export enum EntityType {
    PLAYER,
    PNJ,
    ENEMY,
    OBJECT,
};

export default class Entity extends Phaser.GameObjects.Container {
    // Info
    id: string = uuid();
    unitType: EntityType;
    unitName: string;
    hp: number = 100;
    damage: number = 10;
    isMoving: boolean = true;

    // States
    isSelected: boolean = false;

    // Systems
    scene: WorldScene;
    emitter: EventDispatcher = EventDispatcher.getInstance();;
    actions: EntityActionManager = EntityActionManager.getInstance();
    follower: Mover;
    body: Phaser.Physics.Arcade.Body;
    unitSprite: Phaser.GameObjects.Sprite;
    nameText: Phaser.GameObjects.Text;

    ui: {
        actionIcon: UIActions;
        progressBar: ProgressBar;
    };
    
    constructor(
        scene: WorldScene,
        xTile: number,
        yTile: number,
        navMesh: any,
        texture: string,
        frame: number = 1,
    ) {
        super(scene, getTilePosition(xTile, yTile).x, getTilePosition(xTile, yTile).y);

        this.setSize(CONFIG.TILE_SIZE, CONFIG.TILE_SIZE);
        this.scene.physics.world.enable(this);
        
        scene.add.existing(this);

        // Create Unit sprite
        this._createUnitSprite(navMesh, texture, frame);
        // Create name info
        this._createName();
        this._createUI();

        // Register update loop
        scene.events.on('update', this.update, this);
    }

    set name(name: string) {
        this.unitName = name;

        if (this.nameText)
            this.nameText.setText(this.unitName);
    }

    private _createUnitSprite(navMesh: any, texture: string, frame: number) {
        this.unitSprite = new Phaser.GameObjects.Sprite(this.scene, 0, 0, texture, frame);
        this.unitSprite.setInteractive({ cursor: POINTER_CURSOR });

        this.scene.add.existing(this.unitSprite);
        this.add(this.unitSprite);

        this.unitSprite.on('pointerover', () => {
            this.unitSprite.setTint(0x999999);
            this.nameText.setVisible(true);
        });
    
        this.unitSprite.on('pointerout', () => {
            if (!this.isSelected) {
                this.unitSprite.clearTint();
                this.nameText.setVisible(false);
            }
        });

        this.unitSprite.on('pointerdown', (pointer, x, y, e) => {
            // stop propagation (void detect click on map)
            e.stopPropagation();
 
            this.emitter.emit('unit.select', this);
        });

        // Register "follower" behavior
        this.follower = new Mover(this.scene, navMesh, this.body);
    }

    private _createUI() {
        this.ui = {
            actionIcon: new UIActions(this.scene, 0, -50, ActionType.TAKE),
            progressBar: new ProgressBar(this.scene, 0, -40),
        };

        this.add(this.ui.actionIcon);
        this.add(this.ui.progressBar);
    
        this.ui.actionIcon.onClick(() => {
            const playerPos = new Phaser.Geom.Point(this.scene.player.body.x, this.scene.player.body.y);

            // Find tile next to object and move player
            const tileNextToObject = this.getNearestFreeTile(playerPos);
            this.emitter.emit('unit.select', this, false);

            this.actions.enqueue(this.scene.player, {
                type: 'go-to',
                args: [tileNextToObject],
                isCompleted: (action: EntityAction, player: Entity) => {
                    const playerTile = player.getTile();

                    // Move is completed when player's tile = tile next to object
                    return (player.getTile() === tileNextToObject);
                }
            });

            const timeToCollect = 3000;
            this.actions.enqueue(this.scene.player, {
                type: 'collect', args: [this],
                progress: (action: EntityAction) => {
                    const elapsedTime = Date.now() - action.startedDate;

                    return Math.floor(elapsedTime / timeToCollect * 100)
                },
                isCompleted: (action: EntityAction) => {
                    const elapsedTime = Date.now() - action.startedDate;
                    return elapsedTime >= timeToCollect;
                },
            });
            this.actions.enqueue(this.scene.player, {
                type: 'take', args: [this],
            });
        });
    }

    private _createName() {
        this.nameText = new Phaser.GameObjects.Text(this.scene, 0, 0, this.unitName, {
            fontSize: '8',
        });
        this.nameText.setOrigin(0.5, 2.4);
        this.nameText.visible = false;


        this.scene.add.existing(this.nameText);
        this.add(this.nameText);
    }

    public goTo(tileDestination: Phaser.Tilemaps.Tile) {
        if (this.follower) {
            this.follower.goTo(tileDestination);
        }
    }

    public attack(target: Entity) {
        target.takeDamage(this.damage);      
    }

    public takeDamage(damage: number) {
        this.hp -= damage;        
    }

    public select(isSelected: boolean) {
        this.isSelected = isSelected;
        this.ui.actionIcon.setVisible(isSelected);

        if (isSelected) {
            this.unitSprite.setTint(0x999999);
            this.nameText.setVisible(true);
        }
        else {
            this.unitSprite.clearTint();
            this.nameText.setVisible(false);
        }
    }

    /**
     * Return entity's current tile.
     */
    public getTile() {
        let x = this.x;
        let y = this.y;

        return this.scene.map.getTileAtWorldXY(x, y, false, this.scene.cameras.main, this.scene.mapLayers['grass']);
    }

    /**
     * Find nearest free tile next to entity, from a 'from' point to this entity.
     * Used mainly to move an entity next to another.
     * @param from if not provided, engine will always choose tile at the *right*
     */
    public getNearestFreeTile(from?: Phaser.Geom.Point) {
        let nearestTilePoint: Phaser.Geom.Point;
        let nearestTilePosition: Position = Position.RIGHT;
        const entityPos = new Phaser.Geom.Point(this.x, this.y);

        // If 'from', find nearest tile position
        if (from) {
            nearestTilePosition = getPositionBetweenPoints(entityPos, from);
        }
       
        // Calculate nearest tile following nearestTilePosition
        switch (nearestTilePosition) {
            case Position.RIGHT:
                nearestTilePoint = new Phaser.Geom.Point(entityPos.x + CONFIG.TILE_SIZE, entityPos.y);
                break;
            case Position.LEFT:
                nearestTilePoint = new Phaser.Geom.Point(entityPos.x - CONFIG.TILE_SIZE, entityPos.y);
                break;
            case Position.UP:
                nearestTilePoint = new Phaser.Geom.Point(entityPos.x, entityPos.y - CONFIG.TILE_SIZE);
                break;
            case Position.DOWN:
                nearestTilePoint = new Phaser.Geom.Point(entityPos.x, entityPos.y + CONFIG.TILE_SIZE);
                break;
        }
        
        return this.scene.map.getTileAtWorldXY(nearestTilePoint.x, nearestTilePoint.y, false, this.scene.cameras.main, this.scene.mapLayers['grass']);
    }

    /**
     * Look at a specific entity
     * @param entity
     */
    public lookAt(entity: Entity) {
      const currentTile = this.getTile();
      const targetTile = entity.getTile();
      const distanceY = Math.abs(targetTile.y - currentTile.y);
      const distanceX = Math.abs(targetTile.x - currentTile.x);

      // Start direction animation
      if (targetTile.y > currentTile.y && distanceY > distanceX) {
        this.unitSprite.play('down', true);
      }
      else if (targetTile.y < currentTile.y && distanceY > distanceX) {
        this.unitSprite.play('up', true);
      }
      else if (targetTile.x > currentTile.x) {
        this.unitSprite.play('right', true);
      }
      else if (targetTile.x < currentTile.x) {
        this.unitSprite.play('left', true);
      }

      // And stop it (we just need the entity to look at the target)
      this.unitSprite.anims.stop();
    }

    public displayProgress(progress: number) {
        this.ui.progressBar.setVisible(true);
        this.ui.progressBar.setProgress(progress);

        // If progress 100%, hide it atfer x seconds
        if (progress >= 100) {
            setTimeout(() => {
                this.ui.progressBar.setVisible(false)
            }, 50);
        }
    }

    update() {
      if (!this.isMoving) return;

      // Animate player following current velocity
      const velocity = this.body.velocity;
      if (velocity.y > 0 && Math.abs(velocity.y) > Math.abs(velocity.x)) {
          this.unitSprite.play('down', true);
      }
      else if (this.body.velocity.y < 0 && Math.abs(velocity.y) > Math.abs(velocity.x)) {
          this.unitSprite.play('up', true);
      }
      else if (velocity.x > 0) {
          this.unitSprite.play('right', true);
      }
      else if (this.body.velocity.x < 0) {
          this.unitSprite.play('left', true);
      }
      else {
          this.unitSprite.anims.stop();
      }
    }
}