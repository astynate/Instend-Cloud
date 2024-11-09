import styles from './main.module.css';

const PointsLoaderAnimation = () => {
    return (
        <div className={styles.wrapper}>
            <div className={styles.point}></div>
            <div className={styles.point}></div>
            <div className={styles.point}></div>
        </div>
    );
}

export default PointsLoaderAnimation;