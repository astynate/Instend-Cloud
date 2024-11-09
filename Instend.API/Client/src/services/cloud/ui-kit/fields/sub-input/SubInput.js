import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';

const SubInput = ({placeholder, text, setText}) => {
    const textAreaRef = useRef(null);

    useEffect(() => {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }, [text]);

    return (
        <textarea
            ref={textAreaRef}
            className={styles.subInput}
            placeholder={placeholder}
            draggable="false"
            value={text}
            onInput={(event) => setText(event.target.value)}
            maxLength={150}
        />
    );
};

export default SubInput;