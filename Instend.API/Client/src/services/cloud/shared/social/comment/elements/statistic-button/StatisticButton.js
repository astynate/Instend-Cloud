import React from 'react';
import styles from './main.module.css';

const StatisticButton = ({image, title, callback, isDefault = false}) => {
    return (
        <div 
            className={styles.statisticButton}
            onClick={callback}
            id={isDefault ? 'default' : null}
        >
            <img src={image} draggable="false" />
            {title && <span>{title}</span>}
        </div>
    );
 };

export default StatisticButton;