import React from 'react';
import logo from './images/logo.png';
import './style/main.css';

const Content = (props) => {

    return (

        <div className='content'>
            <div className='form'>
                <img src={logo} className='main-logo' draggable="false" />
                {props.children}
            </div>
        </div>

    );

}

export default Content;