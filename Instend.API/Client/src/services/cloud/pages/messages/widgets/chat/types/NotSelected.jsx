import styles from './main.module.css';

const NotSelected = ({}) => {
    return (
        <div className={styles.notSelected}>
            <h1>Chat is not select</h1>
            <span>You can share albums, posts, collections and more here</span>
        </div>
    );
};

export default NotSelected;