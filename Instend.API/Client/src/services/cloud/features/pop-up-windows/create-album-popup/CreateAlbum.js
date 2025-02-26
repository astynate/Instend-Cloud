import React, { useState } from 'react';
import styles from './main.module.css';
import upload from './images/upload.png';
import Input from '../../../ui-kit/fields/input/Input';
import MainButton from '../../../ui-kit/buttons/main-button/MainButton';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';

const CreateAlbum = ({isUpdate, nameValue, descriptionValue, cover, isOpen, closeCallback, title, callback}) => {
    const [name, setName] = useState(isUpdate && nameValue ? nameValue : '');
    const [description, setDescription] = useState(isUpdate && descriptionValue ? descriptionValue : '');
    const [image, setImage] = useState(null);
    const [imageAsURL, setImageAsURL] = useState(null);

    const handleImageUpload = (event) => {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setImage(file);
                setImageAsURL(reader.result);
            };
    
            reader.readAsDataURL(file);
        } catch (exception) {
            console.error(exception);
        };
    };

    return (
        <PopUpWindow
            open={isOpen} 
            close={closeCallback}
            isHeaderPositionAbsolute={true}
        >
            <div className={styles.createAlbum}>
                <div className={styles.header}>
                    <span>{title}</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <div className={styles.loadCover}>
                            {image ? 
                                    <img 
                                        src={imageAsURL} 
                                        className={styles.uploadedImage} 
                                        draggable="false"
                                    />
                                :
                                    <img 
                                        src={upload} 
                                        className={styles.upload} 
                                        draggable="false"
                                    />}
                            <input 
                                type='file' 
                                onChange={handleImageUpload} 
                                accept='image/*' 
                            />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.field}>
                            <span className={styles.title}>Name</span>
                            <Input
                                placeholder="Create name"
                                value={name}
                                setValue={setName} 
                            />
                        </div>
                        <div className={styles.field}>
                            <span className={styles.title}>Description</span>
                            <textarea 
                                placeholder='Description' 
                                className={styles.multilineInput}
                                onInput={(e) => setDescription(e.target.value)}
                            ></textarea>
                        </div>
                        <div className={styles.buttonWrapper}>
                            <MainButton
                                value={"Coninue"} 
                                callback={async () => {
                                    await callback(name, description, image);
                                    closeCallback();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopUpWindow>
    );
};

export default CreateAlbum;