import React, { useContext, useEffect, useState, useLayoutEffect } from "react";
import styles from './styles/main.module.css';
import PopUpWinwow from '../../../shared/pop-up-window/PopUpWindow';
import image from './images/avatar.png';
import { Back, Next } from "../../../shared/navigate/Navigate";
import { ProfileSettingsContext } from '../Profile';

const types = ['image/png'];

const ValidateImage = (image) => {

    try {
        return image !== null && types.includes(image.type) && image.size > 0;
    } catch {
        return false;
    }

};

const UpdateAvatar = (avatar, setAvatar) => {

    setAvatar(prevSettings => ({
        ...prevSettings,
        avatar: {
          ...prevSettings.avatar,
          image: avatar
        }
    }));

}

const UploadAvatar = (props) => {

    const [context, setContext] = useContext(ProfileSettingsContext);

    useLayoutEffect(() => {

        UpdateAvatar(null, setContext);

    }, []);

    const [isFileEnter, setFileEnterState] = useState(false);
    const [isValid, setValidationState] = useState(ValidateImage(context.avatar.image));

    useEffect(() => {

        setValidationState(ValidateImage(context.avatar.image));
        setFileEnterState(isValid);

    }, [context]);

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
        UpdateAvatar([...event.dataTransfer.files][0], setContext);

    };

    const setFile = (event) => {

        event.preventDefault();
        UpdateAvatar(event.target.files[0], setContext);

    };

    return (

        <PopUpWinwow isOpen={props.isOpen} setOpenState={props.setOpenState}>
            <div 
                className={styles.wrapper} 
                id={isFileEnter ? 'file' : null} 
                onDragLeave={(event) => onDragLeave(event)} 
                onDragOver={(event) => onDragOver(event)}
                onDrop={(event) => onDrag(event)}
            >
                <div className={styles.content}>
                    <img src={image} draggable="false" />
                    <h1>Drop or select from galery</h1>
                    <p>Please note that after downloading you will need to confirm the</p>
                    <div className={styles.line}></div>
                    <div className={styles.button}>
                        Select from device
                        <input type="file" onChange={(event) => setFile(event)} />
                    </div>
                </div>
                <div className={styles.navigation}>
                    <Back onClick={() => props.setOpenState(false)} />
                    <Next disabled={!isValid} />
                </div>
            </div>
        </PopUpWinwow>
        
    );

};

export default UploadAvatar;