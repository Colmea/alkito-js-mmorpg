import Skill from "../models/skills/Skill";

export interface HasSkills {
    skills: SkillsSystem;
}

export enum SkillType {
    GENERIC_SKILL = 'GENERIC_SKILL',
    WOODCUTTING = 'WOODCUTTING',
    MINING = 'MINING',
    FARMING = 'FARMING',
}

export default class SkillsSystem {
    skills: { [key: string]: Skill } = {};

    constructor(skills: Skill[]) {
        skills.forEach((skill: Skill) => {
            this.skills[skill.type] = skill;
        });
    }

    get(skill: SkillType): Skill {
        return this.skills[skill];
    }

    has(skill: SkillType): boolean {
        if (this.get(skill))
            return true;
        else
            return false;
    }
}