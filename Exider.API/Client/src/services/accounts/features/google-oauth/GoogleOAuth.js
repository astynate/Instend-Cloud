import React from 'react';
import Logo from './images/google_logo.png';
import './styles/main.css';

const GoogleOAuth = () => {

    return (

        <div className='google-oauth'>
            <img src={Logo} className='google-logo' draggable="false" />
            <span className='google-auth-text'>Continue with Google</span>
        </div>
    
    );

}

export default GoogleOAuth;