import styles from './main.module.css';
import arrow from './images/arrow.png';

const ChatContentLink = ({image, title, action = () => {}}) => {
    return (
        <div className={styles.button} onClick={action}>
            <div className={styles.left}>
                <img 
                    src={image} 
                    draggable="false"
                    className={styles.image}
                />
                <span>{title}</span>
            </div>
            <img 
                src={arrow} 
                draggable="false"
                className={styles.arrow} 
            />
        </div>
    );
};

export default ChatContentLink;