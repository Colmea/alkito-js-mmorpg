import EventDispatcher from './EventDispatcher';
import Entity from '../models/Entity';
import { ActionType } from '../types/Actions';

enum ActionStatus {
    PENDING,
    RUNNING,
    COMPLETED,
}

export interface EntityAction {
    status: ActionStatus;
    type: string;
    startedDate: number;
    args?: any;
    progress?: (action: EntityAction, entity: Entity) => number;
    isCompleted?: (action: EntityAction, entity: Entity) => boolean;
}

export type PendingEntityAction = Pick<EntityAction, 'type' | 'args' | 'isCompleted' | 'progress'>;

let instance: EntityActionManager;
export default class EntityActionManager {
    THICK_TIMER = 100;

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

    processNow(entity: Entity, action: PendingEntityAction) {
        // Register entity
        this.entities[entity.id] = entity;

        // Clear queue and add actoin
        this.actionsQueue[entity.id] = [this._createAction(action)];
    }

    enqueue(entity: Entity, action: PendingEntityAction) {
        // Register entity
        this.entities[entity.id] = entity;
        // Create empty queue for this entity if needed
        if (!this.actionsQueue[entity.id]) this.actionsQueue[entity.id] = [];

        this.actionsQueue[entity.id].push(this._createAction(action));
    }

    update = () => {
        for (let entityId in this.actionsQueue) {
            const entityActions = this.actionsQueue[entityId];

            // If no pending action for this entity, continue
            // @TODO Remove entity from actionsQueue list if empty
            if (entityActions.length <= 0) {
                continue;
            }

            const nextAction = entityActions[0];

            // Wait until current action is completed
            if (nextAction.status === ActionStatus.RUNNING) {
                if (nextAction.progress && typeof nextAction.progress === 'function') {
                    const progress = nextAction.progress(nextAction, this.entities[entityId]);
                    this.emitter.emit(ActionType.ACTION_PROGRESS, this.entities[entityId], progress, ...nextAction.args);
                }

                if (nextAction.isCompleted(nextAction, this.entities[entityId])) {
                    entityActions.shift();
                }

                continue;
            }
            
            // If no action running, process first action in the queue
            this._processAction(this.entities[entityId], entityActions[0]);
        }

        setTimeout(this.update, this.THICK_TIMER);
    }

    private _processAction(entity: Entity, action: EntityAction) {
        action.status = ActionStatus.RUNNING;
        action.startedDate = Date.now();
        this.emitter.emit(action.type, entity, ...action.args);
    }

    private _createAction(action: PendingEntityAction): EntityAction {
        const newAction = { ...action } as EntityAction;

        newAction.status = ActionStatus.PENDING;
        newAction.isCompleted = newAction.isCompleted ? newAction.isCompleted : () => (true);

        return newAction;
    }

    destroy() {
        if (this.scene) this.scene.events.off('update', this.update, this);
    }

}