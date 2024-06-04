import React, { useState } from 'react';
import styles from './main.module.css';
import PopUpWindow from '../../shared/pop-up-window/PopUpWindow';
import Input from '../../shared/ui-kit/input/Input';
import TextArea from '../../shared/ui-kit/text-area/TextArea';
import Button from '../../shared/ui-kit/button/Button';
import image from './images/image.png';

const CommunityEditor = ({open, close, title, callback}) => {
    const [avatar, setAvatar] = useState(null);
    const [header, setHeader] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [headerUrl, setHeaderUrl] = useState(null);
    const [name, setName] = useState(null);
    const [description, setDescription] = useState(null);

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
                    {avatarUrl && <img 
                        src={avatarUrl} 
                        draggable="false"
                        className={styles.mainImage}
                    />}
                    <input type='file' onChange={(event) => handleImageUpload(event, setAvatarUrl, setAvatar)} accept='image/*' />
                </div>
                <div className={styles.field}>
                    <div className={styles.avatar}>
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
                        <input type='file' onChange={(event) => handleImageUpload(event, setHeaderUrl, setHeader)} accept='image/*' />
                    </div>
                </div>
                <div className={styles.divide}></div>
                <div className={styles.field}>
                    <span>Name</span>
                    <Input 
                        placeholder="Set name"
                        setValue={setName}
                    />
                </div>
                <div className={styles.field}>
                    <span>Description</span>
                    <TextArea 
                        placeholder="Set description"
                        setValue={setDescription}
                    />
                </div>
                <div className={styles.field}>
                    <div className={styles.button}>
                        <Button 
                            value="Next"
                            callback={() => {
                                if (name && avatar && header && callback) {
                                    callback(name, description, avatar, header);
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