import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';

const Emoji = ({open, close, callback}) => {
    const ref = useRef();
    const emoji = ["😀", "🤣", "😱", "❤️", "😐", "😎", "😇", "💩"];

    useEffect(() => {
        const checkIfClickedOutside = e => {
            if (open && ref.current && !ref.current.contains(e.target)) {
                close();
            }
        };

        document.addEventListener("mousedown", checkIfClickedOutside);

        return () => {
            document.removeEventListener("mousedown", checkIfClickedOutside);
        };
    }, [open, close]);

    if (open) {
        return (
            <div className={styles.emoji} ref={ref}>
                {emoji.map((element, index) => {
                    return (
                        <div 
                            key={index} 
                            className={styles.button}
                            onClick={() => {
                                if (callback) {
                                    callback(element);
                                }
                
                                close();
                            }}
                        >
                            {element}
                        </div>
                    );
                })}
            </div>
        );
    } else {
        return null;
    }
 };

export default Emoji;