import styles from './main.module.css';

export const PreviewLoader = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.loader} />
        </div>
    );
}