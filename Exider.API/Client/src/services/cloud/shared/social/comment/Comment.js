import React from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import { ConvertFullDate } from '../../../../../utils/DateHandler';

const Comment = ({user, comment}) => {
    if (user && comment) {
        return (
            <div className={styles.comment}>
                <UserAvatar user={user} />
                <div className={styles.information}>
                    <div className={styles.nameWrapper}>
                        <span className={styles.name}>{comment.user.name}</span>
                        <span className={styles.time}>{ConvertFullDate(comment.date)}</span>
                    </div>
                    <span className={styles.text}>{comment.text}</span>
                </div>
            </div>
        );
    } else {
        return null;
    }
 };

export default Comment;