import React from 'react';
import styles from './main.module.css';

const SubInput = ({placeholder, text, setText}) => {
    return (
        <input 
            className={styles.subInput} 
            placeholder={placeholder}
            draggable="false"
            value={text}
            onInput={(event) => setText(event.target.value)}
        />
    );
 };

export default SubInput;