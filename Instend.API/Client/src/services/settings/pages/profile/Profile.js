import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { setName, setSurname, setNickname } from './operations/Set/SetTextFields';
import { UpdateAvatar, UpdateHeader } from './operations/Set/SetImages';
import { instance } from '../../../../state/application/Interceptors';
import { useNavigate, useLocation} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import AccountState from '../../../../state/entities/AccountState';
import Setting from '../../shared/setting/Setting';
import upload from './images/upload.png';
import trash from './images/trash.png';
import profile from './images/avatar.png';
import UploadAvatarProcess from './processes/upload-avatar/UploadAvatarProcess';
import Input from '../../shared/input/Input';
import avatarImage from './images/avatar.png';

const ProfileSettingsContext = createContext();

const Profile = observer((props) => {
    const name = useRef();
    const surname = useRef();
    const nickname = useRef();

    const { account } = AccountState;
    const { t } = useTranslation();

    const [uploadAvatar,  setUploadAvatar] = useState(false);
    const [uploadHeader,  setUploadHeader] = useState(false);
    const [avatar, setAvatar] = useState(`data:image/png;base64,${account.avatar || ""}`);
    const [header, setHeader] = useState(`data:image/png;base64,${account.header || ""}`);
    const { UpdateUserData } = AccountState;

    let navigate = useNavigate();
    let location = useLocation();

    const defaultProfileSettings = {
        name: account.name,
        surname: account.surname,
        nickname: account.nickname,
        avatar: "",
        header: "",
    };

    const [profileSettings, setProfileSettings] = useState(defaultProfileSettings);

    useEffect(() => {
        if (account.avatar != null) {
            setAvatar(`data:image/png;base64,${account.avatar || ""}`);
        }
    }, [account.avatar]);

    useEffect(() => {
        const Save = async () => {    
            await instance({
                method: 'put',
                url: '/accounts',
                data: profileSettings,
                headers: { 'Content-Type': 'multipart/form-data' }
            }).then(response => {
                if (response.status === 200) {
                    UpdateUserData(location, navigate);
                } else {
                    UpdateUserData(location, navigate);
                }
            });
        };

        if (props.isSaving) {
            Save();
            props.setSavingState(false);
        }
    }, [props.isSaving]);

    useEffect(() => {
        const SetDefault = async () => {
            setAvatar(`data:image/png;base64,${account.avatar || ""}`);
            setHeader(`data:image/png;base64,${account.header || ""}`);
            setProfileSettings(defaultProfileSettings);
            setName(account.name, setProfileSettings);
            setSurname(account.surname, setProfileSettings);
            setNickname(account.nickname, setProfileSettings);
            name.current.value = account.name;
            surname.current.value = account.surname;
            nickname.current.value = account.nickname;

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
            {uploadAvatar ? 
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
                    defaultValue={account.name} 
                    setValue={setName} 
                    type="first"
                    forwardRef={name}
                    maxLength={20}
                />
                <Input 
                    title={t('cloud.settings.profile.personal_data.surname')} 
                    defaultValue={account.surname} 
                    setValue={setSurname}
                    forwardRef={surname}
                    maxLength={20}
                />
                <Input 
                    title={t('cloud.settings.profile.personal_data.nickname')}
                    defaultValue={account.nickname} 
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