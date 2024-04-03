import React from 'react';
import styles from './main.module.css';
import close from './images/close.png';

const RightPanel = () => {

    return (
        <div className={styles.rightPanel}>
            <div className={styles.resize}></div>
            <div className={styles.header}>
                <div>
                    <div className={styles.filename}>
                        <span className={styles.name}>Name</span>
                        <span className={styles.type}>PNG</span>
                    </div>
                    <span className={styles.time}>March 24, 2024 — 14 KB</span>
                </div>
                <img src={close} className={styles.button} />
            </div>
            <div className={styles.content}>
                <div className={styles.loader}></div>
            </div>
        </div>
    );
 };

export default RightPanel;