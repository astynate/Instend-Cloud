import React from 'react';
import styles from './main.module.css';
import { ConvertDateToTime } from '../../../../../../utils/DateHandler';
import MessageAttachments from '../../elements/attachments/MessageAttachments';

const Message = ({id, text, type, avatar, position, time, isSelected, attachments}) => {
    const types = [styles.first, styles.middle, styles.last, styles.single];

    return(
        <div className={styles.message} id={isSelected ? 'selected' : null}>
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
            <div className={`${styles.messageContent} ${types[position]}`} id={type}>
                {attachments && attachments.length > 0 && 
                    <MessageAttachments 
                        messageId={id}
                        type={type} 
                        position={position} 
                        attachments={attachments} 
                    />}
                <div className={styles.messageText}>
                    <div className={styles.textParts}>
                        {text.split('\n').map((part, index) => (
                            <span 
                                key={index + "text"}
                                className={styles.text}
                            >
                                {part}
                            </span>
                        ))}
                    </div>
                    <div className={styles.information}>
                        <span className={styles.time}>{time ? ConvertDateToTime(time) : null}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;