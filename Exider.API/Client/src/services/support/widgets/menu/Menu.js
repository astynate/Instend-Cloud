import React, { useState } from "react";
import styles from './main.module.css';

const Menu = ({items}) => {
    const [current, setCurrent] = useState(0);

    return (
        <div className={styles.menu}>
            {items.map((element, index) => {
                return (
                    <div 
                        className={styles.item} 
                        key={index} 
                        id={index === current ? 'current' : null}
                        onClick={() => setCurrent(index)}
                    >
                        <span>{element.title}</span>
                    </div>
                );
            })}
        </div>
    );
}

export default Menu;