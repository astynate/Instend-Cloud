import React, { useEffect } from "react";
import styles from './styles/main.module.css';
import { NavLink, useLocation } from "react-router-dom";

const Button = (props) => {

    const location = useLocation();

    useEffect(() => {

        if (location.pathname === props.path) {

            props.setCurrentSetting(props.title);

        }

    }, [location]);

    return (

        <div className={styles.button} id={location.pathname === props.path ? 'active' : null}>
            <NavLink to={props.path}>
                {props.title}
            </NavLink>
        </div>

    );

};

export default Button;