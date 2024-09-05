import React from "react";
import styles from './main.module.css';
import { useTranslation } from "react-i18next";

const Next = (props) => {

    const { t } = useTranslation();

    return (
    
        <button 
            className={styles.next} 
            onClick={props.onClick} 
            disabled={props.disabled}
        >
            {t('cloud.settings.profile.next')}
        </button>

    );

};

const Back = (props) => {

    const { t } = useTranslation();

    return (
    
        <button 
            className={styles.back} 
            onClick={props.onClick}
        >
           {t('cloud.settings.profile.back')}
        </button>
        
    );

};

export { Next, Back };