import React, { PureComponent } from 'react';
import { Comment, Input } from 'semantic-ui-react'
import Popup from './Popup';

type ChatMessage = {
  author: string;
  image?: string;
  message: string;
  creationDate?: number;
}

const avatars = [
  'https://react.semantic-ui.com/images/avatar/small/tom.jpg',
  'https://react.semantic-ui.com/images/avatar/small/matt.jpg',
  'https://react.semantic-ui.com/images/avatar/small/matthew.png',
];

const messages: ChatMessage[] = [
  { author: 'Colmea', message: "Ceci est un message de chat. Commencez ça va vous ?", image: avatars[0] },
  { author: 'Saini347', message: "Ok cool ça marrrrrche lol", image: avatars[1] },
  { author: 'Colmea', message: "Super, ça a l'air de bien marchr !", image: avatars[0] },
  { author: 'Colmea', message: "Salut le monde", image: avatars[0] },
  { author: 'Saini347', message: "Hello", image: avatars[1] },
  { author: 'Colmea', message: "Ceci est un message de chat. Commencez ça va vous ?", image: avatars[0] },
  { author: 'Saini347', message: "Ok cool ça marrrrrche lol", image: avatars[1] },
  { author: 'Colmea', message: "Super, ça a l'air de bien marche !", image: avatars[0] },
  { author: 'Colmea', message: "Salut le monde", image: avatars[0] },
  { author: 'Saini347', message: "Hello", image: avatars[1] },
  { author: 'Colmea', message: "Ceci est un message de chat. Commencez ça va vous ?", image: avatars[0] },
  { author: 'Saini347', message: "Ok cool ça marrrrrche lol", image: avatars[1] },
  { author: 'Colmea', message: "Super, ça a l'air de bien marche !", image: avatars[2] },
  { author: 'Colmea', message: "Salut le monde", image: avatars[0] },
  { author: 'Saini347', message: "Hello", image: avatars[1] },
];

export default class ChatPopup extends PureComponent<{}, {}> {

  renderMessages() {
    const render = [];

    messages.forEach((message: ChatMessage) => {
      render.push(
        <Comment style={{ marginBottom: 10 }}>
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
              fluid
              inverted
              action
              size="small"
              icon={{ name: 'send', inverted: true, circular: false, link: true }}
              style={{ margin: 7, backgroundColor: 'red !important' }}
              className="alkito-chat-input"
            />
          </div>
        }
      >
        <Comment.Group inverted minimal style={{ marginTop: 10 }}>
          {this.renderMessages()}
        </Comment.Group>
      </Popup>
    );
  }
}