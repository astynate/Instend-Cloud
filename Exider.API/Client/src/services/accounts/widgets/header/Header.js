import React from 'react';
import './styles/main.css';
import './styles/media.css';
import logo from './images/logo.svg';
import link from './images/link.png';
import ExternalLink from '../../shared/link/ExternalLink';
import { useTranslation } from 'react-i18next';

const Header = () => {

    const { t } = useTranslation();

    return (

        <>

            <div className="header">
                <div className="product-logo">
                    <img src={logo} className="logo" draggable="false" />
                    <span className="product-name"><span className="company-name">Exider</span>&nbsp;{t('account.service_name')}</span>
                </div>
                <div className="links">
                    <ExternalLink logo={link} name={t('account.technical_support')} link="https://google.com" />
                    <ExternalLink logo={link} name={t('account.terms_of_use')} link="https://google.com" />
                </div>
            </div>

        </>

    );

}

export default Header;