import React from 'react';
import { Link } from 'react-router-dom';
import OpenLink from '../../features/open-link/OpenLink';
import './styles/main.css';
import './styles/media.css';
import { useTranslation } from 'react-i18next';

const Footer = (props) => {

    const { t } = useTranslation();

    return (

        <div className='footer'>
            <div className='footer-links'>
                <Link to="/" className='footer-link'>{t('account.privacy_policy')}</Link>
                <Link to="/" className='footer-link'>{t('account.contact_us')}</Link>
                <OpenLink title='Русский' />
            </div>
            <div className='copyright'>
                <span>{t('account.copyright')}</span>
            </div>
        </div>

    );

}

export default Footer;