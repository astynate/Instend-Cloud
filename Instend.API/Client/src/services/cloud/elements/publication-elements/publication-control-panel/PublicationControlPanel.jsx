import styles from './main.module.css';
import likeImage from './images/like.png';
import commentImage from './images/comment.png';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton';
import CircleButtonWrapper from '../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper';
import ReactionsPopup from '../../../features/pop-up-windows/reactions-popup/ReactionsPopup';
import { useState } from 'react';

const PublicationControlPanel = ({numberOfReactions = 0, numberOfComments = 0, numberOfViews = 0, setReaction={setReaction}}) => {
    const [isOpen, setOpenState] = useState(false);
    
    return (
        <div className={styles.control}>
            <div 
                className={styles.reactionsWrapper} 
                onMouseOver={() => setOpenState(true)}
                onMouseLeave={() => setOpenState(false)}
            >
                <ReactionsPopup 
                    isOpen={isOpen}
                    setReaction={setReaction}
                />
                <UnitedButton
                    buttons={[
                        {
                            image: <img src={likeImage} draggable="false" />, 
                            label: <div className={styles.statistics}><span><b>{numberOfReactions} </b> Reactions</span></div>
                        },
                        {
                            image: <img src={commentImage} draggable="false" />, 
                            label: <div className={styles.statistics}><span><b>{numberOfComments}</b></span></div>
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