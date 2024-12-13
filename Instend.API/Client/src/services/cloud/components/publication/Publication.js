import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import ImageAttachments from '../../ui-kit/attachments/ImageAttachments';
import PublicationControlPanel from '../../elements/publication-elements/publication-control-panel/PublicationControlPanel';
import Base64Handler from '../../../../utils/handlers/Base64Handler';
import GlobalContext from '../../../../global/GlobalContext';

const Publication = observer(({
        publication, 
        isControlHidden = false,
        isHasPaddings = false,
        isAttachmentsHidden = false
    }) => {

    const [images, setImages] = useState([]);

    const isPublicationValid = () => {
        if (!!publication === false || !!publication.account === false) {
            return false;
        }

        return true;
    }

    useEffect(() => {
        if (isPublicationValid() === false) 
            return;

        const attachedImages = publication.attachments
            .filter(x => GlobalContext.supportedImageTypes.includes(x.type.toLowerCase()));

        setImages(attachedImages);
    }, []);

    if (isPublicationValid() === false) {
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
                        buttons={[
                            {title: "Report"},
                            {title: "Edit"},
                            {title: "Delete", isDangerousOperation: true}
                        ]}
                    />
                </div>
            </div>
            <div className={styles.postContent}>
                <span className={styles.text}>{publication ? publication.text : ""}</span>
                {isAttachmentsHidden === false && images.length > 0 &&
                    <div className={styles.attachments}>
                        <ImageAttachments 
                            attachments={images} 
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