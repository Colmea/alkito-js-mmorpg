import EventDispatcher from './EventDispatcher';

export default interface EventListener {
    emitter: EventDispatcher;

    listen(): void;
}