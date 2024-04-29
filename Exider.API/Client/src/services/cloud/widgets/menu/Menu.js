import React from 'react';
import styles from './main.module.css';
import { NavLink, useLocation } from 'react-router-dom';

const Menu = (props) => {
    const location = useLocation();

    return (
        <div className={styles.menu}>
            {props.items.map((element, index) => (
                <div 
                    className={styles.button} 
                    key={index} 
                    id={location.pathname === element.route ? 'active' : 'passive'}
                >
                    <NavLink to={element.route}>
                        {element.name}
                    </NavLink>
                </div>
            ))}
        </div>
    );
 };

export default Menu;