import React from 'react';
import styles from './main.module.css';
import info from './images/header/info.png';
import Input from '../../shared/input/Input';

const Chat = ({children}) => {
    return (
        <div className={styles.chat}>
            <div className={styles.header}>
                <div className={styles.left}>
                    <div className={styles.avatar}>

                    </div>
                    <div className={styles.information}>
                        <span className={styles.name}>astynate</span>
                        <span className={styles.data}>data</span>
                    </div>
                </div>
                <div className={styles.right}>
                    <img src={info} 
                        className={styles.buttonImage} 
                        draggable="false"
                    />
                </div>
            </div>
            <div className={styles.messages}>
                {children}
            </div>
            <div className={styles.input}>
                <Input 
                />
            </div>
        </div>
    );
};

export default Chat;