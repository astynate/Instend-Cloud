import React, { useContext, useEffect, useState } from 'react';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import Content from '../widgets/content/Content';
import Input from '../shared/input/Input';
import Chat from '../widgets/chat/Chat';
import Message from '../shared/message/Message';
import styles from './main.module.css';
import cyraAvatar from './images/cyra.png';
import userState from '../../../../../states/user-state';
import { observer } from 'mobx-react-lite';
import { SignalRContext } from '../../../layout/Layout';

const Messages = (props) => {

  const { user } = userState;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isSendingMessage, setSendingMessageState] = useState(false);
  const [isSendingPossible, setSendningPossibility] = useState(true);

  SignalRContext.useSignalREffect(
    "ReceiveMessage",
    (message) => {
      setMessages(prevMessages => [...prevMessages,  { 
        name: "✦ Сyra",
        text: `Ты лох и собака`,
        isMyMessage: false,
        avatar: cyraAvatar
      }]);
    },
  );

  useEffect(()=> {

    if (isSendingMessage === true && message.trim().length > 0) {
      
      setMessages(prevMessages => [...prevMessages,  { 
        name: user.nickname,
        text: message,
        isMyMessage: true,
        avatar: `data:image/png;base64,${user.avatar}`
      }]);

      setMessage('');

      SignalRContext.connection.invoke('SendMessage', message);

    }

    setSendingMessageState(false);

  }, [isSendingMessage]);

  useEffect(() => {

    if (props.setPanelState) {
        props.setPanelState(true);
    }

  }, [props.setPanelState]);
  
  return (
    <div className={styles.wrapper}>
      <Search />
      <Header />
      <Content>
        <Chat>
          <Message 
            name="✦ Сyra"
            text={`Hello, ${user.nickname}! My name is Cyra. How can i help you today? 😄`}
            isMyMessage={false}
            avatar={cyraAvatar}
          />
          {messages.map(message => (
            <Message 
              name={message.name}
              text={message.text}
              isMyMessage={message.isMyMessage}
              avatar={message.avatar}
            />
          ))}
        </Chat>
        <Input 
          message={[message, setMessage]} 
          isSendingPossible={isSendingPossible}
          isSendingMessage={[isSendingMessage, setSendingMessageState]}
        />
      </Content>
    </div>
  )

};

export default observer(Messages);