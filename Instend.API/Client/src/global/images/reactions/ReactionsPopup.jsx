import styles from './main.module.css';
import congratulations from './congratulations.gif';
import cryingFace from './crying-face.gif';
import faceInLove from './face-in-love.gif';
import heart from './heart.gif';
import poutingCat from './pouting-cat.gif';
import screamingFace from './screaming-face.gif';

const ReactionsPopup = ({isOpen = false, setReaction = () => {}}) => {
    const reactions = [
        {id: "00000000-0000-0000-0000-000000000001", image: heart},
        {id: "00000000-0000-0000-0000-000000000002", image: faceInLove},
        {id: "00000000-0000-0000-0000-000000000003", image: cryingFace},
        {id: "00000000-0000-0000-0000-000000000004", image: screamingFace},
        {id: "00000000-0000-0000-0000-000000000005", image: poutingCat},
        {id: "00000000-0000-0000-0000-000000000006", image: congratulations},
    ];

    return (
        <div className={styles.reactions} state={isOpen ? 'open' : null}>
            {reactions.map((reaction, index) => {
                return (
                    <div className={styles.reaction} key={index}>
                        <img 
                            src={reaction.image} 
                            draggable="false" 
                            onClick={() => setReaction(reaction.id)}
                        />
                    </div>
                )
            })}
        </div>
    );
};

export default ReactionsPopup;