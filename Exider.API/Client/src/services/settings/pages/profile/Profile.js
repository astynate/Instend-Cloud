import React, { createContext, useContext, useState } from 'react';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import { observer } from 'mobx-react-lite';
import userState from '../../../../states/user-state';
import Setting from '../../shared/setting/Setting';
import upload from './images/upload.png';
import trash from './images/trash.png';
import UploadAvatarProcess from './processes/upload-avatar/UploadAvatarProcess';

const defaultProfileSettings = {

    avatar: {
        image: "",
        cropedImage: "",
    },

    header: {
        image: "",
        cropedImage: "",
    },

    name: "",
    surname: "",
    nickname: "",

};

const ProfileSettingsContext = createContext();

const Profile = observer(() => {

    const { user } = userState;
    const [profileSettings, setProfileSettings] = useState(defaultProfileSettings);
    const [uploadAvatar,  setUploadAvatar] = useState(false);
    const [avatar, setAvatar] = useState(`data:image/png;base64,${user.avatar}`);

    return (

        <ProfileSettingsContext.Provider value={[profileSettings, setProfileSettings]}>
            { 
                uploadAvatar ? 

                    <UploadAvatarProcess 
                        isOpen={uploadAvatar} 
                        setOpenState={setUploadAvatar}
                        setAvatar={setAvatar}
                    /> 
                : 
                
                    null 
            }
            <SettingType 
                image={<img src={avatar} className={styles.avatar} draggable="false" />} 
                title="Avatar" 
                description="Please note that your profile photo will be visible to everyone." 
            />
            <div className={styles.settingBar}>
                <Setting  
                    image={upload}
                    title="Upload from device" 
                    type="first"
                    description="The old one will be deleted"
                    openFunction={setUploadAvatar}
                />
                <Setting  
                    image={trash}
                    type="last"
                    title="Delete avatar" 
                    description="Setting the avatar to it is default state" 
                />
            </div>
            {/* <SettingType 
                image={
                    <div className={styles.headerWrapper}>
                        {user.header ? <img 
                            src={`data:image/png;base64,${user.header}`} 
                            className={styles.header} 
                            /> : null}
                    </div>} 
                title="Header" 
                description="It is best to choose photos in a ratio of 21 to 9" 
            />
            <div className={styles.settingBar}></div> */}
        </ProfileSettingsContext.Provider>
        
    );

});

export default Profile;
export { ProfileSettingsContext };