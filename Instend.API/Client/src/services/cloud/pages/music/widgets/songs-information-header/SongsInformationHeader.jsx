import styles from './main.module.css';

const SongsInformationHeader = () => {
    return (
        <div className={styles.songListHeader}>
            <div className={styles.name}>
                <span className={styles.item}>#</span>
                <span className={styles.item}>Name</span>
            </div>
            <span className={styles.item}>Album</span>
            <span className={styles.item}>Date</span>
            <span className={styles.item}>Time</span>
        </div>
    );
};

export default SongsInformationHeader;