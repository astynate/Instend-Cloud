import React, { useState } from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import Input from '../../shared/ui-kit/input/Input';
import TextArea from '../../shared/ui-kit/text-area/TextArea';
import Button from '../../shared/ui-kit/button/Button';
import upload from "./images/upload.png";
import { instance } from '../../../../state/Interceptors';
import { CreateAlbumRequest } from '../../pages/gallery/api/AlbumRequests';

const CreateAlbum = (props) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
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
        } catch {}
    };

    return (
        <PopUpWindow
            open={props.open} 
            close={props.close}
            isHeaderPositionAbsulute={true}
        >
            <div className={styles.createAlbum}>
                <div className={styles.header}>
                    <span>Create album</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <div className={styles.loadCover}>
                            {image ? (
                                <img src={imageAsURL} className={styles.uploadedImage} />
                            ) : (
                                <img src={upload} className={styles.upload} />
                            )}
                            <input type='file' onChange={handleImageUpload} accept='image/*' />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.field}>
                            <span>Name</span>
                            <Input 
                                placeholder="Create name"
                                value={name}
                                setValue={setName} 
                            />
                        </div>
                        <div className={styles.field}>
                            <span>Description</span>
                            <TextArea 
                                placeholder="Create description" 
                                value={description}
                                setValue={setDescription} 
                            />
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button 
                                value={"Coninue"} 
                                callback={() => {
                                    CreateAlbumRequest(name, description, image);
                                    props.close();
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