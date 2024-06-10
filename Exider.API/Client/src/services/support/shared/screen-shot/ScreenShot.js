import React from 'react';
import styles from './main.module.css';
import laptop from './images/laptop.png';

const ScreenShot = ({image}) => {
    return (
        <div className={styles.screenShot}>
            <img src={laptop} className={styles.laptop} />
            <img className={styles.screen} src={image} />
        </div>
    );
 };

export default ScreenShot;