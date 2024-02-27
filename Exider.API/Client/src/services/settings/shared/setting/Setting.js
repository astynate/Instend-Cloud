import React from "react";
import styles from './styles/main.module.css';

const Setting = (props) => {

    return (

        <div className={styles.setting} id={props.type || null}>
        </div>

    );

};

export default Setting;