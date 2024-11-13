import React from "react";
import external_styles from '../setting/styles/main.module.css';
import styles from './main.module.css';

const Switch = (props) => {
    return (
        <div className={styles.settingBar}>
            <div className={external_styles.setting} id="single" onClick={props.onClick}>
                <img src={props.img} className={external_styles.descImage} />
                <div>
                    <h1>{props.title}</h1>
                    <p>{props.description}</p>
                </div>
                <div className={styles.switch} id={props.active ? "active" : null}>
                    <div className={styles.circle}></div>
                </div>
            </div>
        </div>
    );
};

export default Switch;