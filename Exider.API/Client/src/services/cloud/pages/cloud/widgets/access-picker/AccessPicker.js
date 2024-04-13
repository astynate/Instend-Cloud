import React from 'react';
import styles from './main.module.css'
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import personal from './images/personal.png';
import friends from './images/friends.png';
import link from './images/link.png';
import next from './images/next.png';
import Button from '../../../../shared/pop-up-window/elements/button/Button';

const AccessPicker = (props) => {
    
    return (
        <PopUpWindow 
            open={true} 
            close={props.close}
            title={"Access control"}
        >
            <div className={styles.accessPicker}>
                <div className={styles.item} id={"active"}>
                    <img src={personal} className={styles.headerImage} />
                    <span className={styles.title}>Private access</span>
                    <div className={styles.select}></div>
                </div>
                <div className={styles.item}>
                    <img src={friends} className={styles.headerImage} />
                    <span className={styles.title}>Only people which you choose</span>
                    <img src={next} className={styles.next} onClick={props.next} />
                </div>
                <div className={styles.item}>
                    <img src={link} className={styles.headerImage} />
                    <span className={styles.title}>Everybody who have link</span>
                    <div className={styles.select}></div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.copy}>
                        <span>Copy link</span>
                    </div>
                    <Button title="Save" />
                </div>
            </div>
        </PopUpWindow>
    );
 };

export default AccessPicker;