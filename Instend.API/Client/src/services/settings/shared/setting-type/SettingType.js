import React from 'react';
import styles from './styles/main.module.css';

const SettingType = (props) => {
    return (
        <>
            <div className={styles.settingType}>
                <div className={styles.image}>
                    {props.image}
                </div>
                <div className={styles.description}>
                    <h1>{props.title}</h1>
                    <p>{props.description}</p>
                </div>
            </div>
        </>
    );
};

export default SettingType;