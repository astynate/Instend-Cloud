import React, { useEffect, useState } from 'react';
import Close from './images/close.png';
import './styles/main.css';
import './styles/media.css';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const Notification = (props) => {

    const state = useSelector((state) => state);
    const [isOpen, setOpenState] = useState(!state.isLanguageSelect);
    const { t, i18n } = useTranslation();

    const ConfirmLanguage = () => {

        i18n.changeLanguage(state.selectedLanguage);
        CloseNotification();
        
    };

    const CloseNotification = () => {

        setOpenState(false);
        localStorage.setItem('isLanguageSelected', true);

    };

    return (

        <div className='notification' id={isOpen ? 'open' : null}>
            <div className='notification-title'>
                {props.children}
                <p>{props.title}</p>
                <button className='notification-button' onClick={() => ConfirmLanguage()}>{t('account.confirm')}</button>
            </div>
            <img src={Close} className='notification-close' onClick={() => CloseNotification()} />
        </div>
    
    );

}

export default Notification;