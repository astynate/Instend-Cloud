import React, { useState } from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import Input from '../../shared/ui-kit/input/Input';
import TextArea from '../../shared/ui-kit/text-area/TextArea';
import Button from '../../shared/ui-kit/button/Button';
import image from './images/image.png';

const CommunityEditor = ({open, close, title, callback, avatarValue, headerValue, nameValue, descriptionValue}) => {
    const [avatar, setAvatar] = useState(avatarValue);
    const [header, setHeader] = useState(headerValue);
    const [avatarUrl, setAvatarUrl] = useState(avatarValue ? `data:image/png;base64,${avatarValue}` : null);
    const [headerUrl, setHeaderUrl] = useState(headerValue ? `data:image/png;base64,${headerValue}` : null);
    const [name, setName] = useState(nameValue);
    const [description, setDescription] = useState(descriptionValue);

    const handleImageUpload = (event, setUrl, setImage) => {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setImage(file);
                setUrl(reader.result);
            };
    
            reader.readAsDataURL(file);
        } catch {}
    };

    return (
        <PopUpWindow
            open={open}
            close={close}
            title={title}
        >
            <div className={styles.communityEditor}>
                <div className={styles.header}>
                    <div className={styles.image}>
                        <img 
                            src={image} 
                            draggable="false"
                        />
                    </div>
                    {headerUrl && <img 
                        src={headerUrl} 
                        draggable="false"
                        className={styles.mainImage}
                    />}
                    <input type='file' onInput={(event) => {
                        handleImageUpload(event, setHeaderUrl, setHeader);
                    }} accept='image/*' />
                </div>
                <div className={styles.field}>
                    <div className={styles.avatar}>
                        <div className={styles.image}>
                            <img 
                                src={image} 
                                draggable="false"
                            />
                        </div>
                        {avatarUrl && <img 
                            src={avatarUrl} 
                            draggable="false"
                            className={styles.mainImage}
                        />}
                        <input type='file' onInput={(event) => {
                            handleImageUpload(event, setAvatarUrl, setAvatar);
                        }} accept='image/*' />
                    </div>
                </div>
                <div className={styles.divide}></div>
                <div className={styles.field}>
                    <span>Name</span>
                    <Input 
                        value={name}
                        placeholder="Set name"
                        setValue={setName}
                    />
                </div>
                <div className={styles.field}>
                    <span>Description</span>
                    <TextArea 
                        value={description}
                        placeholder="Set description"
                        setValue={setDescription}
                    />
                </div>
                <div className={styles.field}>
                    <div className={styles.button}>
                        <Button 
                            value="Next"
                            callback={async () => {
                                if (name && avatar && header && description && callback) {
                                    await callback(name, description, avatar, header);
                                    close();
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </PopUpWindow>
    );
 };

export default CommunityEditor;