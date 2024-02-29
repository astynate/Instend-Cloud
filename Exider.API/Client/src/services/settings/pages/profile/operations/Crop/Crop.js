import React, { useContext, useEffect, useState } from "react";
import styles from './styles/main.module.css';
import PopUpWindow from "../../../../shared/pop-up-window/PopUpWindow";
import { ProfileSettingsContext } from "../../Profile";
import { Back, Next } from "../../../../shared/navigate/Navigate";

const Crop = (props) => {

    const [context, setContext] = useContext(ProfileSettingsContext);
    const [image, setImage] = useState();

    useEffect(() => {

        const file = context.avatar.image;
        const reader = new FileReader();

        reader.onload = (event) => {
            setImage(event.target.result);
        };
    
        if (file) {
          reader.readAsDataURL(file);
        }

    }, []);

    return (

        <PopUpWindow isOpen={props.isOpen} setOpenState={props.setOpenState}>
            <div className={styles.imageWrapper}>
                <div className={styles.crop}>
                    <div className={styles.top}></div>
                    <div className={styles.middle}>
                        <div className={styles.left}></div>
                        <div className={styles.workspace}>
                            <div className={styles.circle}></div>
                            <div className={styles.dragAndDropPoint}></div>
                            <div className={styles.dragAndDropPoint}></div>
                            <div className={styles.dragAndDropPoint}></div>
                            <div className={styles.dragAndDropPoint}></div>
                        </div>
                        <div className={styles.right}></div>
                    </div>
                    <div className={styles.bottom}></div>
                </div>
                <img src={image} className={styles.image} draggable="false" />
            </div>
            <div className={styles.buttons}>
                <div className={styles.navigation}>
                    <Back />
                    <Next />
                </div>
            </div>
        </PopUpWindow>

    );

};

export default Crop;