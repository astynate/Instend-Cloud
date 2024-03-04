import React from "react";
import styles from './styles/main.module.css';

const Setting = (props) => {

    return (

        <div className={styles.setting} id={props.type || null} onClick={props.onClick}>
            <img src={props.image} className={styles.descImage} />
            <div className={styles.description}>
                <h1 >{props.title}</h1>
                <p>{props.description}</p>
            </div>
        </div>

    );

};

export default Setting;