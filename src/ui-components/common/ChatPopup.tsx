import React, { PureComponent } from 'react';
import { Comment, Input, Icon } from 'semantic-ui-react'
import Popup from './Popup';
import { ChatMessage } from '../../types/Chat';

interface Props {
  messages: ChatMessage[];
  onSend: (newMessage: string) => void;
}

interface State {
  message: string;
}

export default class ChatPopup extends PureComponent<Props, State> {

  static defaultProps = {
    messages: [],
    onSend: () => {},
  }

  state = {
    message: '',
  }

  popupRef: React.RefObject<Popup> = React.createRef();
  inputRef: React.RefObject<Input> = React.createRef();

  componentDidUpdate(prevProps: Props) {
    if (prevProps.messages.length < this.props.messages.length && this.popupRef.current) {
      this.popupRef.current.scrollbarRef.current.scrollToBottom();
    }
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: event.target.value});
  }

  handleInputKeyDown = (event) => {
    if (event.key === 'Enter') {
      this.handleSendmessage();
    }
  }

  handleSendmessage = () => {
    this.props.onSend(this.state.message);

    this.setState({ message: '' });

    if (this.inputRef.current) {
      this.inputRef.current.focus();
    }
  }
  
  renderMessages() {
    const render = [];

    this.props.messages.forEach((message: ChatMessage) => {
      render.push(
        <Comment key={message.creationDate} style={{ marginBottom: 10 }}>
          <Comment.Avatar src={message.image} />
          <Comment.Content>
            <Comment.Author style={{ color: 'rgba(255,255,255,.4)' }}>{message.author}</Comment.Author>
            <Comment.Text style={{ color: 'rgba(255,255,255,.85)' }}>{message.message}</Comment.Text>
          </Comment.Content>
        </Comment>
      );
    });

    return render;
  }

  render() {
    return (
      <Popup
        ref={this.popupRef}
        isVisible
        hasHeader={false}
        title="Chat"
        left="78%"
        top="61%"
        width={300}
        height={300}
        footerContent={
          <div style={{ width: '100%' }}>
            <Input
              ref={this.inputRef}
              value={this.state.message}
              onChange={this.handleInputChange}
              onKeyDown={this.handleInputKeyDown}
              fluid
              inverted
              size="small"
              icon={<Icon inverted link name='send' onClick={this.handleSendmessage} />}
              style={{ margin: 7, backgroundColor: 'red !important' }}
              className="alkito-chat-input"
            />
          </div>
        }
      >
        <Comment.Group minimal style={{ marginTop: 10 }}>
          {this.renderMessages()}
        </Comment.Group>
      </Popup>
    );
  }
}