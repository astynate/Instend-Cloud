import React from 'react';
import styles from './main.module.css';

const PublicationsWrapper = ({children, isHasBorder = false, borderRadius = 25}) => {
    return (
        <div 
            className={styles.wrapper} 
            borderstate={isHasBorder ? 'border' : null}
            style={{borderRadius: borderRadius}}
        >
            {(children)}
        </div>
    );
};

export default PublicationsWrapper;