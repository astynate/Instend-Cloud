import React from "react";
import styles from './styles/main.module.css';

const SettingName = (props) => {

    return (

        <div className={styles.settingName}>
            <div>
                <h1>{props.title}</h1>
            </div>
        </div>

    );

};

export default SettingName;