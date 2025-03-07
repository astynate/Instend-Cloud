import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './main.module.css';
import likeImage from './images/like.png';
import likeFill from './images/like-fill.png';
import commentImage from './images/comment.png';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton';
import CircleButtonWrapper from '../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper';
import ReactionsPopup from '../../../features/pop-up-windows/reactions-popup/ReactionsPopup';
import PublicationsController from '../../../api/PublicationsController';

const PublicationControlPanel = ({
        publicationId,
        numberOfReactions = 0, 
        numberOfComments = 0, 
        numberOfViews = 0, 
        setReaction = () => {},
        reaction
    }) => {
    
    const [isOpen, setOpenState] = useState(false);
    const [timeoutId, setTimeoutId] = useState();

    const navidate = useNavigate();

    const reactPublication = async () => {
        const reactionId = reaction ? reaction.reactionId : '00000000-0000-0000-0000-000000000001';
        close();

        if (reactionId && publicationId) {
            await PublicationsController.React(publicationId, reactionId);
        };
    };

    const open = () => {
        clearTimeout(timeoutId);
        setOpenState(true);
    };

    const close = () => {
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => setOpenState(false), 250));
    };
    
    return (
        <div className={styles.control}>
            <div className={styles.reactionsControlWrapper}>
                {isOpen && <ReactionsPopup 
                    isOpen={isOpen}
                    setReaction={(reaction) => {close(); setReaction(reaction);}}
                    onMouseOver={open}
                    onMouseLeave={close}
                />}
                <UnitedButton
                    buttons={[
                        {
                            image: <img src={!!reaction ? likeFill : likeImage} draggable="false" />, 
                            label: <div className={styles.statistics}><span><b>{numberOfReactions} </b> Reactions</span></div>,
                            callback: reactPublication,
                            onMouseOver: open,
                            onMouseLeave: close
                        },
                        {
                            image: <img src={commentImage} draggable="false" />, 
                            label: <div className={styles.statistics}><span><b>{numberOfComments}</b></span></div>,
                            callback: () => navidate(`/publication/${publicationId}`)
                        }
                    ]}
                />
            </div>
            <CircleButtonWrapper>
                <div className={styles.statistics}>
                    <span><b>{numberOfViews} </b>Views</span>
                </div>
            </CircleButtonWrapper>
        </div>
    );
};

export default PublicationControlPanel;