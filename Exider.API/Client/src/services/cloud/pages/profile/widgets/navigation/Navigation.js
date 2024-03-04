import React from "react";
import styles from './styles/main.module.css';
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navigation = () => {

    const { t } = useTranslation();

    return (

        <div className={styles.navigation}>
            <NavLink className="" to="/profile" id="active">
                {t('cloud.home')}
            </NavLink>
            <NavLink className="" to="/profile/inventory">
                {t('cloud.inventory')}
            </NavLink>
        </div>
    
    );

};

export default Navigation;