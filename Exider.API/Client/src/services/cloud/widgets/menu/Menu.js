import React, { useEffect, useState, useRef } from 'react';
import styles from './main.module.css';
import { NavLink, useLocation } from 'react-router-dom';

const Menu = (props) => {
    const location = useLocation();
    const pointer = useRef();
    const [pointerOffset, setPointerOffset] = useState(0);
    const [width, setWidth] = useState(0);
    const [current, setCurrent] = useState();

    useEffect(() => {
        setPointerOffset(pointer.current ? pointer.current.offsetLeft - 15 : 0);
        setWidth(pointer.current ? pointer.current.clientWidth + 30 : 0);
    }, [location]);

    return (
        <div className={styles.menuWrapper}>
            <div className={styles.menu}>
                {props.items.map((element, index) => (
                    <div 
                        className={styles.button} 
                        key={index} 
                        id={location.pathname === element.route || current === index ? 'active' : 'passive'}
                        ref={location.pathname === element.route || current === index ? pointer : null}
                        onClick={() => setCurrent(index)}
                    >
                        <NavLink to={element.route}>
                            {element.name}
                        </NavLink>
                    </div>
                ))}
                <div 
                    className={styles.pointer}
                    style={{ 
                        transform: `translateX(${pointerOffset}px)`,
                        width: `${width}px`
                    }}
                ></div>
            </div>
        </div>
    );
};

export default Menu;