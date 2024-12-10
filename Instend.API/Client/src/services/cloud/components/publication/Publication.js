import React from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import Attachments from '../../ui-kit/attachments/Attachments';
import PublicationControlPanel from '../../elements/publication-elements/publication-control-panel/PublicationControlPanel';

const Publication = observer(({
        account,
        publication, 
        isControlHidden = false,
        isHasPaddings = false,
        isAttachmentsHidden = false
    }) => {

    return (
        <div className={styles.publication} paddingstate={isHasPaddings ? 'visible': 'hidden'}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <UserAvatar size={42} />
                    <div className={styles.information}>
                        <span className={styles.nickname}>{account ? account.nickaname : "Unknown"}</span>
                        <span className={styles.time}>{publication ? publication.date : "Friday 13, 1666"}</span>
                    </div>
                </div>
                <div className={styles.right}>
                    {/* <CircleButtonWrapper heightPaddings={0} widthPaddings={4}> */}
                    <BurgerMenu 
                        items={[

                        ]}
                    />
                    {/* </CircleButtonWrapper> */}
                </div>
            </div>
            <div className={styles.postContent}>
                <span className={styles.text}>{publication ? publication.text : ""}</span>
                {isAttachmentsHidden === false && 
                    <div className={styles.attachments}>
                        <Attachments />
                    </div>}
            </div>
            {isControlHidden === false && 
                <PublicationControlPanel />}
        </div>
    );
});

export default Publication;