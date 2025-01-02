import React from 'react';
import styles from './main.module.css';
import defaultAvatar from './images/default-avatar.png';
import StorageController from '../../../../../api/StorageController';

const UserAvatar = ({avatar, size = 25}) => {
    const avatarStyle = {
        width: `${size}px`,
        height: `${size}px`
    };

    return (
        <div className={styles.userAvatar} style={avatarStyle}>
            <img 
                src={avatar ? StorageController.getFullFileURL(avatar) : defaultAvatar} 
                style={avatarStyle}
                draggable={false}
            />
        </div>
    );
};

export default UserAvatar;
