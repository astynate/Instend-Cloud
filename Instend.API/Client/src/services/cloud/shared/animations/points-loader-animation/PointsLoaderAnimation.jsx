import styles from './main.module.css';

const PointsLoaderAnimation = ({ color = 'var(--main-font-color)', size = '9px', gap = '15px' }) => {
    const wrapperStyles = {
        gridGap: gap 
    };
    
    const pointStyle = {
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: '50%',
        display: 'inline-block',
    };

    return (
        <div className={styles.wrapper} style={wrapperStyles}>
            <div className={styles.point} style={pointStyle}></div>
            <div className={styles.point} style={pointStyle}></div>
            <div className={styles.point} style={pointStyle}></div>
            <div className={styles.point} style={pointStyle}></div>
        </div>
    );
}

export default PointsLoaderAnimation;