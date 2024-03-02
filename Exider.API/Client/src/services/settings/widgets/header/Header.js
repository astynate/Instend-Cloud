import React, { useState } from "react";
import styles from './styles/main.module.css';
import LoaderButton from "../../shared/loader-button/LoaderButton";

const Header = (props) => {

    return (

        <div className={styles.headerWrapper}>
            <div className={styles.header}>
                <div className={styles.settingName}>
                    <h1>{props.title}</h1>
                </div>
                <div className={styles.rightButtons}>
                    <span>Cancel</span>
                    <LoaderButton 
                        title='Save' 
                        state={props.state}
                        onClick={() => props.onClick()} />
                </div>
            </div>
        </div>

    );

};

export default Header;