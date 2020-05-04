import { ActionType, ServerEvent } from "../types/Actions";
import EventDispatcher from "./EventDispatcher";
import EventListener from './EventListenerInterface';
import { ChatMessage } from "../types/Chat";
import { Tilemaps } from "phaser";
import Player from "../models/Player";
import WorldScene from "../scenes/WorldScene";

export default class ServerConnectorService implements EventListener {
    server: any;
    world: WorldScene;
    emitter: EventDispatcher;

    constructor(server: any, world: WorldScene, eventEmitter: EventDispatcher) {
        this.server = server;
        this.world = world;
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
        this.emitter.on(ActionType.ENTITY_GO_TO, (player: Player, tile: Tilemaps.Tile) => {
            this.server.emit('playerMove', tile.x, tile.y);
        });
    }

    listenServerEvents() {
        // # Entity/moved
        this.server.on('playerMoved', (player: any) => {
            const playerToMove = (player.id === this.world.player.id) ? this.world.player : this.world.otherPlayers[player.id];
            const tile = this.world.map.getTileAt(player.x, player.y, false, this.world.mapLayers['grass']);
    
            this.world.entityActions.processNow(playerToMove, { type: ServerEvent.ENTITY_MOVED, args: [tile] });
        });

        // # Chat/new-message
        this.server.on('chat.newMessage', (newMessages: ChatMessage[]) => {
            this.emitter.emit(ServerEvent.CHAT_NEW_MESSAGE, newMessages);
        });
    }





    
}