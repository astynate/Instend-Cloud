import React from 'react';
import styles from './main.module.css';

const Input = ({placeholder, value, setValue, maxLength = 30}) => {
    return (
        <>
            <input 
                type='text' 
                value={value}
                placeholder={placeholder}
                className={styles.input}
                onInput={(event) => setValue(event.target.value)}
                maxLength={maxLength}
            />
        </>
    );
 };

export default Input;