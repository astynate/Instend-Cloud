import React from 'react';
import styles from './main.module.css';

const SubInput = ({placeholder}) => {
    return (
        <input 
            className={styles.subInput} 
            placeholder={placeholder}
            draggable="false"
        />
    );
 };

export default SubInput;