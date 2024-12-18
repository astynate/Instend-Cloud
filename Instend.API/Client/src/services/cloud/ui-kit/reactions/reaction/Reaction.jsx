import GlobalReactions from '../../../../../global/GlobalReactions';
import styles from './main.module.css';

const Reaction = ({avatar, reactionId, numberOf = 1, callback = () => {}}) => {
    return (
        <div className={styles.reaction} onClick={callback}>
            <img 
                src={GlobalReactions[reactionId].image} 
                className={styles.reactionImage} 
                draggable="false"
            />
            {avatar ? 
                <img src={avatar} draggable="false" /> 
            : 
                <span>{numberOf}</span>
            }
        </div>
    );
};

export default Reaction;