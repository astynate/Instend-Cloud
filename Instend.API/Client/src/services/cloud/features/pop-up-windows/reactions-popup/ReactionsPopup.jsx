import GlobalReactions from '../../../../../global/GlobalReactions';
import styles from './main.module.css';

const ReactionsPopup = ({isOpen = false, setReaction = () => {}, onMouseOver = () => {}, onMouseLeave = () => {}}) => {
    return (
        <div className={styles.reactions} state={isOpen ? 'open' : null} onMouseOver={onMouseOver} onMouseLeave={onMouseLeave}>
            {Object.entries(GlobalReactions).map(([id, reaction]) => {
                return (
                    <div className={styles.reaction} key={id}>
                        <img 
                            src={reaction.image} 
                            draggable="false" 
                            onClick={() => setReaction(id)}
                        />
                    </div>
                )
            })}
        </div>
    );
};

export default ReactionsPopup;