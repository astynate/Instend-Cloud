import React, { useEffect, useRef, useState } from "react";
import styles from './main.module.css';

const PopUpItems = ({currentIndex = 0, items = [], isCentered = false, setExternalActiveIndex = () => {}}) => {
    const [active, setActive] = useState(currentIndex);
    const ref = useRef();

    useEffect(() => {
        setExternalActiveIndex(active);
    }, [active]);

    return (
        <>
            <div className={styles.items} centered={isCentered ? "true" : null}>
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
            </div>
            <div className={styles.element} ref={ref}>
                {React.cloneElement(items[active].element, {wrapper: ref})}
            </div>
        </>
    );
};

export default PopUpItems;