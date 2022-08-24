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

  articles = [
    {
      title:
        "React-three-fiber (Part 1): Export Blender animation and bones to glTF file",
      date: "May 31, 2020",
      description:
        "After creating this 3D header for my blog (the one at the top of the screen) with react-three-fiber and Blender, I thought that it would be…",
    },
    {
      title: "Devlog Phaser.js MMORPG | Part 1: create a map with Tiled",
      date: "May 18, 2020",
      description:
        "During the COVID crysis, I decided to take a new challenge: create a MMORPG with javascript. I had plenty of time, and building a game was…",
    },
  ];

  renderSkills() {
    const render: any[] = [];

    this.articles.forEach((article: any) => {
      render.push(
        <div className="p-4 border-b border-stone-500">
          <div className="text-xl font-black text-amber-400">
            {article.title}
          </div>
          <div className="text-sm">{article.description}</div>
          <div className="inline-block mt-2 px-4 py-2 rounded bg-amber-500 hover:bg-amber-600 cursor-pointer text-sm">
            READ
          </div>
        </div>
      );
    });

    return render;
  }

  render() {
    const { isVisible } = this.props;

    return (
      <Popup
        title="Blog"
        isVisible={isVisible}
        onClose={this.props.onClose}
        footerContent={<Button onClick={this.props.onClose}>Close</Button>}
      >
        <div className="px-8 pt-6 text-2xl">Last Articles</div>
        <div className="p-4">{this.renderSkills()}</div>
      </Popup>
    );
  }
}
