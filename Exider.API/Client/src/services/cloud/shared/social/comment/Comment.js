import React, { useState } from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import { ConvertDate } from '../../../../../utils/DateHandler';
import Loader from '../../loader/Loader';
import BurgerMenu from '../../ui-kit/burger-menu/BurgerMenu';
import StatisticButton from './elements/statistic-button/StatisticButton';
import smile from './images/smile.png';
import commentImage from './images/comment.png';
import views from './images/view.png';
import Preview from '../../../../preview/layout/Preview';
import FileAPI from '../../../api/FileAPI';
import { PreviewVideo } from '../../../../preview/widgets/files/PreviewVideo/PreviewVideo';
import Base64Handler from '../../../../../utils/handlers/Base64Handler';

const Comment = ({user, comment, isLoading, isUploading, deleteCallback, type = 0}) => {
    const [isPreviewOpen, setPreviewState] = useState(false);
    const [index, setIndex] = useState(0);

    const isAttechmentsExist = () => {
        return comment && 
               comment.attechments && 
               comment.attechments.length && 
               comment.attechments.length > 0;
    } 

    const getViewType = (count) => {
        let type = 1;

        if (count >= 1 && count <= 3) {
            type = count;
        }

        if (count >= 3) {
            type = count % 2 == 0 ? 2 : 3;
        }

        return `view-type-${type}`;
    }

    if (user && comment) {
        return (
            <div className={styles.comment}>
                {isPreviewOpen && isAttechmentsExist() &&
                    <Preview 
                        close={() => setPreviewState(false)}
                        files={comment.attechments}
                        index={index}
                        fullFileLoadEndpoint={"/api/publictions/full"}
                        partialFileLoadEndpoint={"fghfgh"}
                        additionalParams={{
                            publictionId: comment.id
                        }}
                    />
                }
                <div className={styles.header}>
                    <UserAvatar user={user} />
                    <div className={styles.header}>
                        <div className={styles.nameWrapper}>
                            <span className={styles.name}>{user.nickname ? user.nickname : 'Unknow'}</span>
                            <span className={styles.time}>{comment.date ? ConvertDate(comment.date) : null}</span>
                        </div>
                    </div>
                    {isUploading ? 
                        <div className={styles.right}>
                            <Loader />
                        </div>
                    : 
                        <div className={styles.right}>
                            <BurgerMenu 
                                items={[
                                    {title: "Delete", callback: () => {deleteCallback(comment.id)}},
                                ]}
                            />
                        </div>
                    }
                </div>
                <div className={styles.postContent}>
                    {isAttechmentsExist() ?
                        <div className={styles.attachments} id={getViewType(comment.attechments.length)}>
                            {comment.attechments.map((element, index) => {
                                if (FileAPI.videoTypes.includes(element.type)) {
                                    return (
                                        <PreviewVideo
                                            file={element}
                                            key={element.id + "video"}
                                            endpoint="/api/publictions/stream"
                                            domain={FileAPI.domain}
                                            additionalParams={{
                                                publictionId: comment.id,
                                                type: type
                                            }}
                                            preview={Base64Handler.Base64ToUrlFormatPng(element.preview)}
                                            autoplay={true}
                                        />
                                    );
                                }

                                if (element.preview) {
                                    return (
                                        <div 
                                            className={styles.image}
                                            key={element.id + "image"}
                                            onClick={() => {
                                                setPreviewState(true);
                                                setIndex(index);
                                            }}
                                        >
                                            <img 
                                                src={`data:image/png;base64,${element.preview}`} 
                                                draggable="false" 
                                            />
                                        </div>
                                    )
                                } else {
                                    return null;
                                }
                            })}
                    </div> : null}
                    <span className={styles.text}>{comment.text}</span>
                    <div className={styles.control}>
                        <StatisticButton 
                            image={smile} 
                            title={"0"} 
                        />
                        <StatisticButton 
                            image={commentImage}
                            title={"0"} 
                        />
                        <StatisticButton 
                            image={views}
                            title={"0"} 
                        />
                    </div>
                </div>
            </div>
        );
    } else if (isLoading === true) {
        return (
            <div className={styles.comment}>
                <div className={styles.avatarPreview}></div>
                <div className={styles.information}>
                    <div className={styles.namePreview}></div>
                    <div className={styles.textPreview}></div>
                </div>
            </div>
        );
    } else {
        return null;
    }
 };

export default Comment;