import React from 'react';
import styles from './main.module.css';
import cancel from './images/cancel.png';
import back from './images/back.png';

const PopUpWindow = (props) => {
    if (props.open) {
        return (
            <div className={styles.popUpWrapper}>
                <div className={styles.window}>
                    {props.isHeaderless ?
                        null 
                    :
                        <div className={styles.header} id={props.isHeaderPositionAbsulute ? 'absulute' : null}>
                            {props.back ? 
                                <div className={styles.backButton}>
                                    <img src={back} 
                                        className={styles.back} 
                                        draggable={false} 
                                        onClick={props.back}
                                    />
                                </div>
                            : null}
                            <h1 className={styles.title}>{props.title}</h1>
                            <div className={styles.close} onClick={props.close}>
                                <img src={cancel} 
                                    className={styles.closeImage} 
                                    draggable={false}
                                />
                            </div>
                    </div>}
                    <div className={styles.popupContent}>
                        {props.children}
                    </div>
                </div>
            </div>
        );
    }
};

export default PopUpWindow;