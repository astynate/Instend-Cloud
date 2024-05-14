import React, { useState, useEffect, useRef } from 'react';
import styles from './main.module.css';
import PopUpList from '../pop-up-list/PopUpList';
import option from './option.png';

const BurgerMenu = ({items}) => {
    const [isOpen, setOpenState] = useState(false);
    const node = useRef();

    const handleClickOutside = e => {
        if (node.current.contains(e.target)) {
            return;
        }
        setOpenState(false);
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className={styles.burgerMenu} ref={node}>
            <div className={styles.button} onClick={() => setOpenState(prev => !prev)}>
                <img src={option} draggable="false" />
            </div>
            <div className={styles.popUp}>
                {isOpen && 
                    <PopUpList 
                        items={items}
                        close={() => setOpenState(false)}
                    />
                }
            </div>
        </div>
    );
};

export default BurgerMenu;