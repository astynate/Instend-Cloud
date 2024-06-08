import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import CommentField from '../../../shared/ui-kit/comment-field/CommentField';
import Comment from '../../../shared/social/comment/Comment';
import PublicationsWrapper from '../../../features/publications-wrapper/PublicationsWrapper';

const Comments = ({fetch_callback, comments, id, setUploadingComment, deleteCallback, isPublicationAvailable = true, isPublications = false}) => {
    const [isLoading, setLoadingState] = useState(false);

    useEffect(() => {
        if (fetch_callback) {
            (async () => {
                setLoadingState(true);
                await fetch_callback();
                setLoadingState(false);
            })();
        } else {
            setLoadingState(false);
        }
    }, []);

    return (
        <PublicationsWrapper>
            <div className={styles.comment}>
                {isPublicationAvailable && 
                    <CommentField 
                        id={id} 
                        isPublications={isPublications}
                        setUploadingComment={setUploadingComment.bind(this)}
                    />}
                {isLoading ? 
                    <>
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                        <Comment isLoading={true} />
                    </>
                :
                    comments && comments.map && comments.map((element, index) => {
                        if (element.isUploading) {
                            return (
                                <Comment 
                                    key={index}
                                    isUploading={true}
                                    comment={element.comment} 
                                    user={element.user} 
                                />
                            )
                        } else {
                            return (
                                <Comment 
                                    key={element.comment.id}
                                    comment={element.comment} 
                                    user={element.user}
                                    deleteCallback={deleteCallback}
                                />
                            )
                        }
                    })}
            </div>
        </PublicationsWrapper>
    );
 };

export default Comments;