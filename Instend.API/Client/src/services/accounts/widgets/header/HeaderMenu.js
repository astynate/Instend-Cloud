import React, { useState, useEffect } from 'react';
import './styles/main.css';
import './styles/media.css';
import link from './images/link.png';
import ExternalLink from '../../shared/link/ExternalLink';
import Menu from './images/menu.png';
import { useTranslation } from 'react-i18next';

const HeaderMenu = (props) => {
    const { t } = useTranslation();

    return (
        <>
            <div className='account-header-menu'>
                <img 
                    src={Menu} 
                    className='account-header-menu-image'
                    onClick={() => props.setMenuState(prev => !prev)}
                    draggable="false"
                />
            </div>
            <div className='header-menu-items' id={props.menuState ? 'open' : null}>
                <div className="header-menu-links">
                    <ExternalLink logo={link} name={t('account.technical_support')} link="/support" />
                    <ExternalLink logo={link} name={t('account.terms_of_use')} link="/support" />
                </div>
            </div>
        </>
    );
}

export default HeaderMenu;
