import React from 'react';
import { Link } from 'react-router-dom';
import OpenLink from '../../features/open-link/OpenLink';
import './styles/main.css';
import './styles/media.css';

const Footer = (props) => {

    return (

        <div className='footer'>
            <div className='footer-links'>
                <Link to="/" className='footer-link'>Privacy Policy</Link>
                <Link to="/" className='footer-link'>Contact Us</Link>
                <OpenLink title='Русский' />
            </div>
            <div className='copyright'>
                <span>© Andreev 2024, Minsk, Belarus</span>
            </div>
        </div>

    );

}

export default Footer;