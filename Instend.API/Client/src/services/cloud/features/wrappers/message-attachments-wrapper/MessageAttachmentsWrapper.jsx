import styles from './main.module.css';

const MessageAttachmentsWrapper = ({isCurrentAccountMessage, children}) => {
    return (
        <div 
            className={styles.wrapper} 
            id={isCurrentAccountMessage ? 'currentAccount' : null}
        >
            {children}
        </div>
    );
};

export default MessageAttachmentsWrapper;