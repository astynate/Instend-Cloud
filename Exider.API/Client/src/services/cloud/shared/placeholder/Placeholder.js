import React from 'react';
import styles from './main.module.css';

const Placeholder = (props) => {
    return (
        <div className={styles.placeholder}>{props.title}</div>
    );
 };

export default Placeholder;