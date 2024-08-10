import React, { useState } from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import { ConvertDate } from '../../../../../utils/DateHandler';
import Loader from '../../loader/Loader';
import BurgerMenu from '../../ui-kit/burger-menu/BurgerMenu';
import StatisticButton from './elements/statistic-button/StatisticButton';
import save from './images/save.png';
import commentImage from './images/comment.png';
import views from './images/view.png';
import like from './images/like.png';
import likeFill from './images/like-fill.png';
import Preview from '../../../../preview/layout/Preview';
import FileAPI from '../../../api/FileAPI';
import { PreviewVideo } from '../../../../preview/widgets/files/PreviewVideo/PreviewVideo';
import Base64Handler from '../../../../../utils/handlers/Base64Handler';
import statistic from './images/statistics.png';
import { instance } from '../../../../../state/Interceptors';
import { observer } from 'mobx-react-lite';

const Comment = observer(({
        user, 
        comment, 
        isLoading, 
        isUploading, 
        deleteCallback, 
        type = 0, 
        setLike = () => {}
    }) => {

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
                    <div className={styles.textWrapper}>
                        {comment.text.split('\r\n').map((part, index) => (
                            <span 
                                key={comment.id + index + "text"}
                                className={styles.text}
                            >
                                {part}
                            </span>
                        ))}
                    </div>
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
                    <div className={styles.control}>
                        <div className={styles.left}>
                            <StatisticButton 
                                image={comment && comment.isLiked ? likeFill : like} 
                                isDefault={comment && comment.isLiked}
                                title={`${comment.likes} Likes`} 
                                callback={async () => {
                                    await instance.post(`/api/publiction-activity/like?id=${comment.id}`)
                                        .then(response => {
                                            setLike(comment.id, response.data);
                                        });
                                }}
                            />
                            <div className={styles.border}></div>
                            <StatisticButton 
                                image={commentImage}
                                title={`${comment.comments} Comments`} 
                            />
                            <div className={styles.border}></div>
                            <StatisticButton 
                                image={statistic}
                                title={`${comment.views} Views`} 
                            />
                        </div>
                        <div className={styles.left}>
                            <StatisticButton 
                                image={save}
                                // title={"Save in storage"} 
                            />
                        </div>
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
});

export default Comment;