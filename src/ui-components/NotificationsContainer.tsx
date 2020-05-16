import React, { PureComponent } from 'react';
import { Message, Icon } from 'semantic-ui-react';
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
      <Message floating color="brown" style={{ color: 'white', backgroundColor: '#ffffff29', boxShadow: 'none', padding: '0.5em'  }}>
        <Message.Content>
          {notif.message}
        </Message.Content>
      </Message>
    )
  }

  render() {
    return (
      <div
        style={{
          margin: 20,
          width: 300,
        }}
      >
        {this.props.notifs.reverse().map(this.renderNotif)}
      </div>
    );
  }
}