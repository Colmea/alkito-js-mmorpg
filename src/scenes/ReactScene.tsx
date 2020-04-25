import 'phaser';
import React from 'react';
import EventDispatcher from '../managers/EventDispatcher';
import Player from '../models/Player';

const btnStyle = {
  margin: 20,
};

export default class ReactScene extends Phaser.Scene {
  player: Player;
  ui: any;

  constructor() {
    super('ReactScene');
  }

  init(data: { player: Player }) {
    this.player = data.player;
  }

  create() {
    this.ui = this.add.reactDom((props) => (
      <div style={{ marginTop: 75, textAlign: 'center' }} {...props}>
        This is a <strong>super</strong> text.<br />
        Next line<br /><br />
        <div onClick={(() => alert('CLICK'))} className="button" style={btnStyle}>
          ACCEPT
        </div>
      </div>
    ), { score: 0 });
  }

  update() {
  }
}