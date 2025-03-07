import React, { useEffect, useState } from 'react';
import styles from './main.module.css';

/// items = {
///     red,
///     title,
///     image,
///     callback
/// }

const ContextMenu = ({children, items = [], textBefore = '', onContextMenu = () => {}}) => {
    const [position, setPosition] = useState([0, 0]);
    const [isContextMenuOpen, setContextMenuState] = useState(false);

    const close = () => {
        setContextMenuState(false);
    };

    useEffect(() => {
        document.addEventListener('click', close);
      
        return () => {
            document.removeEventListener('click', close);
        }
    }, []);

    return (
        <div 
            onContextMenu={(e) => {
                setContextMenuState(true);
                e.preventDefault();

                let x = e.clientX;
                let y = e.clientY;

                setPosition([x, y]);
                onContextMenu();
            }}
            className={styles.wrapper}
        >
            {children}
            {isContextMenuOpen && <div 
                className={styles.contextMenu} 
                style={{left: position[0], top: position[1]}}
            >
                {textBefore && <span className={styles.before}>{textBefore}</span>}
                {items.map((item, index) => {
                    return (
                        <div key={index} className={styles.menuItem} onClick={item.callback ? item.callback : () => {}}>
                            <div className={item.red ? styles.red : null}>{item.title}</div>
                            <img className={item.red ? styles.redImage : null} src={item.image} />
                        </div>
                    )
                })}
            </div>}
        </div>
    );
};

export default ContextMenu;
