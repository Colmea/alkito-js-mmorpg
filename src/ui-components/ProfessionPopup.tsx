import React, { PureComponent, Fragment } from "react";
import {
  Progress,
  Card,
  Icon,
  Image,
  Statistic,
  Label,
  List,
  Grid,
} from "semantic-ui-react";
import Popup from "./common/Popup";
import Button from "./common/Button";
import Skill from "../models/skills/Skill";

interface Props {
  isVisible: boolean;
  skills: Skill[];
  onClose: () => void;
}

export default class ProfessionPopup extends PureComponent<Props, {}> {
  static defaultProps = {
    isVisible: false,
    skills: [],
    onClose: () => {},
  };

  renderSkills() {
    const render: any[] = [];

    this.props.skills.forEach((skill: Skill) => {
      render.push(
        <List.Item
          key={skill.name}
          style={{ backgroundColor: "transparent", boxShadow: "none" }}
        >
          <List.Content
            floated="right"
            verticalAlign="middle"
            style={{ width: 200, paddingTop: 24 }}
          >
            <Grid columns="equal">
              <Grid.Column width={12}>
                <Progress
                  inverted
                  value={skill.xp}
                  total={skill.xpLevel}
                  active
                  color="orange"
                  size="tiny"
                />
              </Grid.Column>
              <Grid.Column>
                Lvl. <strong>{skill.level}</strong>
              </Grid.Column>
            </Grid>
          </List.Content>
          <Image
            src={skill.image}
            rounded
            style={{ width: 50, backgroundColor: "#ffffff21", padding: 4 }}
          />
          <List.Content>{skill.name}</List.Content>
        </List.Item>
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
        footerContent={<Button onClick={this.props.onClose}>Close</Button>}
      >
        <List divided verticalAlign="middle" style={{ marginTop: 10 }}>
          {this.renderSkills()}
        </List>
      </Popup>
    );
  }
}
