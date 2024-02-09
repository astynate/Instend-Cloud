import React from 'react';
import './styles/main.css';
import './styles/media.css';
import logo from './images/logo.svg';
import help from './images/help.png';
import link from './images/link.png';
import ExternalLink from '../../shared/link/ExternalLink';

const Header = () => {

    return (

        <>

            <div className="header">
                <div className="product-logo">
                    <img src={logo} className="logo" draggable="false" />
                    <span className="product-name"><span className="company-name">Exider</span>&nbsp;Account</span>
                </div>
                <div className="links">
                    <ExternalLink logo={help} name="Help" link="https://google.com" />
                    <ExternalLink logo={link} name="Terms of use" link="https://google.com" />
                </div>
            </div>

        </>

    );

}

export default Header;