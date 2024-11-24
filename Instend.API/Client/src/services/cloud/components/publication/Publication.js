import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import Attachments from '../../ui-kit/attachments/Attachments';
import PublicationControlPanel from '../../elements/publication-elements/publication-control-panel/PublicationControlPanel';

const Publication = observer(({
        user, 
        comment, 
        isLoading, 
        isUploading, 
        deleteCallback, 
        type = 0, 
        setLike = () => {},
        isControlHidden = false,
        isHasPaddings = false,
        isAttachmentsHidden = false
    }) => {

    return (
        <div className={styles.comment} paddingstate={isHasPaddings ? 'visible': 'hidden'}>
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
                {isAttachmentsHidden === false && 
                    <div className={styles.attachments}>
                        <Attachments />
                    </div>}
            </div>
            {isControlHidden === false && <PublicationControlPanel />}
        </div>
    );
});

export default Publication;