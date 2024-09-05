import styles from './main.module.css';

const ChatPlaceholder = ({title, subTitle}) => {
    return (
        <div className={styles.chatPlaceholder}>
            <h1>{title}</h1>
            <span>{subTitle}</span>
        </div>
    );
}

export default ChatPlaceholder;