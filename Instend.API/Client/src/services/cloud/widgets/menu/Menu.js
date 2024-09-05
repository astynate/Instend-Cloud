import React, { useEffect, useState, useRef } from 'react';
import styles from './main.module.css';
import { NavLink, useLocation, useParams } from 'react-router-dom';

const Menu = (props) => {
    const location = useLocation();
    const pointer = useRef();
    const params = useParams();
    const [pointerOffset, setPointerOffset] = useState(0);
    const [width, setWidth] = useState(0);
    const [current, setCurrent] = useState();

    const isRouteActive = (index, route) => {
        let result = false;

        if (location.pathname === route) {
            return true;
        }

        if (params['id'] !== null && params['id'] !== undefined) {
            let path = location.pathname.replace(params['id'], '');

            if (path[path.length - 1] === '/') {
                path = path.slice(0, -1);
            }

            result = path === route;
        }

        return result;
    }

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
                        id={isRouteActive(index, element.route) || current === index ? 'active' : 'passive'}
                        ref={isRouteActive(index, element.route) || current === index ? pointer : null}
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