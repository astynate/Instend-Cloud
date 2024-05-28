import React from 'react';
import styles from './main.module.css';
import info from './images/header/info.png';
import Input from '../../shared/input/Input';
import chatsState from '../../../../../../states/chats-state';
import { observer } from 'mobx-react-lite';

const Chat = observer(({children, placeholder}) => {
    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <div className={styles.avatar}>
                        <img 
                            src={`data:image/png;base64,${chatsState.draft ? chatsState.draft.avatar : 
                                chatsState.chats[chatsState.currentChatIndex].avatar}`}
                            className={styles.avatarImage} 
                            draggable="false"
                        />
                    </div>
                    <div className={styles.information}>
                        <span className={styles.name}>{chatsState.draft ? chatsState.draft.nickname : 
                            chatsState.chats[chatsState.currentChatIndex]}</span>
                        <span className={styles.data}></span>
                    </div>
                </div>
                <div className={styles.right}>
                    <img src={info} 
                        className={styles.buttonImage} 
                        draggable="false"
                    />
                </div>
            </div>
            {chatsState.draft ?
                (placeholder)
            : 
                <div className={styles.messages}>
                    
                </div>}
            <div className={styles.input}>
                <Input 
                    sendMessage={(message) => {}}
                />
            </div>
        </div>
    );
});

export default Chat;