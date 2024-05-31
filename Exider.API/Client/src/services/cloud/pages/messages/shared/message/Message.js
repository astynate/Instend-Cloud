import React from 'react';
import styles from './main.module.css';

const Message = ({name, text, type, avatar, position, time}) => {
    const types = [styles.first, styles.middle, styles.last, styles.single];

    return(
        <div className={styles.message}>
            {position === 2 || position === 3 ? 
                <div className={styles.avatar}>
                    {avatar && <img 
                        src={`data:image/png;base64,${avatar}`} 
                        className={styles.avatar}
                        draggable='false'
                    />}
                </div>
            :
                <div className={styles.avatarPlaceholder}></div>
            }
                <div className={`${styles.messageText} ${types[position]}`}>
                {/* <h1 className={styles.name}>{name}</h1> */}
                <span className={styles.text}>{text}</span>
                <div className={styles.information}>
                    <span className={styles.time}>{time ? time : null}</span>
                </div>
            </div>
        </div>
    );
};

export default Message;