import styles from './main.module.css';

const HorizontalScrollWrapper = ({children}) => {
    return (
        <div className={styles.horizontalScroll}>
            {children}
        </div>
    );
};

export default HorizontalScrollWrapper;