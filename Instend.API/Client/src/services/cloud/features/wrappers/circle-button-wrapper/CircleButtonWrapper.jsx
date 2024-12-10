import styles from './main.module.css';

const CircleButtonWrapper = ({children, widthPaddings = 16, heightPaddings = 7}) => {
    return (
        <div className={styles.wrapper} style={{padding: `${heightPaddings}px ${widthPaddings}px`}}>
            {children}
        </div>
    );
};

export default CircleButtonWrapper;