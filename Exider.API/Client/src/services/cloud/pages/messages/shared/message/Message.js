import React from 'react';
import styles from './main.module.css';
import { ConvertDateToTime } from '../../../../../../utils/DateHandler';

const Message = ({text, type, avatar, position, time, isSelected}) => {
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
                <div className={`${styles.messageText} ${types[position]}`} id={type}>
                {/* <h1 className={styles.name}>{name}</h1> */}
                <span className={styles.text}>{text}</span>
                <div className={styles.information}>
                    <span className={styles.time}>{time ? ConvertDateToTime(time) : null}</span>
                </div>
            </div>
        </div>
    );
};

export default Message;