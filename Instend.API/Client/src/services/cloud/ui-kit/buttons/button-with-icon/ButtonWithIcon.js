import React from 'react';
import styles from './main.module.css';

const SimpleButton = (props) => {
    return (
        <div 
            className={styles.simpleButton} 
            onClick={props.callback}
        >
            <img src={props.icon} draggable="false" />
        </div>
    );
 };

export default SimpleButton;