import styles from './main.module.css';
import arrow from './arrow.png';

const Container = () => {
    console.log('!');

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <span className={styles.title}>Name</span>
                <img src={arrow} className={styles.image} />
            </div>
        </div>
    );
}

export default Container;