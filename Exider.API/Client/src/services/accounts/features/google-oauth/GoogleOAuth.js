import React, { useEffect } from 'react';
import Logo from './images/google_logo.png';
import './styles/main.css';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';

const GoogleOAuth = () => {
    const { t } = useTranslation();

    const login = useGoogleLogin({
        onSuccess: (tokenResponse) => {
          console.log('Google login successful', tokenResponse);
        },
        onError: () => {
          console.error('Google login failed');
        },
        flow: 'auth-code',
    });

    return (
        <div className='google-oauth' onClick={() => login()}>
            <img src={Logo} className='google-logo' draggable="false" />
            <span className='google-auth-text' >{t('account.continue_with_google')}</span>
        </div>
    );
}

export default GoogleOAuth;