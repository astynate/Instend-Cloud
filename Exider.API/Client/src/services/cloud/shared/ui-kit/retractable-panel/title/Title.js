import React from 'react';
import styles from './main.module.css';

const Title = ({title}) => {
    return (
        <h2 className={styles.title}>{title}</h2>
    );
};

export default Title;