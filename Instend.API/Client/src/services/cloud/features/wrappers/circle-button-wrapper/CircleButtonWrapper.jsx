import styles from './main.module.css';

const CircleButtonWrapper = ({children, widthPaddings = 16, heightPaddings = 7, isAccent = false}) => {
    return (
        <button 
            className={styles.wrapper} 
            style={{padding: `${heightPaddings}px ${widthPaddings}px`}}
            accent={isAccent ? 'true' : ''}
        >
            {children}
        </button>
    );
};

export default CircleButtonWrapper;