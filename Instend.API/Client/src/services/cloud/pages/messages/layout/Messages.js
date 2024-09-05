import React, { useEffect, useState } from 'react';
import Content from '../widgets/content/Content';
import Chat from '../widgets/chat/Chat';
import styles from './main.module.css';
import cyraAvatar from './images/cyra.png';
import { observer } from 'mobx-react-lite';
import Chats from '../widgets/chats/Chats';
import chatsState from '../../../../../states/chats-state';
import { useParams } from 'react-router-dom';
import ChatHandler from '../../../../../utils/handlers/ChatHandler';

const Messages = observer((props) => {
  const params = useParams();
  const [chat, setChat] = useState(null);
  const [isOpen, setOpenState] = useState(false);

  useEffect(() => {
    if (props.setPanelState) {
        props.setPanelState(true);
    }
  }, [props.setPanelState]);

  useEffect(() => { 
    setChat(ChatHandler.GetChat(params.id));
  }, [chatsState.chats, params, params.id])
  
  return (
    <Content>
      <Chats 
        isMobile={props.isMobile} 
        setOpenState={() => setOpenState(true)}
      />
      {chat || chatsState.draft ? 
        <Chat 
          isMobile={props.isMobile}
          isOpen={isOpen}
          chat={chat}
          close={() => setOpenState(false)}
          placeholder={
            <div className={styles.placeholder}>
              <h1>No messages sended</h1>
              <span>Send message to start communicate</span>
            </div>
          }
          requestSended={
            <div className={styles.placeholder}>
              <h1>Invite sent</h1>
              <span>Wait for a response from your interlocutor</span>
            </div>
          }
          sendingInvite={
            <div className={styles.placeholder}>
              <span>Wait for a response from your interlocutor</span>
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
});

export default Messages;