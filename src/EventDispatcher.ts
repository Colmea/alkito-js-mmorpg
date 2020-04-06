let instance: EventDispatcher;

export default class EventDispatcher extends Phaser.Events.EventEmitter {
    constructor() {
        super();
    }

    static getInstance(): EventDispatcher {
        if (!instance) instance = new EventDispatcher();

        return instance;
    }

    emit(event: string | symbol, ...args: any[]): boolean {
        // Log any event in console
        console.groupCollapsed('[Action]', event);
        console.log(...args);
        console.groupEnd();

        return super.emit(event, ...args);
    }
}