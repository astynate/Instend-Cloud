import React from 'react';
import styles from './main.module.css';
import CommentField from '../../../shared/ui-kit/comment-field/CommentField';
import Comment from '../../../shared/social/comment/Comment';
import PublicationsWrapper from '../../../features/publications-wrapper/PublicationsWrapper';

const PublicationList = ({
        setLike = () => {}, 
        comments, 
        id, 
        setUploadingComment, 
        deleteCallback, 
        isPublicationAvailable = true, 
        isPublications = false,
        type = 0
    }) => {

    return (
        <PublicationsWrapper>
            <div className={styles.comment}>
                {isPublicationAvailable && 
                    <CommentField 
                        id={id} 
                        isPublications={isPublications}
                        setUploadingComment={setUploadingComment.bind(this)}
                    />}
                {comments && comments.map && comments.map((element, index) => {
                    if (element.isUploading) {
                        return (
                            <Comment 
                                key={element.comment.id + "comment"}
                                isUploading={true}
                                comment={element.comment} 
                                user={element.user} 
                            />
                        )
                    } else {
                        return (
                            <Comment 
                                key={element.comment.id + "comment"}
                                comment={element.comment} 
                                user={element.user}
                                deleteCallback={deleteCallback}
                                setLike={setLike}
                            />
                        )
                    }
                })}
            </div>
        </PublicationsWrapper>
    );
 };

export default PublicationList;