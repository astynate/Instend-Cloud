import React from 'react';
import styles from './main.module.css';

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
        return null;
    }
 };

export default UserAvatar;