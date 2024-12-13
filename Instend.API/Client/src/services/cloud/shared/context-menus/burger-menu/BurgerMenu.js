import React, { useState, useEffect, useRef } from 'react';
import styles from './main.module.css';
import option from './option.png';
import PopUpSelectOneOfList from '../../popup-windows/pop-up-select-one-of-list/PopUpSelectOneOfList';

const BurgerMenu = ({buttons = []}) => {
    const [isOpen, setOpenState] = useState(false);

    return (
        <>
            <PopUpSelectOneOfList 
                isOpen={isOpen}
                setOpenState={setOpenState}
                buttons={buttons} 
            />
            <div className={styles.burgerMenu}>
                <div className={styles.button} onClick={() => setOpenState(prev => !prev)}>
                    <img src={option} draggable="false" />
                </div>
            </div>
        </>
    );
};

export default BurgerMenu;