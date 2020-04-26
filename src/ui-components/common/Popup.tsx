import React, { PureComponent } from 'react';

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

const styleContainer = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '10%',
  width: 250,
  height: 200,
  backgroundColor: '#595652',
  borderRadius: 7,
  border: '3px groove #d27d2c',
  boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.3)',
  textAlign: 'center' as 'center',
  color: 'white',
  fontSize: '0.9em',
  padding: 10,
};

const styleHeader = {
  position: 'absolute' as 'absolute',
  cursor: 'pointer',
  left: -2,
  top: -30,
  width: 'calc(100% + 2px)',
  height: 27,
  backgroundImage: 'url(assets/ui/modal-topbar.png)',
}

export default class Button extends PureComponent<Props, {}> {

  static defaultProps = {
    isVisible: false,
    onClose: () => { },
  }

  render() {
    console.log('popup rener', this.props.isVisible);
    return (this.props.isVisible &&
      <div style={styleContainer}>
        <div onClick={this.props.onClose} style={styleHeader}></div>
        {this.props.children}
      </div>
    );
  }
}