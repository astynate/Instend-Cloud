import styles from './main.module.css';

const AlertMesssage = ({message}) => {
    return (
        <div className={styles.alert}>
            <span className={styles.messageText}>{message}</span>
        </div>
    );
}

export default AlertMesssage;