import React from 'react';
import styles from './main.module.css';

const Input = (props) => {
    return (
        <>
            <input 
                type='text' 
                value={props.value}
                placeholder={props.placeholder}
                className={styles.input}
                onInput={(event) => props.setValue(event.target.value)}
            />
        </>
    );
 };

export default Input;