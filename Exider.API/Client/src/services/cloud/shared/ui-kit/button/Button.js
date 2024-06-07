import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';

const Button = (props) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (props.isEnter) {
            const handleKeyDown = (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    props.callback();
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [props.isEnter, props.callback]);

    return (
        <button 
            ref={buttonRef}
            onClick={props.callback} 
            className={styles.button}
        >
            {props.value}
        </button>
    );
};

export default Button;