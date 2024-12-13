import React from 'react';
import PopUpWindow from '../pop-up-window/PopUpWindow';
import styles from './main.module.css';

const PopUpSelectOneOfList = ({isOpen, buttons, setOpenState = () => {}}) => {
    return (
        <PopUpWindow isHeaderless={true} open={isOpen}>
            <div className={styles.buttons}>
                {buttons.map((button, index) => {
                    return (
                        <button 
                            key={index}
                            className={styles.button}
                            id={button.isDangerousOperation ? 'dangerous' : null}
                            onClick={async () => {
                                if (button.callback) {
                                    await button.callback();
                                    setOpenState(false);
                                }
                            }}
                        >
                            {button.title}
                        </button>
                    )
                })}
                <button 
                    className={styles.button}
                    onClick={() => {setOpenState(false)}}
                >
                    Cancel
                </button>
            </div>
        </PopUpWindow>
    );
};

export default PopUpSelectOneOfList;