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

const Settings = (props) => {

    const [currentSetting, setCurrentSetting] = useState('Settings');

    useEffect(() => {

        if (props.setPanelState) {
            props.setPanelState(true);
        }

        return () => {

            if (props.setPanelState) {
                props.setPanelState(false);
            }

        };

    }, [props.setPanelState]);

    return (

        <div className={styles.wrapper}>
            <div className={styles.settings}>
                <MiniProfile />
                <div className={styles.line}></div>
                <div className={styles.buttons}>
                    <Button title='Profile' path='/settings/profile' setCurrentSetting={setCurrentSetting} />
                    <Button title='Interface' path='/settings/interface' setCurrentSetting={setCurrentSetting} />
                    <Button title='Language' path='/settings/language' setCurrentSetting={setCurrentSetting} />
                    <Button title='Notifications' path='/settings/notifications' setCurrentSetting={setCurrentSetting} />
                </div>
                <div className={styles.line}></div>
                <div className={styles.buttons}>
                    <Button title='Password recovery' path='/settings/password-recovery' setCurrentSetting={setCurrentSetting} />
                    <Button title='Blocked users' path='/settings/blocked-users' setCurrentSetting={setCurrentSetting} />
                    <Button title='Account privacy' path='/settings/account-privacy' setCurrentSetting={setCurrentSetting} />
                </div>
            </div>
            <div className={styles.content}>
                <Header title={currentSetting} />
                <div className={styles.settingWrapper}>
                    <Routes>
                        <Route path='profile' element={<Profile />} />
                        <Route path='interface' element={<Interface />} />
                        <Route path='language' element={<Language />} />
                        <Route path='security' element={<Security />} />
                    </Routes>
                </div>
            </div>
        </div>

    );

};

export default Settings;