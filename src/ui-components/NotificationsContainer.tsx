import React, { PureComponent } from 'react';
import { Message } from 'semantic-ui-react';
import { Transition, animated } from 'react-spring/renderprops'
import { Notif } from '../services/NotificationManager';

interface Props {
  notifs: Notif[],
}

export default class NotificationContainer extends PureComponent<Props, {}> {

  static defaultProps = {
    notifs: [],
  }

  renderNotif(notif: Notif) {
    return (
      <Message floating color="brown" style={{ marginTop: 5, color: 'white', backgroundColor: '#ffffff29', boxShadow: 'none', padding: '0.5em'  }}>
        <Message.Content>
          {notif.message}
        </Message.Content>
      </Message>
    )
  }

  render() {
    console.log('render notifs', this.props.notifs);
    return (
      <div
        style={{
          margin: 20,
          width: 300,
        }}
      >
        <Transition
          items={this.props.notifs}
          keys={(item: Notif) => item.id}
          //initial={null}
          from={{ opacity: 0, overflow: 'hidden', height: 0 }}
          enter={{ opacity: 1, height: 40 }}
          leave={{ opacity: 0, height: 0 }}
          update={{  }}
          trail={200}
        >
          {item => styles => (
            <animated.div style={{ ...styles }}>
              {this.renderNotif(item)}
            </animated.div>
          )}
          
        </Transition>
      
      </div>
    );
  }
}