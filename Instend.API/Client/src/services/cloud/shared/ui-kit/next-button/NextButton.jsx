import styles from './main.module.css';
import next from './next.png';

export const ButtonDirections = {
    top: 'top',
    left: 'left',
    right: 'right',
    bottom: 'bottom'
}

const NextButton = ({callback = () => {}, direction=ButtonDirections.right}) => {
    return (
        <div 
            className={styles.next} 
            direction={direction}
            onClick={callback}
        >
            <img src={next} draggable="false" />
        </div>
    );
}

export default NextButton;