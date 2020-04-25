import { ActionType } from "../types/Actions";

let instance: EventDispatcher;

export default class EventDispatcher extends Phaser.Events.EventEmitter {
    static EXCLUDE_FOR_DEBUG: string[] = [
        ActionType.ACTION_PROGRESS,
    ];


    constructor() {
        super();
    }

    static getInstance(): EventDispatcher {
        if (!instance) instance = new EventDispatcher();

        return instance;
    }

    emit(event: string, ...args: any[]): boolean {
        // Log any event in console
        if (!EventDispatcher.EXCLUDE_FOR_DEBUG.includes(event)) {
            console.groupCollapsed('[Action]', event);
            console.log(...args);
            console.groupEnd();
        }

        return super.emit(event, ...args);
    }
}