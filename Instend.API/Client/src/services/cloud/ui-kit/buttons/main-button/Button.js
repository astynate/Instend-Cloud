import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';

const MainButton = ({callback, isEnter, value}) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        if (isEnter) {
            const handleKeyDown = (event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                    callback();
                }
            };
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [isEnter, callback]);

    return (
        <button 
            ref={buttonRef}
            onClick={callback} 
            className={styles.button}
        >
            {value}
        </button>
    );
};

export default MainButton;