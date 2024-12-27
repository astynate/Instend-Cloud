import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Route, Routes } from 'react-router-dom';
import styles from './styles/main.module.css';
import Profile from '../pages/profile/Profile';
import Interface from '../pages/interface/Interface';
import Language from '../pages/language/Language';
import Security from '../pages/security/Security';
import Button from '../shared/button/Button';
import Header from '../widgets/header/Header';
import account from './images/account.png';
import language from './images/language.png';
import theme from './images/theme.png';

const Settings = observer((props) => {
    let location = useLocation();
    const [currentSetting, setCurrentSetting] = useState('Settings');
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
            {isOpen === false || props.isMobile === false &&
                <div className={styles.settings} id={props.isMobile ? "mobile" : "desktop"}>
                    <h1>Settings</h1>
                    <h4>Account & Privacy</h4>
                    <div className={styles.buttons}>
                        <Button 
                            title={t('cloud.settings.profile.title')}
                            name={t('cloud.settings.profile.name')}
                            path='/settings/profile' 
                            image={account}
                            setCurrentSetting={setCurrentSetting} 
                        />
                    </div>
                    <h4>Application</h4>
                    <div className={styles.buttons}>
                        <Button 
                            title={t('cloud.settings.interface.title')}
                            name={t('cloud.settings.interface.name')}
                            path='/settings/interface' 
                            image={theme}
                            setCurrentSetting={setCurrentSetting}
                        />
                        <Button 
                            title={t('cloud.settings.language.title')}
                            name={t('cloud.settings.language.name')}
                            path='/settings/language' 
                            image={language}
                            setCurrentSetting={setCurrentSetting}
                        />
                    </div>
                </div>} 
            {(isOpen || props.isMobile === false) &&
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
                            element={
                                <Profile 
                                    cancel={cancel}
                                    setCancelState={setCancelState} 
                                    isSaving={isSaving}
                                    setSavingState={setSavingState}
                                />} 
                        />
                        <Route 
                            path='interface' 
                            element={
                                <Interface 
                                    cancel={cancel} 
                                    setCancelState={setCancelState}
                                    isSaving={isSaving}
                                    setSavingState={setSavingState}
                                />} 
                        />
                        <Route 
                            path='language' 
                            element={
                                <Language 
                                    cancel={cancel} 
                                    setCancelState={setCancelState}
                                    isSaving={isSaving}
                                    setSavingState={setSavingState}
                                />} 
                        />
                        <Route 
                            path='security' 
                            element={
                                <Security 
                                    cancel={cancel} 
                                    setCancelState={setCancelState}
                                    isSaving={isSaving}
                                />} 
                        />
                    </Routes>
                </div>
            </div>}
        </div>
    );
});

export default Settings;