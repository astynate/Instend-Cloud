import React, { useEffect, useState } from 'react';
import styles from './styles/main.module.css';
import { Route, Routes } from 'react-router-dom';
import Profile from '../pages/profile/Profile';
import Interface from '../pages/interface/Interface';
import Language from '../pages/language/Language';
import Security from '../pages/security/Security';
import MiniProfile from '../widgets/mini-profile/MiniProfile';
import Button from '../shared/button/Button';
import Header from '../widgets/header/Header';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const Settings = observer((props) => {

    let location = useLocation();

    const [currentSetting, setCurrentSetting] = useState('Settings');
    const [currentRoute, setCurrentRoute] = useState('/');
    const [cancel, setCancelState] = useState(false);
    const [isSaving, setSavingState] = useState(false);
    const [isOpen, setOpenState] = useState(location.pathname != '/settings');
    const { t } = useTranslation();
    
    useEffect(() => {

        setOpenState(location.pathname != '/settings');

    }, [location]);

    useEffect(() => {

        if (props.setPanelState) {
            props.setPanelState(true);
        }

    }, [props.setPanelState]);

    return (
        <div className={styles.wrapper}>

            {isOpen === false || props.isMobile === false ? 

            <div className={styles.settings} id={props.isMobile ? "mobile" : "desktop"}>
                <MiniProfile />
                <div className={styles.line}></div>
                <div className={styles.buttons}>
                    <Button 
                        title={t('cloud.settings.profile.title')}
                        name={t('cloud.settings.profile.name')}
                        path='/settings/profile' 
                        setCurrentSetting={setCurrentSetting} 
                        setCurrentRoute={setCurrentRoute} 
                    />
                    <Button 
                        title={t('cloud.settings.interface.title')}
                        name={t('cloud.settings.interface.name')}
                        path='/settings/interface' 
                        setCurrentSetting={setCurrentSetting} 
                        setCurrentRoute={setCurrentRoute} 
                    />
                    <Button 
                        title={t('cloud.settings.language.title')}
                        name={t('cloud.settings.language.name')}
                        path='/settings/language' 
                        setCurrentSetting={setCurrentSetting}  
                        setCurrentRoute={setCurrentRoute} 
                    />
                    {/* <Button 
                        title={t('cloud.settings.notifications.title')}
                        name={t('cloud.settings.notifications.name')}
                        path='/settings/notifications' 
                        setCurrentSetting={setCurrentSetting}
                        setCurrentRoute={setCurrentRoute}
                    /> */}
                </div>
                <div className={styles.line}></div>
                {/* <div className={styles.line}></div>
                <div className={styles.buttons}>
                    <Button 
                        title={t('cloud.settings.password_recovery.title')}
                        name={t('cloud.settings.password_recovery.name')}
                        path='/settings/password-recovery' 
                        setCurrentSetting={setCurrentSetting}
                        setCurrentRoute={setCurrentRoute}
                    />
                    <Button 
                        title={t('cloud.settings.blocked_users.title')}
                        name={t('cloud.settings.blocked_users.name')}
                        path='/settings/blocked-users' 
                        setCurrentSetting={setCurrentSetting}
                        setCurrentRoute={setCurrentRoute}
                    />
                    <Button 
                        title={t('cloud.settings.account_privacy.title')}
                        name={t('cloud.settings.account_privacy.name')}
                        path='/settings/account-privacy' 
                        setCurrentSetting={setCurrentSetting} 
                        setCurrentRoute={setCurrentRoute}
                    />
                </div>*/}
            </div> : null} 

            {isOpen || props.isMobile === false ?
                <div className={styles.content} id={props.isMobile ? "mobile" : "desktop"}>
                <Header 
                    title={currentSetting} 
                    onClick={() => setSavingState(true)}
                    state={isSaving ? 'loading' : 'valid'}
                    setCancelState={setCancelState}
                    isMobile={props.isMobile}
                />
                <div className={styles.settingWrapper}>
                    <Routes>
                        <Route
                            path='profile' 
                            element=
                            {
                                <Profile 
                                    cancel={cancel}
                                    setCancelState={setCancelState} 
                                    isSaving={isSaving}
                                    setSavingState={setSavingState}
                                />
                            } 
                        />
                        <Route 
                            path='interface' 
                            element=
                            {
                                <Interface 
                                    cancel={cancel} 
                                    setCancelState={setCancelState}
                                    isSaving={isSaving}
                                    setSavingState={setSavingState}
                                />
                            } 
                        />
                        <Route 
                            path='language' 
                            element=
                            {
                                <Language 
                                    cancel={cancel} 
                                    setCancelState={setCancelState}
                                    isSaving={isSaving}
                                    setSavingState={setSavingState}
                                />
                            } 
                        />
                        <Route 
                            path='security' 
                            element=
                            {
                                <Security 
                                    cancel={cancel} 
                                    setCancelState={setCancelState}
                                    isSaving={isSaving}
                                />
                            } 
                        />
                    </Routes>
                </div>
            </div> : null}
        </div>
    );
});

export default Settings;