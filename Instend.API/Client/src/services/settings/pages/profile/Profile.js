import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { ValidateProfileData } from './helpers/ValidateProfileData';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import AccountState from '../../../../state/entities/AccountState';
import UploadAvatarProcess from './processes/upload-avatar/UploadAvatarProcess';
import Input from '../../shared/input/Input';
import Base64Handler from '../../../../utils/handlers/Base64Handler';
import GlobalContext from '../../../../global/GlobalContext';
import InputLink from '../../shared/input/components/link/InputLink';
import AccountController from '../../../../api/AccountController';
import ApplicationState from '../../../../state/application/ApplicationState';
import StorageController from '../../../../api/StorageController';

const Profile = observer(({isSaving, cancel, setCancelState, setSavingState = () => {}}) => {
    const { t } = useTranslation();
    const { account } = AccountState;

    const [isAvatarProcessOpen, setAvatarProcessOpenState] = useState(false);
    const [isAvatarSubmitted, setAvatarSubmittedState] = useState(false);
    const [name, setName] = useState(account.name);
    const [surname, setSurname] = useState(account.surname);
    const [nickname, setNickname] = useState(account.nickname);
    const [avatar, setAvatar] = useState(undefined);
    const [description, setDescription] = useState(account.description);
    const [dateOfBirth, setDateOfBirth] = useState(account.dateOfBirth);
    const [links, setLinks] = useState(account.links ?? []);

    const onSuccess = () => {
        setSavingState(false);
    };

    const onError = () => {
        setSavingState(false);
    };

    const saveChanges = () => {
        if (isSaving === false) {
            return;
        }

        const validationResult = ValidateProfileData(
            name, 
            surname, 
            nickname, 
            dateOfBirth,
            links
        );

        if (validationResult[0] === false) {
            ApplicationState.AddErrorInQueue('Incorrect data', validationResult[1]);
            setSavingState(false);
            return;
        }

        AccountController.ChangeAccountData(
            name,
            surname,
            nickname,
            description,
            isAvatarSubmitted ? avatar : '',
            dateOfBirth,
            links,
            onSuccess,
            onError
        );
    }

    const addNewLink = () => {
        const defaultLink = {
            id: GlobalContext.NewGuid(),
            linkId: '00000000-0000-0000-0000-000000000001',
            name: "",
            link: "",
            accountId: AccountState.account.id
        };

        setLinks(prev => [...prev, defaultLink]);
    }

    useEffect(() => {
        saveChanges();
    }, [isSaving]);

    useEffect(() => {
        if (cancel) {
            setAvatar(undefined);
            setCancelState(false);
            setName(account.name);
            setSurname(account.surname);
            setNickname(account.nickname);
            setLinks(account.links ?? []);
        }
    }, [cancel]);

    return (
        <div key={cancel}>
            <UploadAvatarProcess 
                isOpen={isAvatarProcessOpen} 
                setOpenState={setAvatarProcessOpenState}
                avatar={avatar}
                setAvatarSubmittedState={setAvatarSubmittedState}
                setAvatar={setAvatar}
                aspectRatio={1}
                Update={() => {}}
            />
            <SettingType 
                image={<div className={styles.avatarWrapper}>
                    {(avatar || account.avatar) && <img 
                        src={avatar && isAvatarSubmitted ? Base64Handler.Base64ToUrlFormatPng(avatar) : StorageController.getFullFileURL(account.avatar)} 
                        className={styles.avatar} 
                        draggable="false"
                    />}
                </div>} 
                title={t('cloud.settings.profile.avatar')}
                description={t('cloud.settings.profile.avatar.desc')}
                buttons={[
                    {title: 'Upload avatar', callback: () => setAvatarProcessOpenState(true)}
                ]}
            />
            <div className={styles.settingBar}>
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Username</h1>
                    <span className={styles.settingDescription}>This is your unique identification in Instend. Should contains at list 1 symbol. </span>
                </div>
                <Input 
                    title={t('cloud.settings.profile.personal_data.nickname')}
                    defaultValue={nickname} 
                    setValue={setNickname}
                    type="last"
                    maxLength={20}
                />
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Fullname</h1>
                    <span className={styles.settingDescription}>This is your unique identification in Instend. Should contains at list 1 symbol. </span>
                </div>
                <div style={{display: 'flex', gridGap: '10px'}}>
                    <Input 
                        title={t('cloud.settings.profile.personal_data.name')}
                        defaultValue={name} 
                        setValue={setName} 
                        type="first"
                        maxLength={20}
                    />
                    <Input 
                        title={t('cloud.settings.profile.personal_data.surname')} 
                        defaultValue={surname} 
                        setValue={setSurname}
                        maxLength={20}
                    />
                </div>
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Description</h1>
                    <span className={styles.settingDescription}>This is your unique identification in Instend. Should contains at list 1 symbol. </span>
                </div>
                <Input
                    title={`Hi! I'm an Artist and Software Engineer :)`} 
                    defaultValue={description} 
                    setValue={setDescription}
                    maxLength={200}
                    isMultiline={true}
                />
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Date of birth</h1>
                    <span className={styles.settingDescription}>This is your unique identification in Instend. Should contains at list 1 symbol. </span>
                </div>
                <Input
                    type="date"
                    defaultValue={dateOfBirth}
                    title={`Date of birth`} 
                    setValue={setDateOfBirth}
                />
                <div className={styles.settingDescriptionWrapper}>
                    <h1 className={styles.settingTitle}>Links</h1>
                    <span className={styles.settingDescription}>This is your unique identification in Instend. Should contains at list 1 symbol. </span>
                </div>
                <div className={styles.links}>
                    {links.map(link => {
                        return (
                            <InputLink
                                key={link.id}
                                id={link.id}
                                type="link"
                                value={link}
                                setValue={setLinks}
                            />
                        )
                    })}
                    {links.length < 5 && <div className={styles.newLinkWrapper} onClick={addNewLink}>
                        <InputLink
                            type="link"
                            isEditable={false}
                            setValue={() => {}}
                        />
                    </div>}
                </div>
            </div>
        </div>
    );
});

export default Profile;