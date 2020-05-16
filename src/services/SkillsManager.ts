import EventDispatcher from './EventDispatcher';
import EventListener from './EventListenerInterface';
import Entity from '../models/Entity';
import { HasSkills, SkillType } from '../systems/SkillsSystem';
import { ActionType } from '../types/Actions';

export default class SkillsManager implements EventListener {
    emitter = EventDispatcher.getInstance();

    listen() {
      this.emitter.on(ActionType.SKILL_INCREASE, (unit: Entity & HasSkills, skillType: SkillType, xp: number = 10) => {
        if (unit.skills && unit.skills.has(skillType)) {
          const skill = unit.skills.get(skillType);
          const previousLvl = skill.level;
          // Increase XP
          unit.skills.get(skillType).increase(xp);

          // If level up, emit new event
          if (skill.level > previousLvl) {
            this.emitter.emit(ActionType.SKILL_LEVEL_UP, unit, skill);
          }
        }
      });
    }
}