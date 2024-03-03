import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
import { setName, setSurname, setNickname } from './operations/Set/SetTextFields';
import { UpdateAvatar, UpdateHeader } from './operations/Set/SetImages';
import avatarImage from './images/avatar.png';
import headerImage from './images/header.png';

const ProfileSettingsContext = createContext();

const Profile = observer((props) => {

    const name = useRef();
    const surname = useRef();
    const nickname = useRef();

    const { user } = userState;

    const [uploadAvatar,  setUploadAvatar] = useState(false);
    const [uploadHeader,  setUploadHeader] = useState(false);
    const [avatar, setAvatar] = useState(`data:image/png;base64,${user.avatar}`);
    const [header, setHeader] = useState(`data:image/png;base64,${user.header}`);

    const defaultProfileSettings = {
        name: user.name,
        surname: user.surname,
        nickname: user.nickname,
        avatar: "",
        header: "",
    };

    const [profileSettings, setProfileSettings] = useState(defaultProfileSettings);

    useEffect(() => {

        if (user.avatar != null) {
            setAvatar(`data:image/png;base64,${user.avatar}`);
        }

    }, [user.avatar]);

    useEffect(() => {

        props.setData(profileSettings);

    }, [profileSettings]);

    useEffect(() => {

        const SetDefault = async () => {

            setAvatar(`data:image/png;base64,${user.avatar}`);
            setHeader(`data:image/png;base64,${user.header}`);
            setProfileSettings(defaultProfileSettings);
            setName(user.name, setProfileSettings);
            setSurname(user.surname, setProfileSettings);
            setNickname(user.nickname, setProfileSettings);
            name.current.value = user.name;
            surname.current.value = user.surname;
            nickname.current.value = user.nickname;

            props.setCancelState(false);

        }

        if (props.cancel) {

            SetDefault();

        }

    }, [props.cancel]);

    const DeleteAvatar = async () => {

        await UpdateAvatar("delete", setProfileSettings);
        setAvatar("");

    };

    const DeleteHeader = async () => {

        await UpdateHeader("delete", setProfileSettings);
        setHeader("");

    };

    return (

        <ProfileSettingsContext.Provider value={[profileSettings, setProfileSettings]}>
            { 
                uploadAvatar ? 

                    <UploadAvatarProcess 
                        isOpen={uploadAvatar} 
                        setOpenState={setUploadAvatar}
                        setAvatar={setAvatar}
                        aspectRatio={1}
                        Update={UpdateAvatar}
                        image={profileSettings.avatar}
                        img={avatarImage}
                    /> 
                
                : 
                
                uploadHeader ?

                    <UploadAvatarProcess 
                        isOpen={uploadHeader} 
                        setOpenState={setUploadHeader}
                        setAvatar={setHeader}
                        aspectRatio={1.7}
                        Update={UpdateHeader}
                        image={profileSettings.header}
                        img={avatarImage}
                    /> 

                :

                    null
            }
            <SettingType 
                image={
                    <div className={styles.avatarWrapper}>
                        {avatar.replace('data:image/png;base64,', '') ? 
                            <img 
                                src={avatar} 
                                className={styles.avatar} 
                            /> 
                        : null}
                    </div>} 
                title="Avatar" 
                description="Please note that your profile photo will be visible to everyone." 
            />
            <div className={styles.settingBar}>
                <Setting  
                    image={upload}
                    title="Upload from device" 
                    type="first"
                    description="The old one will be deleted"
                    onClick={() => setUploadAvatar(true)}
                />
                <Setting  
                    image={trash}
                    type="last"
                    title="Delete avatar" 
                    description="Setting the avatar to it is default state" 
                    onClick={() => DeleteAvatar()}
                />
            </div>
            <SettingType 
                image={
                    <div className={styles.headerWrapper}>
                        {header.replace('data:image/png;base64,', '') ? 
                            <img 
                                src={header} 
                                className={styles.header} 
                            /> 
                        : null}
                    </div>} 
                title="Header" 
                description="It is best to choose photos in a ratio of 21 to 9." 
            />
            <div className={styles.settingBar}>
                <Setting  
                    image={upload}
                    title="Upload from device" 
                    type="first"
                    description="The old one will be deleted"
                    onClick={() => setUploadHeader(true)}
                />
                <Setting  
                    image={trash}
                    type="last"
                    title="Delete header"
                    description="The header will be completely removed from your profile"
                    onClick={() => DeleteHeader()}
                />
            </div>
            <SettingType 
                image={<img src={profile} className={styles.avatar} draggable="false" />} 
                title="Personal data" 
                description="You can always change this information." 
            />
            <div className={styles.settingBar}>
                <Input 
                    title="name" 
                    defaultValue={user.name} 
                    setValue={setName} 
                    type="first"
                    forwardRef={name}
                    maxLength={20}
                />
                <Input 
                    title="surname" 
                    defaultValue={user.surname} 
                    setValue={setSurname}
                    forwardRef={surname}
                    maxLength={20}
                />
                <Input 
                    title="nickname" 
                    defaultValue={user.nickname} 
                    setValue={setNickname}
                    type="last"
                    forwardRef={nickname}
                    maxLength={20}
                />
            </div>
        </ProfileSettingsContext.Provider>
        
    );

});

export default Profile;
export { ProfileSettingsContext };