import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';

const ChatPreview = observer(() => {
    return (
        <div className={styles.chatPreview}>
            <div className={styles.avatar}>

            </div>
            <div className={styles.information}>
                <div className={styles.text}>
                    <span className={styles.name}>name</span>
                    <span className={styles.lastMessage}>name</span>
                </div>
                <div className={styles.status}>
                    <span>10:35</span>
                </div>
            </div>
        </div>
    );
});

export default ChatPreview;