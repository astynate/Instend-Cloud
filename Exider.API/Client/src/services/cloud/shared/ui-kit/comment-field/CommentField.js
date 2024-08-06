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
    const [video, setVideo] = useState(null);
    const validFormats = ['audio', 'video', 'image'];

    const getFileType = (file) => {
        return file && file.type ? file.type.split('/')[0] : null;
    }

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            let files = Array.from(event.target.files).filter(file => {
                return validFormats.includes(getFileType(file));
            });

            if (files.length > 0) {
                let videoFile = files.find(file => {
                    return getFileType(file) === 'video';
                });

                if (videoFile !== null && videoFile !== undefined) {
                    setVideo(videoFile);
                } else {
                    console.log(files)
                    const filesArray = Array.from(files).slice(0, 9);
                    setImages(filesArray);
                }
            }
        }
    };

    const sendComment = async () => {
        if (id && comment !== null && comment !== '') {
            const commetValue = comment;
            const imagesValue = images;
            const videoValue = video;

            setComment('');
            setImages([]);
            setVideo(null);

            await setUploadingComment(commetValue, [...imagesValue, videoValue], userState.user, id);
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
                    {video != null &&
                        <div className={styles.imageWrapper}>
                            <div 
                                className={styles.closeButton}
                                onClick={() => {
                                    setVideo(null);
                                }}
                            >
                                <img src={cancel} className={styles.cancel} />
                            </div>
                            <video controls>
                                <source src={URL.createObjectURL(video)} type="video/mp4" />
                            </video>
                        </div>}
                    {images.map((url, index) => (
                        <div className={styles.imageWrapper} key={index}>
                            <div 
                                className={styles.closeButton}
                                onClick={() => {
                                    const newImages = [...images];
                                    newImages.splice(index, 1);
                                    setImages(newImages);
                                }}
                            >
                                <img src={cancel} className={styles.cancel} />
                            </div>
                            <img 
                                src={URL.createObjectURL(url)} 
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