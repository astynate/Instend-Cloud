import React from "react";
import styles from './main.module.css';

const Next = (props) => {

    return (
    
        <button className={styles.next} disabled={props.disabled}>Next</button>

    );

};

const Back = (props) => {

    return (
    
        <button className={styles.back} onClick={props.onClick}>Back</button>
        
    );

};

export { Next, Back };