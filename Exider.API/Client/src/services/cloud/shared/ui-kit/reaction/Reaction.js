import React from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import love from './images/love.png';

const Reaction = ({user}) => {
    return (
        <div className={styles.reaction} draggable="false">
            <img src={love} className={styles.emoji} draggable="false" />
            <UserAvatar />
        </div>
    );
};

export default Reaction;