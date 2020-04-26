import Skill from "./Skill";
import { SkillType } from "../../systems/SkillsSystem";

export default class FarmingSkill extends Skill {
    type: SkillType = SkillType.FARMING;
    name: string = 'Farming';
    description: string = 'Farming Skill. Gather fruits and vegetables to increase this skill.';
    image = '/assets/items/harvest.png';
}