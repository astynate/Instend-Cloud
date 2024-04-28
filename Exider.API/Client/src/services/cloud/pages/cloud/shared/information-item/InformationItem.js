import React from 'react';
import styles from './main.module.css';

const InformationItem = (props) => {
    return (
        <div className={styles.informationItem}>
            <div className={styles.left}>
                <span className={styles.title}>{props.title}</span>
                <span className={styles.description}>{props.description}</span>
            </div>
            <div className={styles.right}>
                {props.children}
            </div>
        </div>
    );
 };

export default InformationItem;