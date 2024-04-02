import React, { useEffect, useRef } from 'react';
import styles from './main.module.css'

const ContextMenu = (props) => {
    const wrapper = useRef();

    useEffect(() => {

        if (wrapper.current) {
            let x = props.position[0];
            let y = props.position[1];
        
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

        const handleClickOutside = () => {
            props.close();
        };

        document.addEventListener('click', handleClickOutside);
        // document.addEventListener('contextmenu', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            // document.removeEventListener('contextmenu', handleClickOutside);
        };   

    }, []);

    return (
        <div className={styles.contextMenu} ref={wrapper}>
            {props.items.map((element, index) => {
                return (
                    <div key={index} className={styles.menuItem} onClick={element[2]}>
                        <img src={element[0]} alt="" />
                        <div>{element[1]}</div>
                    </div>
                )
            })}
        </div>
    );
};

export default ContextMenu;