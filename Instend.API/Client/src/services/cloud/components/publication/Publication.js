import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import likeImage from './images/like.png';
import commentImage from './images/comment.png';
import shareImage from './images/share.png';
import Attachments from '../../ui-kit/attachments/Attachments';

const Publication = observer(({
        user, 
        comment, 
        isLoading, 
        isUploading, 
        deleteCallback, 
        type = 0, 
        setLike = () => {}
    }) => {

    return (
        <div className={styles.comment}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <UserAvatar size={42} />
                    <div className={styles.information}>
                        <span className={styles.nickname}>{user ? user.nickaname : "Unknown"}</span>
                        <span className={styles.time}>{comment ? comment.date : "Friday 13, 1666"}</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <BurgerMenu 
                        items={[

                        ]}
                    />
                </div>
            </div>
            <div className={styles.postContent}>
                <span className={styles.text}>Some text</span>
                <Attachments />
            </div>
            <div className={styles.control}>
                <div className={styles.buttons}>
                    <button className={styles.button}>
                        <img src={likeImage} />
                    </button>
                    <button className={styles.button}>
                        <img src={commentImage} />
                    </button>
                    <button className={styles.button}>
                        <img src={shareImage} />
                    </button>
                </div>
                <div className={styles.statistics}>
                    <span><b>120K </b>Comments</span>
                    <span><b>100M </b>Views</span>
                </div>
            </div>
        </div>
    );
});

export default Publication;