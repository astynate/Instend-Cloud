import React from 'react';
import styles from './main.module.css';

const StatisticButton = ({image, title, callback}) => {
    return (
        <div 
            className={styles.statisticButton}
            onClick={callback}
        >
            <img src={image} />
            {title && <span>{title}</span>}
        </div>
    );
 };

export default StatisticButton;