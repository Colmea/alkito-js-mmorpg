import { ActionType, ServerEvent } from "../types/Actions";
import EventDispatcher from "./EventDispatcher";
import EventListener from './EventListenerInterface';
import { ChatMessage } from "../types/Chat";
import { Tilemaps } from "phaser";
import Player from "../models/Player";
import WorldScene from "../scenes/WorldScene";
import OtherPlayer from "../models/OtherPlayer";
import ResourceEntity from "../models/ResourceEntity";

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
        this.emitter.on(ActionType.RESOURCE_COLLECT, (player: Player, resource: ResourceEntity) => {
            this.server.emit('resource.collect', resource.resourceId);
        });
    }

    listenServerEvents() {
        // Player/current-players
        this.server.on('currentPlayers', (players: any) => {
            for (const playerId in players) {
            const otherPlayer = players[playerId];
    
            if (otherPlayer.id === this.world.player.id) continue;
    
            const newPlayer = new OtherPlayer(this.world, otherPlayer.x, otherPlayer.y, this.world.navMesh);
            newPlayer.name = otherPlayer.name;
            this.world.otherPlayers[otherPlayer.id] = newPlayer;
            }
        });

        // Resources/current-resources
        this.server.on('currentResources', (resources: any) => {
            // Create Resources from data map
            Object.values(resources).forEach((object: any) => {
                const tile =  this.world.map.getTileAtWorldXY(object.x, object.y, false, this.world.cameras.main, this.world.mapLayers['grass']);
                const resource = new ResourceEntity(this.world, tile.x, tile.y, object.type);
                resource.grow(object.level);
                resource.resourceId = object.id;

                this.world.resources[object.id] = resource;
            });
        });

        // Player/new-player
        this.server.on('newPlayer', (newPlayer: any) => {
            const player = new OtherPlayer(this.world, newPlayer.x, newPlayer.y, this.world.navMesh);
            player.name = newPlayer.name;
            this.world.otherPlayers[newPlayer.id] = player;
        });

        // player/disconnected
        this.server.on('playerDisconnected', (disconnectedPlayer: any) => {
            const player = this.world.otherPlayers[disconnectedPlayer.id];
            player.destroy(true);
    
            delete this.world.otherPlayers[disconnectedPlayer.id];
        });

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

        // # Resource/grown
        this.server.on('resource.grown', (resourceId: string, newLevel: number) => {
            this.world.resources[resourceId].grow(newLevel);
        });
    }





    
}