import Skill from "./Skill";
import { SkillType } from "../../systems/SkillsSystem";

export default class WoodCuttingSkill extends Skill {
    type: SkillType = SkillType.WOODCUTTING;
    name: string = 'WoodCutting';
    description: string = 'WoodCutting SKill. Recolt logs and wood to increase this skill.';
    image = '/assets/items/woodcutting.png'
}