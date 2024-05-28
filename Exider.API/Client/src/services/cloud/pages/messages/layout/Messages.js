import React, { useEffect } from 'react';
import Content from '../widgets/content/Content';
import Chat from '../widgets/chat/Chat';
import styles from './main.module.css';
import cyraAvatar from './images/cyra.png';
import { observer } from 'mobx-react-lite';
import Chats from '../widgets/chats/Chats';
import chatsState from '../../../../../states/chats-state';

const Messages = (props) => {
  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(true);
    }
  }, [props.setPanelState]);
  
  return (
    <Content>
      <Chats />
      {chatsState.currentChatIndex !== -1 || chatsState.draft 
      ? 
        <Chat 
          placeholder={
            <div className={styles.placeholder}>
              <h1>No messages sended</h1>
              <span>Send message to start communicate</span>
            </div>
          }
        />
      :
        <div className={styles.placeholder}>
          <h1>No chat selected</h1>
          <span>Select chat or create</span>
        </div>
      }
    </Content>
  )
};

export default observer(Messages);