import React, { useContext, useEffect, useState } from "react";
import styles from './styles/main.module.css';
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import { Back, Next } from "../../../../shared/navigate/Navigate";
import { ProfileSettingsContext } from '../../Profile';

const UploadAvatar = (props) => {

    const [context, setContext] = useContext(ProfileSettingsContext);
    const [isFileEnter, setFileEnterState] = useState(false);

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
                    <h1>Drop or select from galery</h1>
                    <p>Please note that after downloading you will need to confirm the</p>
                    <div className={styles.line}></div>
                    <div className={styles.button}>
                        Select from device
                        <input type="file" onChange={(event) => setFile(event)} />
                    </div>
                </div>
            </div>
        </PopUpWindow>
        
    );

};

export default UploadAvatar;