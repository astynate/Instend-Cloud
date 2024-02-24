import React from 'react'
import MobileNavigation from '../widgets/navigation-panel/MobileNavigation';
import logo from '../widgets/navigation-panel/images/logo/main-logo-black.svg';
import './css/main.css';

const Mobile = ({ children }) => {

    return (

        <>
            <div className='mobile-header'>
                <div className='service-name'>
                    <img src={logo} />
                    <h1>Exider&nbsp;</h1>
                    <h2>Cloud</h2>
                </div>
            </div>
            <div className='cloud-content-wrapper'>
                {children}
            </div>
            <MobileNavigation />
        </>
        
    );

};

export default Mobile;