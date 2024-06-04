import React from 'react';
import styles from './main.module.css';

const TextArea = (props) => {
    return (
        <textarea 
            className={styles.textArea}
            placeholder={props.placeholder}
            maxLength={200}
            value={props.value}
            onInput={(event) => props.setValue(event.target.value)}
        ></textarea>
    );
 };

export default TextArea;