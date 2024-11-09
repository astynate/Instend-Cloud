import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const ContextMenu = ({close, position, isContextMenu, items, brefore=<></>, after=<></>}) => {
    const wrapper = useRef(null);
    const [isContextMenuOpen, setContextMenuState] = useState(isContextMenu);

    const handleClickOutside = () => {
        if (isContextMenu) {
            close();
        }
        
        setContextMenuState(true);
    };

    useEffect(() => {
        if (wrapper.current) {
            let x = position[0];
            let y = position[1];
        
            const menuWidth = wrapper.current.offsetWidth;
            const menuHeight = wrapper.current.offsetHeight;
        
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
        
            if ((x + menuWidth) > windowWidth) {
                x = windowWidth - menuWidth;
            }
        
            if ((y + menuHeight) > windowHeight) {
                y = windowHeight - menuHeight;
            }
        
            wrapper.current.style.left = `${x}px`;
            wrapper.current.style.top = `${y}px`;
        }        

        document.addEventListener('click', handleClickOutside);
      
        return () => {
            document.removeEventListener('click', handleClickOutside);
        }
    }, []);

    return (
        <div className={styles.contextMenu} ref={wrapper}>
            {(brefore)}
            {items.map((element, index) => {
                return (
                    <div key={index} className={styles.menuItem} onClick={element[2]}>
                        <div className={element.length >= 4 && element[3] ? styles.red : null}>{element[1]}</div>
                        <img className={element.length >= 4 && element[3] ? styles.redImage : null} src={element[0]} />
                    </div>
                )
            })}
            {(after)}
        </div>
    );
};

export default ContextMenu;
