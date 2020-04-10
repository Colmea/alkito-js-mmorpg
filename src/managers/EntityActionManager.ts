import EventDispatcher from './EventDispatcher';
import Entity from '../models/Entity';

interface EntityAction {
    type: string;
    args?: any;
    isCompleted?: (entity: Entity) => boolean;
}


let instance: EntityActionManager;
export default class EntityActionManager {
    THICK_TIMER = 200;

    emitter: EventDispatcher = EventDispatcher.getInstance();
    scene: Phaser.Scene;
    entities: { [key: string]: Entity } = {};
    actionsQueue: { [key: string]: EntityAction[] } = {};

    static init(scene: Phaser.Scene): EntityActionManager {
        instance = new EntityActionManager(scene);

        return instance;
    }

    static getInstance(): EntityActionManager {
        if (!instance) throw new Error('EntityActionManager is not initialized.');

        return instance;
    }

    constructor(scene: Phaser.Scene) {
        this.scene = scene;

        this.update();
        // scene.events.on("update", this.update, this);
        // scene.events.once("shutdown", this.destroy, this);
    }

    processNow(entity: Entity, action: EntityAction) {
        // Register entity
        this.entities[entity.id] = entity;

        // Clear queue and add actoin
        this.actionsQueue[entity.id] = [action];
    }

    enqueue(entity: Entity, action: EntityAction) {
        // Register entity
        this.entities[entity.id] = entity;
        // Create empty queue for this entity if needed
        if (!this.actionsQueue[entity.id]) this.actionsQueue[entity.id] = [];

        this.actionsQueue[entity.id].push(action);
    }

    update = () => {
        for (let entityId in this.actionsQueue) {
            const entityActions = this.actionsQueue[entityId];

            // If no pending action for this entity, continue
            // @TODO Remove entity from actionsQueue list if empty
            if (entityActions.length <= 0) {
                continue;
            }

            // Process first action in the queue
            this.processAction(this.entities[entityId], entityActions[0]);
            // Remove this action from the queue
            entityActions.shift();
        }

        setTimeout(this.update, this.THICK_TIMER);
    }

    private processAction(entity: Entity, action: EntityAction) {
        this.emitter.emit('action.' + action.type, entity, ...action.args);
    }

    destroy() {
        if (this.scene) this.scene.events.off("update", this.update, this);
    }

}