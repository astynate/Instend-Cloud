import React from 'react';
import logo from './images/logo.png';
import './style/main.css';
import './style/media.css';

const Content = (props) => {

    return (

        <div className='content'>
            <div className='form'>
                <img src={logo} className='main-logo' draggable="false" alt="logo" />
                {props.children}
            </div>
        </div>

    );

}

export default Content;