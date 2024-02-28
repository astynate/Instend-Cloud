import React from "react";
import styles from './styles/main.module.css';

const Header = (props) => {

    return (

        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                <div className={styles.settingName}>
                    <h1>{props.title}</h1>
                </div>
                <div className={styles.rightButtons}>
                    <span>Cancel</span>
                    <button className={styles.button}>Save</button>
                </div>
            </div>
        </div>

    );

};

export default Header;