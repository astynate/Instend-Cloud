import React from "react";
import PopUp from "../../../shared/pop-up/PopUp";
import styles from './styles/main.module.css';

const ProfileModal = (props) => {

    return (

        <>
            <PopUp caller={props.caller} state={props.state} setState={props.setState}>
                <div className={styles.header}>
                    <span>Nickname</span>
                </div>
            </PopUp>
        </>
        
    );

};

export default ProfileModal;