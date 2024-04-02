import React from 'react';
import styles from './main.module.css'

const PreviewButton = (props) => {
    return (
        <div className={styles.button} onClick={props.onClick}>
            <img src={props.src} />
            <span>{props.title}</span>
        </div>
    );
 };

export default PreviewButton;