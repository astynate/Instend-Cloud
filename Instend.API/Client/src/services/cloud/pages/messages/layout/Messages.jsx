import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Chats from '../widgets/chats/Chats';
import Chat from '../widgets/chat/Chat';

const Messages = observer(({isMobile, setPanelState}) => { 
    useEffect(() => {
      setPanelState(true);
    }, []);
  
    return (
        <div className={styles.wrapper}>
          <Chats isMobile={isMobile} />
          <Chat />
        </div>
    );
});

export default Messages;