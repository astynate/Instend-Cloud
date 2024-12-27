import React, { useEffect } from "react";
import styles from './styles/main.module.css';
import { NavLink, useLocation } from "react-router-dom";

const Button = ({image, path, name, title, setCurrentSetting}) => {
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === path) {
            setCurrentSetting(name);
        }
    }, [name, location]);

    return (
        <div className={styles.button} id={location.pathname === path ? 'active' : null}>
            <NavLink to={path}>
                <img src={image} draggable="false" />
                {title}
            </NavLink>
        </div>
    );
};

export default Button;