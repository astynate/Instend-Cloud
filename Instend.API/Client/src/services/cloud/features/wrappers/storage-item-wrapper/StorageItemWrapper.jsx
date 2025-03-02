import styles from './main.module.css';

const StorageItemWrapper = ({children}) => {
    return (
        <div className={styles.wrapper}>
            {children}
        </div>
    );
};

export default StorageItemWrapper;