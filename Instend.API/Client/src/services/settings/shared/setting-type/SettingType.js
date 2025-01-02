import React from 'react';
import styles from './styles/main.module.css';

const SettingType = ({title, buttons = [], image, description}) => {
    return (
        <div className={styles.settingType}>
            <div className={styles.image}>
                {image}
            </div>
            <div className={styles.description}>
                <h1>{title}</h1>
                <p>{description}</p>
            </div>
            <div className={styles.buttons}>
                {buttons.map((button, index) => {
                    return (
                        <button 
                            key={index}
                            className={styles.button} 
                            onClick={button.callback}
                        >
                            {button.title}
                        </button>
                    )
                })}
            </div>
        </div>
    );
};

export default SettingType;