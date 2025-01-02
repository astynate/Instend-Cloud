import React from "react";
import styles from './styles/main.module.css';

const PopUpWindow = (props) => {
    if (props.isOpen) {
        return (
            <div className={styles.wrapper} onClick={() => props.setOpenState(false)}>
                <div className={styles.window} onClick={(event) => event.stopPropagation()}>
                    {props.children}
                </div>
            </div>
        );
    }

    return null;
};

export default PopUpWindow;