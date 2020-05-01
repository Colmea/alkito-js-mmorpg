import { ActionType, ServerEvent } from "../types/Actions";
import EventDispatcher from "./EventDispatcher";
import GameState from "./GameState";
import EventListener from './EventListenerInterface';
import { ChatMessage } from "../types/Chat";

export default class ServerConnectorService implements EventListener {
    server: any;
    gameState: GameState;
    emitter: EventDispatcher;

    constructor(server: any, gameState: GameState, eventEmitter: EventDispatcher) {
        this.server = server;
        this.gameState = gameState;
        this.emitter = eventEmitter;
    }

    public listen() {
        this.listenServerEvents();
        this.listenActions();
    }

    listenActions() {
        this.emitter.on(ActionType.CHAT_SEND_MESSAGE, (chatmessage: ChatMessage) => {
            this.server.emit('chat.sendNewMessage', chatmessage);
        });
    }

    listenServerEvents() {
        this.server.on('chat.newMessage', (newMessage: ChatMessage) => {
            this.emitter.emit(ServerEvent.CHAT_NEW_MESSAGE, newMessage);
        });
    }





    
}