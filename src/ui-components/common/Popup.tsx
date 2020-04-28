import React, { PureComponent, ReactNode } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

interface Props {
  title?: string;
  isVisible: boolean;
  hasHeader: boolean;
  width: string | number;
  height: string | number;
  left: string | number;
  top: string | number;
  footerContent?: ReactNode;
  onClose: () => void;
}

const styleContainer = {
  position: 'absolute' as 'absolute',
  top: '20%',
  left: '10%',
  minWidth: 50,
  height: 490,
  backgroundImage: 'url(assets/ui/ui-background.png)',
  backgroundSize: 'cover',
  backgroundColor: '#595652',
  borderRadius: 7,
  border: '3px groove #d27d2c',
  boxShadow: '3px 3px 5px 0px rgba(0,0,0,0.3)',
  color: 'white',

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
  color: 'white',
};

export default class Popup extends PureComponent<Props, {}> {
  static defaultProps = {
    isVisible: false,
    hasHeader: true,
    width: 500,
    height: 400,
    top: '20%',
    left: '10%',
    onClose: () => { },
  };

  scrollbarRef: React.RefObject<Scrollbars>;

  constructor(props) {
    super(props);
    this.scrollbarRef = React.createRef();
  }

  componentDidMount() {
    setTimeout(() => {
      if (this.scrollbarRef.current)
        this.scrollbarRef.current.scrollToBottom();
    }, 200);
  }

  render() {
    return (this.props.isVisible &&
      <div style={{
        ...styleContainer,
        width: this.props.width,
        height: this.props.height,
        top: this.props.top,
        left: this.props.left,
        }}
      >
        {this.props.hasHeader &&
          <div onClick={this.props.onClose} style={styleHeader}>
            {this.props.title}
          </div>
        }
        <Scrollbars
          ref={this.scrollbarRef}
          style={{ height: 'calc(100% - 40px)' }}
          renderThumbVertical={({ style, ...props }) =>
            <div
              {...props}
              style={{
                ...style,
                borderRadius: 'inherit',
                backgroundColor: 'rgba(210, 125, 44, 0.85)'
              }}
            />
          }
        >
          <div style={{ padding: '0 20px' }}>
            {this.props.children}
          </div>
        </Scrollbars>

        <div style={{ textAlign: 'center' }}>
          {this.props.footerContent}
        </div>
      </div>
    );
  }
}