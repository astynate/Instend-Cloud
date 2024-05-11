import React from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import userState from '../../../../../states/user-state';
import Button from '../button/Button';
import SubInput from '../sub-input/SubInput';

const CommentField = () => {
    return (
        <div className={styles.commentField}>
            <UserAvatar user={userState.user} />
            <SubInput placeholder="Type your comment" />
            <Button value="Comment" />
        </div>
    );
 };

export default CommentField;