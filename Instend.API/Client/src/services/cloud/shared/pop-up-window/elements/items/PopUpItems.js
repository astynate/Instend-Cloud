import React, { useState } from "react";
import styles from './main.module.css';
import next from './images/next.png';

const PopUpItems = ({items}) => {
    const [active, setActive] = useState(0);

    return (
        <>
            <div className={styles.items}>
                {items.map((element, index) => {
                    return (
                        <div 
                            className={styles.item} 
                            key={index} 
                            id={active === index ? "active" : null}
                            onClick={() => setActive(index)}
                        >
                            <span>{element.title}</span>
                        </div>
                    );
                })}
                {/* <div className={styles.item} id="next">
                    <img src={next} draggable="false" />
                </div> */}
            </div>
            <div className={styles.element}>
                {(items[active].element)}
            </div>
        </>
    );
}

export default PopUpItems;