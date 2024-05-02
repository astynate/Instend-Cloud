import React, { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/media.css';
import logo from './images/logo.svg';
import link from './images/link.png';
import ExternalLink from '../../shared/link/ExternalLink';
import { useTranslation } from 'react-i18next';
import HeaderMenu from './HeaderMenu';

const Header = () => {

    const { t } = useTranslation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isMenuOpen, setMenuState] = useState(false);

    useEffect(() => {

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <div className="header" id={isMenuOpen ? 'menu-open' : (windowWidth > 550) ? 'desktop' : 'mobile'}>
            <div className="product-logo">
                <img src={logo} className="logo" alt="Logo" draggable="false" />
                <span className="product-name"><span className="company-name">Yexider</span>&nbsp;{t('account.service_name')}</span>
            </div>
            {(windowWidth > 550) ? (
                <div className="links">
                    <ExternalLink logo={link} name={t('account.technical_support')} link="https://google.com" />
                    <ExternalLink logo={link} name={t('account.terms_of_use')} link="https://google.com" />
                </div>
            ) : <HeaderMenu menuState={isMenuOpen} setMenuState={setMenuState} />}
        </div>
    );
}

export default Header;
