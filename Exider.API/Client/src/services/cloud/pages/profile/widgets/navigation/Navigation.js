import React from "react";
import styles from './styles/main.module.css';
import { NavLink } from "react-router-dom";

const Navigation = () => {

    return (

        <div className={styles.navigation}>
            <NavLink className="" to="/profile" id="active">
                Home
            </NavLink>
            <NavLink className="" to="/profile/inventory">
                Inventory
            </NavLink>
        </div>
    
    );

};

export default Navigation;