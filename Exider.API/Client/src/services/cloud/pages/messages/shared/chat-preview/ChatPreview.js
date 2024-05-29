import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';

const ChatPreview = observer(({chat, isPlaceholder}) => {
    if (isPlaceholder === false && chat) {
        return (
            <div className={styles.chatPreview}>
                <div className={styles.avatar}>
                    <img src={`data:image/png;base64,${chat.avatar}`} className={styles.avatarImage} />
                </div>
                <div className={styles.information}>
                    <div className={styles.text}>
                        <span className={styles.name}>{chat.name}</span>
                        <span className={styles.lastMessage}></span>
                    </div>
                    <div className={styles.status}>
                        {/* <span>10:35</span> */}
                    </div>
                </div>
            </div>
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