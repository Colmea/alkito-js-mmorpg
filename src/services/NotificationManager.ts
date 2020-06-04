import { v1 as uuid } from 'uuid';
import EventDispatcher from './EventDispatcher';
import EventListener from './EventListenerInterface';
import Entity from '../models/Entity';
import { ActionType } from '../types/Actions';
import ResourceEntity from '../models/ResourceEntity';
import Skill from '../models/skills/Skill';

export type Notif = {
    id: string,
    message: string,
    creationDate?: number,
}

export default class NotificationManager implements EventListener {
    NOTIF_LIFETIME_MS = 6000;

    emitter = EventDispatcher.getInstance();
    notifyUpdate: () => void = () => {};
    // Current notifs
    notifs: Notif[] = [];

    listen() {
        setInterval(this.update, 500);

        this.emitter.on(ActionType.RESOURCE_COLLECT, (unit: Entity, resource: ResourceEntity) => {
            this.addNotif(`New ressource collected: ${resource.itemQuantity} x ${resource.item.name}.`);
        });

        this.emitter.on(ActionType.SKILL_LEVEL_UP, (unit: Entity, skill: Skill) => {
            this.addNotif(`Congratulations 🎉\n You just reached the level ${skill.level} in ${skill.name.toUpperCase()}`);
        });
    }

    addNotif(message: string) {
        const newNotif: Notif = {
            id: uuid(),
            message,
            creationDate: Date.now(),
        };

        console.log('add notif', newNotif);
        this.notifs.push(newNotif);
        this.notifyUpdate();
    }

    onUpdate(callback: () => void) {
        this.notifyUpdate = callback;
    }

    update = () => {
        const now = Date.now();

        const newNotifs = [...this.notifs];

        this.notifs.forEach((notif: Notif, index: number) => {
            if (notif.creationDate + this.NOTIF_LIFETIME_MS <= now) {
                newNotifs.splice(index, 1);
            }
        });

        this.notifs = newNotifs;

        this.notifyUpdate();
    }
}