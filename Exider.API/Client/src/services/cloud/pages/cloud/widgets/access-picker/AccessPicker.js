import React, { useState } from 'react';
import styles from './main.module.css'
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import personal from './images/personal.png';
import friends from './images/friends.png';
import link from './images/link.png';
import next from './images/next.png';
import Button from '../../../../shared/pop-up-window/elements/button/Button';

const AccessPicker = (props) => {
    const [activeElement, setActiveElement] = props.access;

    return (
        <PopUpWindow 
            open={true} 
            close={props.close}
            title={"Manage access"}
        >
            <div className={styles.accessPicker}>
                <div 
                    className={styles.item} 
                    id={activeElement === 'private' ? 'active' : ''} 
                    onClick={() => setActiveElement('private')}
                >
                    <img src={personal} className={styles.headerImage} />
                    <span className={styles.title}>Private access</span>
                    <div className={styles.select}></div>
                </div>
                <div 
                    className={styles.item} 
                    id={activeElement === 'favorites' ? 'active' : ''} 
                    onClick={() => {
                        setActiveElement('favorites');
                        props.next();
                    }}
                >
                    <img src={friends} className={styles.headerImage} />
                    <span className={styles.title}>Only people which you choose</span>
                    <img src={next} className={styles.next} />
                </div>
                <div 
                    className={styles.item} 
                    id={activeElement === 'public' ? 'active' : ''} 
                    onClick={() => setActiveElement('public')}
                >
                    <img src={link} className={styles.headerImage} />
                    <span className={styles.title}>Everybody who have link</span>
                    <div className={styles.select}></div>
                </div>
                <div className={styles.footer}>
                    <div className={styles.copy}>
                        <span>Copy link</span>
                    </div>
                    <Button title="Save" callback={() => props.send()} />
                </div>
            </div>
        </PopUpWindow>
    );
};

export default AccessPicker;
