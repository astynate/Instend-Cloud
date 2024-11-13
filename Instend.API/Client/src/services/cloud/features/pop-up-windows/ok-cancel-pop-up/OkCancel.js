import React from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';

const OkCancelPopUp = (props) => {
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
                <div className={styles.down}>
                    <div className={styles.button} onClick={async () => {
                        await props.callback();
                        props.close();
                    }}>
                        <span>Ok</span>
                    </div>
                    <div className={styles.button} onClick={props.close} id='cancel'>
                        <span>Cancel</span>
                    </div>
                </div>
            </div>
        </PopUpWindow>
    );
 };

export default OkCancelPopUp;