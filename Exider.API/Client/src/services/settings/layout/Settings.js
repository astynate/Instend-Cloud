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
import { instance } from '../../../state/Interceptors';
import { observer } from 'mobx-react-lite';
import userState from '../../../states/user-state';
import { CancelToken } from 'axios';
import { useNavigate, useLocation} from 'react-router-dom';

const Endpoints = {
    "/settings/profile": "/accounts",
    "/settings/interface": "/settings/interface",
    "/settings/language": "/settings/language",
    "/settings/notifications": "/settings/notifications",
}

const Settings = observer((props) => {

    let navigate = useNavigate();
    let location = useLocation();

    const [currentSetting, setCurrentSetting] = useState('Settings');
    const [currentRoute, setCurrentRoute] = useState('/');
    const [headerState, setHeaderState] = useState('valid');
    const [data, setData] = useState();
    const { UpdateUserData } = userState;
    const [cancel, setCancelState] = useState(false);

    const Save = async () => {

        const source = CancelToken.source();

        const timeoutId = setTimeout(() => {

            source.cancel("Request timeout");
            setHeaderState('valid');

        }, 7000);

        let form = new FormData();
        
        form.append("avatar", data.avatar);

        setHeaderState('loading');

        try {

            const response = await instance({
                method: 'put',
                url: Endpoints[currentRoute],
                data: data,
                headers: { 'Content-Type': 'multipart/form-data' },
                cancelToken: source.token
            });

            clearTimeout(timeoutId);

            if (response.status === 200) {

                UpdateUserData(location, navigate);
                setHeaderState('valid');

            } else {

                UpdateUserData(location, navigate);
                setHeaderState('invalid');

            }

        } catch {
            setHeaderState('invalid');
        }

    };

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
                    <Button 
                        title='Profile' 
                        path='/settings/profile' 
                        setCurrentSetting={setCurrentSetting} 
                        setCurrentRoute={setCurrentRoute} 
                    />
                    <Button 
                        title='Interface' 
                        path='/settings/interface' 
                        setCurrentSetting={setCurrentSetting} 
                        setCurrentRoute={setCurrentRoute} 
                    />
                    <Button 
                        title='Language' 
                        path='/settings/language' 
                        setCurrentSetting={setCurrentSetting}  
                        setCurrentRoute={setCurrentRoute} 
                    />
                    <Button 
                        title='Notifications' 
                        path='/settings/notifications' 
                        setCurrentSetting={setCurrentSetting}
                        setCurrentRoute={setCurrentRoute}
                    />
                </div>
                <div className={styles.line}></div>
                <div className={styles.buttons}>
                    <Button 
                        title='Password recovery' 
                        path='/settings/password-recovery' 
                        setCurrentSetting={setCurrentSetting}
                        setCurrentRoute={setCurrentRoute}
                    />
                    <Button 
                        title='Blocked users' 
                        path='/settings/blocked-users' 
                        setCurrentSetting={setCurrentSetting}
                        setCurrentRoute={setCurrentRoute}
                    />
                    <Button 
                        title='Account privacy' 
                        path='/settings/account-privacy' 
                        setCurrentSetting={setCurrentSetting} 
                        setCurrentRoute={setCurrentRoute}
                    />
                </div>
            </div>
            <div className={styles.content}>
                <Header 
                    title={currentSetting} 
                    onClick={Save}
                    state={headerState}
                    setCancelState={setCancelState}
                />
                <div className={styles.settingWrapper}>
                    <Routes>
                        <Route 
                            path='profile' 
                            element={<Profile setData={setData} cancel={cancel} setCancelState={setCancelState} />} 
                        />
                        <Route 
                            path='interface' 
                            element={<Interface setData={setData} cancel={cancel} setCancelState={setCancelState} />} 
                        />
                        <Route 
                            path='language' 
                            element={<Language setData={setData} cancel={cancel} setCancelState={setCancelState} />} 
                        />
                        <Route 
                            path='security' 
                            element={<Security setData={setData} cancel={cancel} setCancelState={setCancelState} />} 
                        />
                    </Routes>
                </div>
            </div>
        </div>

    );

});

export default Settings;