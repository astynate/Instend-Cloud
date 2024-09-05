import React from 'react';
import styles from './main.module.css';

const Paragraph = ({children}) => {
    return (
        <p className={styles.paragraph}>{children}</p>
    );
 };

export default Paragraph;