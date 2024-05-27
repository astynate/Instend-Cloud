import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import Title from '../../../../shared/ui-kit/retractable-panel/title/Title';
import create from './images/create.png';
import ChatPreview from '../../shared/chat-preview/ChatPreview';

const Chats = observer(() => {
    return (
        <div className={styles.chats}>
            <div className={styles.header}>
                <Title title='Chats' />
                <div className={styles.create}>
                    <img 
                        src={create}
                        className={styles.createImage}
                        draggable="false"
                    />
                </div>
            </div>
            <div className={styles.chatList}>
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
                <ChatPreview />
            </div>
        </div>
    );
});

export default Chats;