import React from 'react';
import styles from './main.module.css';
import defaultAvatar from './images/default-avatar.png';

const UserAvatar = ({user}) => {
    if (user && user.avatar) {
        return (
            <div className={styles.userAvatar}>
                <img 
                    src={`data:image/png;base64,${user.avatar}`} 
                    draggable={false}
                />
            </div>
        );
    } else {
        return (
            <div className={styles.userAvatar}>
                <img 
                    src={defaultAvatar} 
                    draggable={false}
                />
            </div>
        );
    }
 };

export default UserAvatar;