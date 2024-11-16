import React from 'react';
import styles from './main.module.css';
import defaultAvatar from './images/default-avatar.png';

const UserAvatar = ({user, size = 25}) => {
    const avatarStyle = {
        width: `${size}px`,
        height: `${size}px`
    };

    if (user && (user.avatar || user.Avatar)) {
        return (
            <div className={styles.userAvatar} style={avatarStyle}>
                <img 
                    src={`data:image/png;base64,${user.avatar ?? user.Avatar}`} 
                    style={avatarStyle}
                    draggable={false}
                    alt="User Avatar"
                />
            </div>
        );
    }
        
    return (
        <div className={styles.userAvatar} style={avatarStyle}>
            <img 
                src={defaultAvatar} 
                style={avatarStyle}
                draggable={false}
                alt="Default Avatar"
            />
        </div>
    );
};

export default UserAvatar;
