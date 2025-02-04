import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import styles from './main.module.css';
import Chats from '../widgets/chats/Chats';
import Chat from '../widgets/chat/Chat';
import ChatsState from '../../../../../state/entities/ChatsState';

const Messages = observer(({isMobile, setPanelState = () => {}}) => { 
    const { chats } = ChatsState;
    const [chat, setChat] = useState(undefined);

    const params = useParams();
  
    useEffect(() => {
      setPanelState(true);
    }, []);
    
    useEffect(() => {
        setChat(ChatsState.GetChatById(params.id));
    }, [chats.length, params.id]);
  
    return (
        <div className={styles.wrapper}>
          <Chats isMobile={isMobile} />
          <Chat chat={chat} />
        </div>
    );
});

export default Messages;