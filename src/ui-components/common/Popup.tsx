import React, { PureComponent, ReactNode } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  title?: string;
  isVisible: boolean;
  width: number;
  height: number;
  footerContent?: ReactNode;
  onClose: () => void;
}

const styleContainer = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '10%',
  minWidth: 350,
  height: 490,
  backgroundImage: 'url(assets/ui/ui-background.png)',
  backgroundSize: 'cover',
  backgroundColor: '#595652',
  borderRadius: 7,
  border: '3px groove #d27d2c',
  boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.3)',
  color: 'white',
  padding: '10px 30px',

};

const styleHeader = {
  position: 'absolute' as 'absolute',
  cursor: 'pointer',
  left: -2,
  top: -30,
  width: 272,
  height: 27,
  backgroundImage: 'url(assets/ui/modal-topbar.png)',
  paddingTop: 12,
  fontSize: '1.3em',
  paddingLeft: 7,
}

const styleContent = {
  height: '100%',
  overflowY: 'auto' as 'auto',
};

export default class Popup extends PureComponent<Props, {}> {

  static defaultProps = {
    isVisible: false,
    width: 500,
    height: 400,
    onClose: () => { },
  }

  render() {
    return (this.props.isVisible &&
      <div style={{ ...styleContainer, width: this.props.width, height: this.props.height }}>
        <div onClick={this.props.onClose} style={styleHeader}>
          {this.props.title}
        </div>
        <Scrollbars style={{ width: this.props.width - 60, height: this.props.height - 40 }}>
          {this.props.children}
        </Scrollbars>

        <div style={{ height: 40, paddingTop: 12 }}>
          {this.props.footerContent}
        </div>
      </div>
    );
  }
}