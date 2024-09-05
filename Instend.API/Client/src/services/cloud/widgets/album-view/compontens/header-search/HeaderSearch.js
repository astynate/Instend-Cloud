import React, { useState } from 'react';
import styles from './main.module.css';
import search from './images/search.png';

const HeaderSearch = ({placeholder}) => {
    const [isOpen, setOpenState] = useState(false);

    return (
        <div className={styles.search}>
            <img 
                src={search} 
                className={styles.icon} 
            />
            {isOpen && <input 
                className={styles.input} 
                placeholder={placeholder}
            />}
        </div>
    );
};

export default HeaderSearch;