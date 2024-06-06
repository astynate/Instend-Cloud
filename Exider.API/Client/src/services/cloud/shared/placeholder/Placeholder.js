import React from 'react';
import styles from './main.module.css';

const Placeholder = ({title}) => {
    return (
        <div className={styles.placeholder}>{title}</div>
    );
 };

export default Placeholder;