import Skill from "./Skill";
import { SkillType } from "../../systems/SkillsSystem";

export default class MiningSkill extends Skill {
    type: SkillType = SkillType.MINING;
    name: string = 'Mining';
    description: string = 'Mining Skill. Mine ore to increase this skill.';
}