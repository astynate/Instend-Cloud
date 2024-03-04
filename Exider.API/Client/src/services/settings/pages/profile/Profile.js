import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { setName, setSurname, setNickname } from './operations/Set/SetTextFields';
import { UpdateAvatar, UpdateHeader } from './operations/Set/SetImages';
import { instance } from '../../../../state/Interceptors';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import userState from '../../../../states/user-state';
import Setting from '../../shared/setting/Setting';
import upload from './images/upload.png';
import trash from './images/trash.png';
import profile from './images/avatar.png';
import UploadAvatarProcess from './processes/upload-avatar/UploadAvatarProcess';
import Input from '../../shared/input/Input';
import avatarImage from './images/avatar.png';
import { CancelToken } from 'axios';
import { useNavigate, useLocation} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const ProfileSettingsContext = createContext();

const Profile = observer((props) => {

    const name = useRef();
    const surname = useRef();
    const nickname = useRef();

    const { user } = userState;
    const { t } = useTranslation();

    const [uploadAvatar,  setUploadAvatar] = useState(false);
    const [uploadHeader,  setUploadHeader] = useState(false);
    const [avatar, setAvatar] = useState(`data:image/png;base64,${user.avatar}`);
    const [header, setHeader] = useState(`data:image/png;base64,${user.header}`);
    const { UpdateUserData } = userState;

    let navigate = useNavigate();
    let location = useLocation();

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

        const Save = async () => {

            const source = CancelToken.source();

            const timeoutId = setTimeout(() => {
    
                source.cancel("Request timeout");
    
            }, 20000);
    
            try {
    
                const response = await instance({
                    method: 'put',
                    url: '/accounts',
                    data: profileSettings,
                    headers: { 'Content-Type': 'multipart/form-data' },
                    cancelToken: source.token
                });
    
                clearTimeout(timeoutId);
    
                if (response.status === 200) {
    
                    UpdateUserData(location, navigate);
    
                } else {
    
                    UpdateUserData(location, navigate);
    
                }
    
            } catch { }

        };

        if (props.isSaving) {

            Save();
            props.setSavingState(false);

        }

    }, [props.isSaving]);

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
                title={t('cloud.settings.profile.avatar')}
                description={t('cloud.settings.profile.avatar.desc')}
            />
            <div className={styles.settingBar}>
                <Setting  
                    image={upload}
                    title={t('cloud.settings.profile.upload_from_device')}
                    type="first"
                    description={t('cloud.settings.profile.upload_from_device.desc')}
                    onClick={() => setUploadAvatar(true)}
                />
                <Setting  
                    image={trash}
                    type="last"
                    title={t('cloud.settings.profile.delete_avatar')}
                    description={t('cloud.settings.profile.delete_avatar.desc')}
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
                title={t('cloud.settings.profile.header')}
                description={t('cloud.settings.profile.header.desc')}
            />
            <div className={styles.settingBar}>
                <Setting  
                    image={upload}
                    title={t('cloud.settings.profile.upload_from_device')}
                    type="first"
                    description={t('cloud.settings.profile.upload_from_device.desc')}
                    onClick={() => setUploadHeader(true)}
                />
                <Setting  
                    image={trash}
                    type="last"
                    title={t('cloud.settings.profile.delete_header')}
                    description={t('cloud.settings.profile.delete_header.desc')}
                    onClick={() => DeleteHeader()}
                />
            </div>
            <SettingType 
                image={<img src={profile} className={styles.avatar} draggable="false" />} 
                title={t('cloud.settings.profile.personal_data')}
                description={t('cloud.settings.profile.personal_data.desc')}
            />
            <div className={styles.settingBar}>
                <Input 
                    title={t('cloud.settings.profile.personal_data.name')}
                    defaultValue={user.name} 
                    setValue={setName} 
                    type="first"
                    forwardRef={name}
                    maxLength={20}
                />
                <Input 
                    title={t('cloud.settings.profile.personal_data.surname')} 
                    defaultValue={user.surname} 
                    setValue={setSurname}
                    forwardRef={surname}
                    maxLength={20}
                />
                <Input 
                    title={t('cloud.settings.profile.personal_data.nickname')}
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