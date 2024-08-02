import React from 'react';
import styles from './main.module.css';
import UserAvatar from '../../../widgets/avatars/user-avatar/UserAvatar';
import { ConvertDate } from '../../../../../utils/DateHandler';
import Loader from '../../loader/Loader';
import BurgerMenu from '../../ui-kit/burger-menu/BurgerMenu';
import StatisticButton from './elements/statistic-button/StatisticButton';
import smile from './images/smile.png';
import commentImage from './images/comment.png';
import views from './images/view.png';

const Comment = ({user, comment, isLoading, isUploading, deleteCallback}) => {
    const getViewType = (count) => {
        let type = 1;

        if (count >= 1 && count <= 3) {
            type = count;
        }

        if (count >= 3) {
            type = 3;
        }

        return `view-type-${type}`;
    }

    if (user && comment) {
        return (
            <div className={styles.comment}>
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
                    {comment && comment.attechments && comment.attechments.length && comment.attechments.length > 0 ?
                        <div className={styles.attachments} id={getViewType(comment.attechments.length)}>
                            {comment.attechments.map((element, index) => {
                                if (element.file) {
                                    return (
                                        <div 
                                            className={styles.image}
                                            key={index}
                                        >
                                            <img 
                                                src={`data:image/png;base64,${element.file}`} 
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


{/* <div className={styles.control}>
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
</div> */}