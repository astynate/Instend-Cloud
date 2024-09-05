import React from 'react';
import styles from './main.module.css';

const CheckMark = ({isActive}) => {
    return (
        <div className={styles.checkmark}>
            {isActive && <div className={styles.check}></div>}
        </div>
    );
 };

export default CheckMark;