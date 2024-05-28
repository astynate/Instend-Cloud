import React, { useContext, useEffect, useState } from 'react';
import Content from '../widgets/content/Content';
import Chat from '../widgets/chat/Chat';
import Message from '../shared/message/Message';
import styles from './main.module.css';
import cyraAvatar from './images/cyra.png';
import userState from '../../../../../states/user-state';
import { observer } from 'mobx-react-lite';
import Chats from '../widgets/chats/Chats';

const Messages = (props) => {
  const { user } = userState;

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(true);
    }
  }, [props.setPanelState]);
  
  return (
    <Content>
      <Chats />
      <Chat>
        {Array.from({length: 100}).map((_, index) => {
          return (
            <Message 
              key={index}
              // name="✦ Сyra"
              text={`Hello, ${user.nickname}! My name is Cyra. How can i help you today? 😄`}
              type={"My"}
              // avatar={cyraAvatar}
              position={3}
            />
          );
        })}
        <div className={styles.messageGroup}>
          <Message 
            text={`Hello, ${user.nickname}! My name is Cyra. How can i help you today? 😄`}
            type={"My"}
            position={0}
          />
          <Message 
            text={`Hello, ${user.nickname}! My name is Cyra. How can i help you today? 😄`}
            type={"My"}
            position={1}
          />
          <Message 
            text={`Hello, ${user.nickname}! My name is Cyra. How can i help you today? 😄`}
            type={"My"}
            position={2}
          />
        </div>
      </Chat>
    </Content>
  )
};

export default observer(Messages);