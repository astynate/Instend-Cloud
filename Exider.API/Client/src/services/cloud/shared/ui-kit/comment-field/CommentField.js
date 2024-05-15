import React, { useState } from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import userState from '../../../../../states/user-state';
import Button from '../button/Button';
import SubInput from '../sub-input/SubInput';

const CommentField = ({id, setUploadingComment}) => {
    const [comment, setComment] = useState('');

    const sendComment = async () => {
        if (id && comment !== null && comment !== '') {
            await setUploadingComment(comment, userState.user, id);
            setComment('');
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
            <Button 
                value="Comment" 
                callback={sendComment} 
                isEnter={true}
            />
        </div>
    );
 };

export default CommentField;