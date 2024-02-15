import React, { useEffect, useState } from 'react';
import Close from './images/close.png';
import './styles/main.css';
import './styles/media.css';
import { useTranslation } from 'react-i18next';

const Notification = (props) => {

    const [isOpen, setOpenState] = useState(true);
    const { t } = useTranslation();

    return (

        <div className='notification' id={isOpen ? 'open' : null}>
            <div className='notification-title'>
                {props.children}
                <p>{props.title}</p>
                <button className='notification-button'>{t('account.confirm')}</button>
            </div>
            <img src={Close} className='notification-close' onClick={() => setOpenState(false)} />
        </div>
    
    );

}

export default Notification;