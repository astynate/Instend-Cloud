import React from 'react';
import styles from './main.module.css'

const Button = (props) => {
    return (
        <button 
            onClick={props.callback} 
            className={styles.button}
        >
            {props.value}
        </button>
    );
 };

export default Button;