import React, { createContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Email from '../pages/create/Email';
import Nickname from '../pages/create/Nickname';
import Name from '../pages/create/Name';
import Password from '../pages/create/Password';
import Back from '../shared/back/Back';
import Line from '../shared/line/Line';
import { useTranslation } from 'react-i18next';

let UserContext = createContext();

const Registration = () => {

    const { t } = useTranslation();

    let user = {

        name: '',
        surname: '',
        nickname: '',
        email: '',
        password: ''

    }

    return (

        <UserContext.Provider value={user}>
            <Routes>
                <Route path="email" element={<Email />} />
                <Route path="nickname" element={<Nickname />} />
                <Route path="name" element={<Name />} />
                <Route path="password" element={<Password />} />
            </Routes>
            <Back />
            <Line />
            <div className='external-links'>
                <div className='external-link'>
                    <p>{t('account.registration.confirm')}</p>
                    <Link to="/">{t('account.terms_of_use')}</Link>
                </div>
                <div className='external-link'>
                    <Link to="/account/login">{t('account.have_account')}</Link>
                </div>
            </div>
        </UserContext.Provider>

    );

}

export { Registration, UserContext };