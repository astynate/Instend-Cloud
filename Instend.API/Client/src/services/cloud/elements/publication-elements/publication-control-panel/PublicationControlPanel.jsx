import styles from './main.module.css';
import likeImage from './images/like.png';
import commentImage from './images/comment.png';
import UnitedButton from '../../../ui-kit/buttons/united-button/UnitedButton';
import CircleButtonWrapper from '../../../features/wrappers/circle-button-wrapper/CircleButtonWrapper';

const PublicationControlPanel = ({numberOfReactions = 0, numberOfComments = 0, numberOfViews = 0}) => {
    return (
        <div className={styles.control}>
            <UnitedButton 
                buttons={[
                    {image: <img src={likeImage} draggable="false" />, label: <div className={styles.statistics}><b>{numberOfReactions}</b></div>},
                    {image: <img src={commentImage} draggable="false" />, label: <div className={styles.statistics}><b>{numberOfComments}</b></div>}
                ]}
            />
            <CircleButtonWrapper>
                <div className={styles.statistics}>
                    <span><b>{numberOfViews} </b>Views</span>
                </div>
            </CircleButtonWrapper>
        </div>
    );
};

export default PublicationControlPanel;