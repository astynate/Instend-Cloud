import styles from './main.module.css';

const CircleButtonWrapper = ({children, widthPaddings = 16, heightPaddings = 7}) => {
    return (
        <button 
            className={styles.wrapper} 
            style={{padding: `${heightPaddings}px ${widthPaddings}px`}}
        >
            {children}
        </button>
    );
};

export default CircleButtonWrapper;