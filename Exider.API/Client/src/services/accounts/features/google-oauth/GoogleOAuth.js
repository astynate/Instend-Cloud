import React from 'react';
import Logo from './images/google_logo.png';
import './styles/main.css';
import { useTranslation } from 'react-i18next';

const GoogleOAuth = () => {

    const { t } = useTranslation();

    return (

        <div className='google-oauth'>
            <img src={Logo} className='google-logo' draggable="false" />
            <span className='google-auth-text'>{t('account.continue_with_google')}</span>
        </div>
    
    );

}

export default GoogleOAuth;