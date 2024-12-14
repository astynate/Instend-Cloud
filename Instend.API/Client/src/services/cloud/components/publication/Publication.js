import React, { useEffect, useState } from 'react';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import ImageAttachments from '../../ui-kit/attachments/ImageAttachments';
import PublicationControlPanel from '../../elements/publication-elements/publication-control-panel/PublicationControlPanel';
import GlobalContext from '../../../../global/GlobalContext';
import CreatePublicationPopup from '../../features/pop-up-windows/create-publication-popup/CreatePublicationPopup';
import AccountState from '../../../../state/entities/AccountState';
import PublicationsController from '../../api/PublicationsController';

const Publication = ({
        publication, 
        isControlHidden = false,
        isHasPaddings = false,
        isAttachmentsHidden = false
    }) => {

    const [images, setImages] = useState([]);
    const [isEditingWindowOpen, setEditingWindowState] = useState(false);

    const UserOwnerControl = [
        {title: "Edit", callback: () => setEditingWindowState(true)},
        {title: "Delete", isDangerousOperation: true}
    ];

    const UserViewerControl = [
        {title: "Report"},
    ];

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
        <>
            <CreatePublicationPopup 
                isOpen={isEditingWindowOpen}
                close={() => setEditingWindowState(false)}
                publication={publication}
                callback={async (text, attachments, setLoadingState) => 
                    PublicationsController.UpdatePublication(publication.id, text, attachments, setLoadingState)}
            />
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
                            buttons={publication.account.id === AccountState.account.id ? 
                                UserOwnerControl : UserViewerControl}
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
        </>
    );
};

export default Publication;