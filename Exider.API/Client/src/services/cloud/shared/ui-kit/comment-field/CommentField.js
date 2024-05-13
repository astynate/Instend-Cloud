import React, { useState } from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import userState from '../../../../../states/user-state';
import Button from '../button/Button';
import SubInput from '../sub-input/SubInput';

const CommentField = ({id, setUploadingComment}) => {
    const [comment, setComment] = useState('');

    const sendComment = async () => {
        if (id) {
            setUploadingComment(comment, userState.user, id)
        }
    }

    return (
        <div className={styles.commentField}>
            <UserAvatar user={userState.user} />
            <SubInput 
                placeholder="Type your comment" 
                text={comment}
                setText={setComment}
            />
            <Button value="Comment" callback={sendComment} />
        </div>
    );
 };

export default CommentField;