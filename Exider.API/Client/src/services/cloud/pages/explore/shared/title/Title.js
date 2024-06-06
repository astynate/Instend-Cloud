import React from 'react';
import styles from './main.module.css';

const Title = ({value}) => {
    return (
        <h2 className={styles.title}>{value}</h2>
    );
 };

export default Title;