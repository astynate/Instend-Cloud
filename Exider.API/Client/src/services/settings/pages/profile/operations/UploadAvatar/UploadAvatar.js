import React, { useContext, useEffect, useState } from "react";
import styles from './styles/main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import { ProfileSettingsContext } from '../../Profile';
import { useTranslation } from "react-i18next";

const UploadAvatar = (props) => {

    const [context, setContext] = useContext(ProfileSettingsContext);
    const [isFileEnter, setFileEnterState] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {

        props.Update(null, setContext);

    }, []);

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
        props.Update([...event.dataTransfer.files][0], setContext);
        props.setNextOperation(true)

    };

    const setFile = (event) => {

        event.preventDefault();
        props.Update(event.target.files[0], setContext);
        props.setNextOperation(true)

    };

    return (

        <PopUpWindow isOpen={props.isOpen} setOpenState={props.setOpenState}>
            <div 
                className={styles.wrapper} 
                id={isFileEnter === true ? 'file' : ''} 
                onDragLeave={(event) => onDragLeave(event)} 
                onDragOver={(event) => onDragOver(event)}
                onDrop={(event) => onDrag(event)}
            >
                <div className={styles.content}>
                    <img src={props.img} draggable="false" />
                    <h1>{t('cloud.settings.profile.drop')}</h1>
                    <p>{t('cloud.settings.profile.drop.desc')}</p>
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