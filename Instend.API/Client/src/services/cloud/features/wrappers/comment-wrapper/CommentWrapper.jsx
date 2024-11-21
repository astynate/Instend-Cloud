import styles from './main.module.css';

const CommentWrapper = ({children}) => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.border}></div>
            {children}
        </div>
    );
};

export default CommentWrapper;