import styles from './main.module.css';

const Switch = ({isActive}) => {
    return (
        <div className={styles.switch} id={isActive ? "active" : null}>
            <div className={styles.circle}></div>
        </div>
    );
}

export default Switch;