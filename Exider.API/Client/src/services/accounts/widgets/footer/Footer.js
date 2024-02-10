import React from 'react';
import ExternalLink from '../../shared/link/ExternalLink'
import logo from './images/link.png';
import './styles/main.css';
import './styles/media.css';

const Footer = (props) => {

    return (

        <div className='footer'>
            <div className='footer-links'>
                <ExternalLink logo={logo} name="Privacy Policy" link="https://google.com" />
                <ExternalLink logo={logo} name="Contact Us" link="https://google.com" />
            </div>
            <div className='copyright'>
                <span>© Andreev 2024, Minsk, Belarus</span>
            </div>
        </div>

    );

}

export default Footer;