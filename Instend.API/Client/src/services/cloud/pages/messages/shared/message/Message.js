import React from 'react';
import { ConvertDateToTime } from '../../../../../../utils/handlers/DateHandler';
import sent from './images/tick.svg';
import sending from './images/time.svg';
import viewed from './images/sent.svg';
import styles from './main.module.css';
import StorageController from '../../../../../../api/StorageController';
import MessageAttachments from '../../elements/attachments/MessageAttachments';

const Message = ({isCurrentAccountMessage, message, position}) => {
    const types = [styles.first, styles.middle, styles.last, styles.single];
    const sendingTypes = [sending, sent, viewed];

    if (!message || !message.sender) {
        return null;
    };

    const getSendingType = () => {
        if (!message.id) {
            return 0;
        };

        return message.isViewed ? 2 : 1;
    };

    return(
        <div className={styles.message} id={position === 0 || position === 3 ? 'margin' : null}>
            {position === 2 || position === 3 ? 
                <div className={styles.avatar}>
                    <img 
                        src={StorageController.getFullFileURL(message.sender?.avatar)} 
                        className={styles.avatar}
                        draggable='false'
                    />
                </div>
            :
                <div className={styles.avatarPlaceholder}></div>
            }
            <div 
                id={isCurrentAccountMessage ? 'currentAccountMessage' : null}
                className={`${styles.messageContent} ${types[position]}`} 
            >
                <div className={styles.attachments}>
                    <MessageAttachments 
                        isCurrentAccountMessage={isCurrentAccountMessage}
                        message={message}
                    />
                </div>
                <div className={styles.messageText}>
                    <div className={styles.textParts}>
                        {message.text.split('\n').map((part, index) => (
                            <span 
                                key={index + "text"}
                                className={styles.text}
                            >
                                {part}
                            </span>
                        ))}
                    </div>
                    <div className={styles.information}>
                        <span className={styles.time}>{message.date ? ConvertDateToTime(message.date) : null}</span>
                        <img 
                            src={sendingTypes[getSendingType()]} 
                            className={styles.messageState} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Message;