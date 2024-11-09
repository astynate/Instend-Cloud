import React, { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/media.css';
import link from './images/link.png';
import ExternalLink from '../../shared/link/ExternalLink';
import { useTranslation } from 'react-i18next';
import HeaderMenu from './HeaderMenu';
import InstendLogo from './images/instend-logo.svg';
import { Link } from 'react-router-dom';

const Header = ({name}) => {
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
            <Link to={'/main'} className="product-logo">
                <img src={InstendLogo} className="logo" alt="Logo" draggable="false" />
                <span className="product-name"><span className="company-name">Instend</span>&nbsp;{name}</span>
            </Link>
            {(windowWidth > 550) ? (
                <div className="links">
                    <ExternalLink logo={link} name={t('account.technical_support')} link="/support" />
                    <ExternalLink logo={link} name={t('account.terms_of_use')} link="/support" />
                </div>
            ) : <HeaderMenu menuState={isMenuOpen} setMenuState={setMenuState} />}
        </div>
    );
}

export default Header;
