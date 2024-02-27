import React, { useEffect } from 'react';
import styles from './styles/main.module.css';
import LayoutHeader from '../../cloud/widgets/header/Header'
import { Route, Routes } from 'react-router-dom';
import Profile from '../pages/profile/Profile';
import Interface from '../pages/interface/Interface';
import Language from '../pages/language/Language';
import Security from '../pages/security/Security';

const Settings = (props) => {

    useEffect(() => {

        console.log(props.setPanelState(false))

    }, [props.setPanelState]);

    return (

        <div className={styles.wrapper}>
            <div className={styles.settings}>

            </div>
            <div className={styles.content}>
                <LayoutHeader />
                <Routes>
                    <Route path='profile' element={<Profile />} />
                    <Route path='interface' element={<Interface />} />
                    <Route path='language' element={<Language />} />
                    <Route path='security' element={<Security />} />
                </Routes>
            </div>
        </div>

    );

};

export default Settings;