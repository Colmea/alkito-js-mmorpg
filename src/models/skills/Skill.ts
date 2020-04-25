import { SkillType } from "../../systems/SkillsSystem";

export default abstract class Skill {
    XP_LEVEL_FACTOR: number = 0.1;

    type: SkillType;
    name: string = 'Profession';
    description: string = 'A default Profession';
    image: string;
    level: number = 1;
    xp: number = 0;
    xpLevel: number = 100;

    increase(xp: number) {
        this.xp += xp;

        if (this.xp >= this.xpLevel) {
            this.levelUp();
        }
    }

    private levelUp() {
        const remainingXp = this.xp - this.xpLevel;

        this.level += 1;
        this.xp = remainingXp;
        this.xpLevel += this.xpLevel * this.XP_LEVEL_FACTOR;
    }
}