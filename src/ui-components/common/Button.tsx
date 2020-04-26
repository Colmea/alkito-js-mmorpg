import React, { PureComponent } from 'react';

interface Props {
  onClick: () => void;
}

export default class Button extends PureComponent<Props, {}> {

  static defaultProps = {
    onClick: () => {},
  }

  render() {
    return (
      <div onClick={this.props.onClick} className="button-container">
        <div className="button">
          {this.props.children}
        </div>
      </div>
    );
  }
}