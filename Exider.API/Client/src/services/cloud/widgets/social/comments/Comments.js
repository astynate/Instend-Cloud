import React from 'react';
import styles from './main.module.css';
import CommentField from '../../../shared/ui-kit/comment-field/CommentField';
import Comment from '../../../shared/social/comment/Comment';

const Comments = () => {
    return (
        <div className={styles.comment}>
            <CommentField />
            <Comment />
        </div>
    );
 };

export default Comments;