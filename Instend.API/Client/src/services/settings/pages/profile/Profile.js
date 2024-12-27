import React, { createContext, useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { setName, setSurname, setNickname } from './operations/Set/SetTextFields';
import { UpdateAvatar } from './operations/Set/SetImages';
import { useTranslation } from 'react-i18next';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import AccountState from '../../../../state/entities/AccountState';
import UploadAvatarProcess from './processes/upload-avatar/UploadAvatarProcess';
import Input from '../../shared/input/Input';
import avatarImage from './images/avatar.png';

const Profile = observer(({isSaving, cancel, setCancelState}) => {
    const [name, setName] = useState(AccountState.account.name);
    const [surname, setSurname] = useState(AccountState.account.surname);
    const [nickname] = useState(AccountState.account.nickname);
    const [avatar, setAvatar] = useState(account.avatar);
    const { t } = useTranslation();

    const setAvatarFromAccount = () => {
        if (account.avatar != null) {
            setAvatar(account.avatar);
        }
    }

    const saveChanges = () => {
        if (isSaving) {

        }
    }

    useEffect(() => {
        setAvatarFromAccount();
    }, [account.avatar]);

    useEffect(() => {
        saveChanges();
    }, [isSaving]);

    useEffect(() => {
        if (cancel) {
            setAvatar(account.avatar);
            setName(account.name);
            setSurname(account.surname);
            setNickname(account.nickname);
            setCancelState(false);
        }
    }, [cancel]);

    return (
        <ProfileSettingsContext.Provider value={[profileSettings, setProfileSettings]}>
            {uploadAvatar && <UploadAvatarProcess 
                isOpen={uploadAvatar} 
                setOpenState={setUploadAvatar}
                setAvatar={setAvatar}
                aspectRatio={1}
                Update={UpdateAvatar}
                image={profileSettings.avatar}
                img={avatarImage}
            />}
            <SettingType 
                image={<div className={styles.avatarWrapper}>
                    {avatar &&
                        <img 
                            src={avatar} 
                            className={styles.avatar} 
                            draggable="false"
                        />}
                </div>} 
                title={t('cloud.settings.profile.avatar')}
                description={t('cloud.settings.profile.avatar.desc')}
            />
            <div className={styles.settingBar}>
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Username</h1>
                </div>
                <Input 
                    title={t('cloud.settings.profile.personal_data.nickname')}
                    defaultValue={account.nickname} 
                    setValue={setNickname}
                    type="last"
                    forwardRef={nickname}
                    maxLength={20}
                />
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Fullname</h1>
                </div>
                <div style={{display: 'flex', gridGap: '20px'}}>
                    <Input 
                        title={t('cloud.settings.profile.personal_data.name')}
                        defaultValue={account.name} 
                        setValue={setName} 
                        type="first"
                        maxLength={20}
                    />
                    <Input 
                        title={t('cloud.settings.profile.personal_data.surname')} 
                        defaultValue={account.surname} 
                        setValue={setSurname}
                        maxLength={20}
                    />
                </div>
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Description</h1>
                </div>
                <Input 
                    title={`Hi! I'm artist and engineer :)`} 
                    defaultValue={account.description} 
                    setValue={setSurname}
                    forwardRef={surname}
                    maxLength={20}
                    isMultiline={true}
                />
            </div>
        </ProfileSettingsContext.Provider>
    );
});

export default Profile;