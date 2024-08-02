import React, { useState } from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import userState from '../../../../../states/user-state';
import Button from '../button/Button';
import SubInput from '../sub-input/SubInput';
import StatisticButton from '../../social/comment/elements/statistic-button/StatisticButton';
import smile from './images/smiling-face.png';
import image from './images/image.png';
import Emoji from '../../../features/emoji/Emoji';
import cancel from './images/cancel.png';

const CommentField = ({id, setUploadingComment, isPublications}) => {
    const [comment, setComment] = useState('');
    const [isEmojiOpen, setEmojiPickerState] = useState(false);
    const [images, setImages] = useState([]);
    const [imagesUrls, setImagesUrls] = useState([]);

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            const filesArray = Array.from(event.target.files).slice(0, 9);
            setImages(filesArray);

            const filesUrls = filesArray.map((file) => URL.createObjectURL(file));
            setImagesUrls(filesUrls);
        }
    };

    const sendComment = async () => {
        if (id && comment !== null && comment !== '') {
            await setUploadingComment(comment, images, userState.user, id);
            setComment('');
            setImages([]);
            setImagesUrls([]);
        }
    }

    return (
        <div className={styles.commentField}>
            <input type="file" id="file-upload" style={{ display: 'none' }} multiple onChange={handleFileChange} />
            <UserAvatar user={userState.user} />
            <div className={styles.inputData}>
                <SubInput 
                    placeholder={isPublications ? "Your publication text" : "Type your comment"}
                    text={comment}
                    setText={setComment}
                />
                <div className={styles.images}>
                    {imagesUrls.map((url, index) => (
                        <div className={styles.imageWrapper} key={index}>
                            <div 
                                className={styles.closeButton}
                                onClick={() => {
                                    const newImages = [...images];
                                    newImages.splice(index, 1);
                                    setImages(newImages);
                            
                                    const newImagesUrls = [...imagesUrls];
                                    newImagesUrls.splice(index, 1);
                                    setImagesUrls(newImagesUrls);
                                }}
                            >
                                <img src={cancel} className={styles.cancel} />
                            </div>
                            <img 
                                src={url} 
                                className={styles.imagePreview}
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
                <div className={styles.control}>
                    <div className={styles.button}>
                        <StatisticButton 
                            image={smile} 
                            callback={() => setEmojiPickerState(true)}
                        />
                        <Emoji 
                            open={isEmojiOpen}
                            close={() => setEmojiPickerState(false)}
                            callback={(emoji) => {setComment(prev => prev += emoji)}}
                        />
                    </div>
                    <StatisticButton 
                        image={image}
                        callback={() => document.getElementById('file-upload').click()}
                    />
                </div>
            </div>
            <Button 
                value="Comment" 
                callback={sendComment} 
                isEnter={true}
            />
        </div>
    );
 };

export default CommentField;