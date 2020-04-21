import EventDispatcher from './EventDispatcher';
import EventListener from './EventListenerInterface';
import Entity from '../models/Entity';
import ResourceEntity from '../models/ResourceEntity';
import { HasSkills, SkillType } from '../systems/SkillsSystem';

export default class SkillsManager implements EventListener {
    emitter = EventDispatcher.getInstance();

    listen() {
      this.emitter.on('skill.increase', (unit: Entity & HasSkills, skillType: SkillType, xp: number = 10) => {
        if (unit.skills && unit.skills.has(skillType)) {
          unit.skills.get(skillType).increase(xp);
        }
      });
    }
}