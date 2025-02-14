import styles from './main.module.css';
import arrow from './images/arrow.svg';

const ChatContentHeader = ({title, back = () => {}, rightItem = <></>}) => {
    return (
        <div className={styles.header}>
            <div className={styles.left}>
                <img 
                    src={arrow} 
                    className={styles.back}
                    draggable="false"
                    onClick={back}
                />
                <h2 className={styles.title}>{title}</h2>
            </div>
            {rightItem}
        </div>
    );
};

export default ChatContentHeader;