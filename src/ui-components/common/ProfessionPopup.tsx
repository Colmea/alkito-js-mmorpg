import React, { PureComponent, Fragment } from 'react';
import Popup from './Popup';
import Button from './Button';

interface Props {
  isVisible: boolean;
  level: number;
  xp: number;
  xpLevel: number;
  onClose: () => void;
}

export default class ProfessionPopup extends PureComponent<Props, {}> {

  static defaultProps = {
    isVisible: false,
    level: 1,
    xp: 0,
    xpLevel: 100,
    onClose: () => {},
  }

  render() {
    
    const { level, xp, xpLevel, isVisible } = this.props;
    console.log('prof render', isVisible);
    return (
      <Popup
        isVisible={isVisible}
        onClose={this.props.onClose}
        footerContent={
          <Fragment>
            <Button>Cancel</Button>
            <Button>Attack</Button>
          </Fragment>
        }
      >
          <h1>🪓 Professions</h1>
          <p>
            <br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <strong>FARMING</strong> (lvl {level}): {xp} / {xpLevel} xp.<br /><br />
            <br /><br />
          </p>
      </Popup>
    );
  }
}