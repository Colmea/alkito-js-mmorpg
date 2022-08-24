import 'phaser';
import React from 'react';
import EventDispatcher from '../services/EventDispatcher';
import Player from '../models/Player';
import Button from '../ui-components/common/Button';
import Popup from '../ui-components/common/Popup';
import { SkillType } from '../systems/SkillsSystem';
import { ActionType } from '../types/Actions';
import ProfessionPopup from '../ui-components/ProfessionPopup';

const divStyle = {
  marginTop: 75,
  textAlign: 'center',
};

export default class ReactScene extends Phaser.Scene {
  emitter: EventDispatcher = EventDispatcher.getInstance();

  player: Player;
  ui: any;

  constructor() {
    super('ReactScene');
  }

  init(data: { player: Player }) {
    this.player = data.player;
  }

  handleClosePopup = () => {
    this.ui.setState({ isVisible: false });
  }

  create() {
    const farmingSkill = this.player.skills.get(SkillType.FARMING);
    
    this.ui = this.add.reactDom((props) => (
      <ProfessionPopup
        level={farmingSkill.level}
        xp={farmingSkill.xp}
        xpLevel={farmingSkill.xpLevel}
        onClose={this.handleClosePopup}
        {...props}
      />
    ));

    this.emitter.on(ActionType.SKILL_INCREASE, () => {
      const farmingSkill = this.player.skills.get(SkillType.FARMING);
      
      this.ui.setState({
        level: farmingSkill.level,
        xp: farmingSkill.xp,
        xplevel: farmingSkill.xpLevel,
      });
    });
  }

  update() {
  }
}