import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import { Link } from 'react-router-dom';

const ChatPreview = observer(({chat, isPlaceholder, isActive}) => {
    if (isPlaceholder === false && chat) {
        return (
            <Link to={`/messages/${chat.id}`} className={styles.chatPreview} id={isActive ? 'active' : null}>
                <div className={styles.avatar}>
                    <img src={`data:image/png;base64,${chat.avatar}`} className={styles.avatarImage} />
                </div>
                <div className={styles.information}>
                    <div className={styles.text}>
                        <span className={styles.name}>{chat.name}</span>
                        {chat && chat.messages && chat.messages.length > 0 &&
                            <span className={styles.lastMessage}>{chat.messages[0].text}</span>}
                    </div>
                    <div className={styles.status}>
                        {/* <span>10:35</span> */}
                    </div>
                </div>
            </Link>
        );
    } else {
        return (
            <div className={styles.chatPreview}>
                <div className={styles.avatar} id="placeholder">
                </div>
                <div className={styles.information} id="placeholder">
                    <div className={styles.text}>
                        <span className={styles.name} id="placeholder"></span>
                        <span className={styles.lastMessage} id="placeholder"></span>
                    </div>
                    <div className={styles.status}>
                        {/* <span>10:35</span> */}
                    </div>
                </div>
            </div>
        )
    }
});

export default ChatPreview;