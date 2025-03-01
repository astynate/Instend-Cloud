import React, { useEffect, useState } from 'react';
import { ConvertDate } from '../../../../handlers/DateHandler';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import UserAvatar from '../../shared/avatars/user-avatar/UserAvatar';
import BurgerMenu from '../../shared/context-menus/burger-menu/BurgerMenu';
import ImageAttachments from '../../ui-kit/attachments/ImageAttachments';
import PublicationControlPanel from '../../elements/publication-elements/publication-control-panel/PublicationControlPanel';
import GlobalContext from '../../../../global/GlobalContext';
import CreatePublicationPopup from '../../features/pop-up-windows/create-publication-popup/CreatePublicationPopup';
import AccountState from '../../../../state/entities/AccountState';
import PublicationsController from '../../api/PublicationsController';
import Reaction from '../../ui-kit/reactions/reaction/Reaction';

const Publication = observer(({
        publication, 
        isControlHidden = false,
        isHasPaddings = false,
        isAttachmentsHidden = false
    }) => {

    const [images, setImages] = useState([]);
    const [reaction, setReaction] = useState();
    const [isEditingWindowOpen, setEditingWindowState] = useState(false);

    const UserOwnerControl = [
        {title: "Edit", callback: () => setEditingWindowState(true)},
        {title: "Delete", isDangerousOperation: true, callback: async () => {
            if (publication && publication.id) {
                await PublicationsController.Delete(publication.id);
            }
        }}
    ];

    const UserViewerControl = [
        {title: "Report"},
    ];

    const isPublicationValid = () => {
        if (!!publication === false || !!publication.account === false) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (isPublicationValid() === false) 
            return;

        const attachedImages = publication.attachments
            .filter(x => GlobalContext.supportedImageTypes.includes(x.type.toLowerCase()));

        const isHasImages = attachedImages && attachedImages.length;
        const IsImagesCountZero = attachedImages.length === 0;

        setImages(isHasImages && !IsImagesCountZero ? attachedImages : []);
    }, [publication.attachments]);

    useEffect(() => {
        if (isPublicationValid() === false) 
            return;

        if (!!reaction === false) 
            return;

        PublicationsController.React(publication.id, reaction);
        setReaction(null);
    }, [reaction]);

    if (isPublicationValid() === false) {
        return null;
    };

    return (
        <>
            <CreatePublicationPopup 
                isOpen={isEditingWindowOpen}
                close={() => setEditingWindowState(false)}
                publication={publication}
                callback={async (text, attachments, onStart, onSuccess, onError) => 
                    PublicationsController.UpdatePublication(publication.id, text, attachments, onStart, onSuccess, onError)}
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
                {publication.groupedReactions.length > 0 && <div className={styles.reactions}>
                    {publication.groupedReactions.map(r => {
                        return (
                            <Reaction 
                                key={r.reactionId}
                                reactionId={r.reactionId}
                                numberOf={r.count} 
                                callback={() => PublicationsController.React(publication.id, r.reactionId)}
                            />
                        )
                    })}
                </div>}
                {isControlHidden === false && 
                    <PublicationControlPanel 
                        publicationId={publication.id}
                        reaction={publication.groupedReactions.find(x => x.targetAccountReaction)}
                        numberOfReactions={publication.numberOfReactions}
                        numberOfComments={publication.numberOfComments}
                        numberOfViews={publication.numberOfViews}
                        setReaction={setReaction}
                    />
                }
            </div>
        </>
    );
});

export default Publication;