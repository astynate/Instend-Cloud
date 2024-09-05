import React from 'react';
import styles from './main.module.css'
import PopUpWindow from '../pop-up-window/PopUpWindow';

const Information = (props) => {
    return (
        <PopUpWindow
            open={props.open} 
            close={props.close}
            isHeaderless={true}
        >
            <div className={styles.Information}>
                <div className={styles.content}>
                    <span className={styles.title}>{props.title}</span>
                    <span className={styles.description}>{props.message}</span>
                </div>
                <div className={styles.button} onClick={props.close}>
                    <span>Ok</span>
                </div>
            </div>
        </PopUpWindow>
    );
 };

export default Information;