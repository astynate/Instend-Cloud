import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';

const MultipleInput = ({placeholder, value, setValue}) => {
    let inputRef = useRef();

    useEffect(() => {
        const textHeight = Math.max(value.split('\n').length, 1) * 17;
        const textHeightWithOffset = textHeight + 30;

        inputRef.current.style.height = `${textHeightWithOffset}px`;
    }, [value]);

    return (
        <textarea 
            ref={inputRef}
            className={styles.textArea}
            placeholder={placeholder}
            maxLength={200}
            value={value}
            onInput={(event) => setValue(event.target.value)}
        ></textarea>
    );
};

export default MultipleInput;