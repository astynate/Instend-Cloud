import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import search from './images/search.png';

const HeaderSearch = ({placeholder}) => {
    const [isOpen, setOpenState] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const ClickOutsideSearch = (event) => {
            if (ref.current && !ref.current.contains(event.target)) {
                setOpenState(false);
            }
        }

        document.addEventListener('click', ClickOutsideSearch);

        return () => {
            document.removeEventListener('click', ClickOutsideSearch);
        }
    }, []);

    return (
        <div className={styles.search} ref={ref}>
            <button className={styles.button} onClick={() => setOpenState(prev => !prev)}>
                <img 
                    src={search} 
                    className={styles.icon} 
                    draggable="false"
                />
            </button>
            {isOpen && <input 
                autoFocus
                className={styles.input} 
                placeholder={placeholder}
            />}
        </div>
    );
};

export default HeaderSearch;