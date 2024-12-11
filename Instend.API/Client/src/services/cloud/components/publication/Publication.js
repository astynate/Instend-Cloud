import React from 'react';
import { observer } from 'mobx-react-lite';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import Attachments from '../../ui-kit/attachments/Attachments';
import PublicationControlPanel from '../../elements/publication-elements/publication-control-panel/PublicationControlPanel';

const Publication = observer(({
        publication, 
        isControlHidden = false,
        isHasPaddings = false,
        isAttachmentsHidden = false
    }) => {

    if (!!publication === false || !!publication.account === false) {
        return null;
    }

    return (
        <div className={styles.publication} paddingstate={isHasPaddings ? 'visible': 'hidden'}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <UserAvatar size={42} />
                    <div className={styles.information}>
                        <span className={styles.nickname}>{publication.account ? publication.account.nickname : "Unknown"}</span>
                        <span className={styles.time}>{publication ? ConvertDate(publication.date) : "Friday 13, 1666"}</span>
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
                <span className={styles.text}>{publication ? publication.text : ""}</span>
                {isAttachmentsHidden === false && 
                    <div className={styles.attachments}>
                        <Attachments 
                            attachments={publication.attachments} 
                        />
                    </div>}
            </div>
            {isControlHidden === false && 
                <PublicationControlPanel 
                    numberOfReactions={publication.numberOfReactions}
                    numberOfComments={publication.numberOfComments}
                    numberOfViews={publication.numberOfViews}
                />
            }
        </div>
    );
});

export default Publication;