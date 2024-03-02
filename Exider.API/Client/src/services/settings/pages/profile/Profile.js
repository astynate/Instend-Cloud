import React, { createContext, useContext, useEffect, useState } from 'react';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import { observer } from 'mobx-react-lite';
import userState from '../../../../states/user-state';
import Setting from '../../shared/setting/Setting';
import upload from './images/upload.png';
import trash from './images/trash.png';
import profile from './images/avatar.png';
import UploadAvatarProcess from './processes/upload-avatar/UploadAvatarProcess';
import Input from '../../shared/input/Input';

const ProfileSettingsContext = createContext();

const setName = (value, setContext) => {

    setContext(prev => ({
        ...prev,
        name: value
    }));

};

const setSurname = (value, setContext) => {

    setContext(prev => ({
        ...prev,
        surname: value
    })); 

};

const setNickname = (value, setContext) => {

    setContext(prev => ({
        ...prev,
        nickname: value
    }));

};

const Profile = observer((props) => {

    const { user } = userState;
    const [uploadAvatar,  setUploadAvatar] = useState(false);
    const [avatar, setAvatar] = useState(`data:image/png;base64,${user.avatar}`);

    const defaultProfileSettings = {
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        avatar: "",
        header: "",
    };

    const [profileSettings, setProfileSettings] = useState(defaultProfileSettings);

    useEffect(() => {

        props.setData(profileSettings);

    }, [profileSettings]);

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
            <SettingType 
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
            <SettingType 
                image={<img src={profile} className={styles.avatar} draggable="false" />} 
                title="Personal data" 
                description="You alwase can change this data." 
            />
            <div className={styles.settingBar}>
                <Input title="name" defaultValue={user.name} setValue={setName} type="first" />
                <Input title="surname" defaultValue={user.surname} setValue={setSurname} />
                <Input title="nickname" defaultValue={user.nickname} setValue={setNickname} type="last" />
            </div>
        </ProfileSettingsContext.Provider>
        
    );

});

export default Profile;
export { ProfileSettingsContext };