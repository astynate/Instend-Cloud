import styles from './main.module.css';

const Chat = (props) => {
    return (
        <div className={styles.chatWrapper}>
            <div className={styles.chat}>
                {props.children}
            </div>
        </div>
    );
};

export default Chat;