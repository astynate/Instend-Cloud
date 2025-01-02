import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import img from './images/avatar.png';
import styles from './styles/main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';

const UploadAvatar = ({setAvatar = () => {}, setNextOperation, isOpen, setOpenState}) => {
    const [isFileEnter, setFileEnterState] = useState(false);
    const { t } = useTranslation();

    const onDragOver = (event) => {
        event.preventDefault();
        setFileEnterState(true);
    }

    const onDragLeave = (event) => {
        event.preventDefault();
        setFileEnterState(false);
    }
    
    const onDrag = (event) => {
        event.preventDefault();
        
        setAvatar([...event.dataTransfer.files][0]);
        setNextOperation(true)
    };

    const setFile = (event) => {
        event.preventDefault();
       
        setAvatar(event.target.files[0]);
        setNextOperation(true);
    };

    return (
        <PopUpWindow isOpen={isOpen} setOpenState={setOpenState}>
            <div 
                className={styles.wrapper} 
                id={isFileEnter === true ? 'file' : ''} 
                onDragLeave={(event) => onDragLeave(event)} 
                onDragOver={(event) => onDragOver(event)}
                onDrop={(event) => onDrag(event)}
            >
                <div className={styles.content}>
                    <img src={img} draggable="false" />
                    <h1>{t('cloud.settings.profile.drop')}</h1>
                    <p>Your avatar should be more than 100 x 100 px. And have no tranperent background.</p>
                    <div className={styles.line}></div>
                    <div className={styles.button}>
                        {t('cloud.settings.profile.select')}
                        <input type="file" onChange={(event) => setFile(event)} />
                    </div>
                </div>
            </div>
        </PopUpWindow>  
    );
};

export default UploadAvatar;