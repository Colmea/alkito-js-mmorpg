import React, { PureComponent, Fragment } from 'react';
import { Progress, Card, Icon, Image, Statistic, Label } from 'semantic-ui-react'
import Popup from './Popup';
import Button from './Button';
import Skill from '../../models/skills/Skill';

interface Props {
  isVisible: boolean;
  skills: Skill[],
  onClose: () => void;
}

export default class ProfessionPopup extends PureComponent<Props, {}> {

  static defaultProps = {
    isVisible: false,
    skills: [],
    onClose: () => {},
  }

  renderSkills() {
    const render = [];

    this.props.skills.forEach((skill: Skill) => {
      const percentXp = (skill.xp / skill.xpLevel) * 100;

      render.push(
        <Card style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Image
            src={skill.image}
            wrapped
            ui={false}
            label={{
              as: 'a',
              color: 'orange',
              content: 'lvl ' + skill.level,
              ribbon: "right",
            }}
          />
          <Card.Content style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
            <Card.Header>{skill.name}</Card.Header>
            <Card.Meta>{skill.description}</Card.Meta>
          </Card.Content>
          
          {/* <Card.Content extra style={{ backgroundColor: '#ff9800', textAlign: 'center' }}>
            0 / 100 xp
          </Card.Content> */}
          <Progress percent={percentXp} progress active color='green'  size="small" />

        </Card>
      );
    });

    return render;
  }

  render() {
    const { isVisible } = this.props;

    return (
      <Popup
        title="🪓 Professions"
        isVisible={isVisible}
        onClose={this.props.onClose}
        footerContent={
          <Fragment>
            <Button onClick={this.props.onClose}>Close</Button>
          </Fragment>
        }
      >
        <br />
          <Card.Group itemsPerRow={2}>
            {this.renderSkills()}
          </Card.Group>
      </Popup>
    );
  }
}