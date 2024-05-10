import React from 'react';
import styles from './main.module.css';

const UserAvatar = ({avatar}) => {
    if (avatar) {
        return (
            <div className={styles.userAvatar}>
                <img 
                    src={`data:image/png;base64,${avatar}`} 
                    draggable={false}
                />
            </div>
        );
    } else {
        return null;
    }
 };

export default UserAvatar;