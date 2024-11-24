import React from 'react';
import styles from './main.module.css';
import cancel from './images/cancel.png';
import backButton from './images/back.png';

const PopUpWindow = ({
        open, 
        isHeaderPositionAbsulute, 
        isHeaderless, 
        back, 
        title, 
        close, 
        children
    }) => {

    if (open === false)
        return null
    
    return (
        <div className={styles.popUpWrapper}>
            <div className={styles.window}>
                {!isHeaderless &&
                    <div className={styles.header} id={isHeaderPositionAbsulute ? 'absulute' : null}>
                        {back ? 
                            <div className={styles.backButton}>
                                <img src={backButton} 
                                    className={styles.back} 
                                    draggable={false} 
                                    onClick={back}
                                />
                            </div>
                        : null}
                        <h1 className={styles.title}>{title}</h1>
                        <div className={styles.close} onClick={close}>
                            <img src={cancel} 
                                className={styles.closeImage} 
                                draggable={false}
                            />
                        </div>
                </div>}
                <div className={styles.popupContent}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default PopUpWindow;