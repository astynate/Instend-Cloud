import React, { useState } from 'react';
import styles from './main.module.css';

const LocalMenu = ({items, defaultValue}) => {
    const [current, setCurrent] = useState(defaultValue ? defaultValue : 0);

    return (
        <>
            <div className={styles.localMenu}>
                <div className={styles.menuItems}>
                    {items && items.map && items.map((element, index) => {
                        return (
                            <div 
                                key={index} 
                                className={styles.item} 
                                id={index === current ? 'active' : null}
                                onClick={() => setCurrent(index)}
                            >
                                <span>{element.title}</span>
                            </div>
                        );
                    })}
                </div>
            </div>
            {items && items.map && items.map((element, index) => {
                if (element.component && index === current) {
                    return (
                        <div key={index}>
                            {(element.component)}
                        </div>
                    );
                } else {
                    return null;
                }
            })}
        </>
    );
};

export default LocalMenu;