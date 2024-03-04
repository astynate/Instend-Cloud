import React from 'react'
import MobileNavigation from '../widgets/navigation-panel/MobileNavigation';
import logo from '../widgets/navigation-panel/images/logo/main-logo-black.svg';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './css/main.css';

const Mobile = () => {

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
                <Routes>
                    {PrivateRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route 
                            key={index} 
                            {...rest} 
                            element={React.cloneElement(element, { 
                                isMobile: true
                            })}
                        />;
                    })}
                </Routes>
            </div>
            <MobileNavigation />
        </>
        
    );

};

export default Mobile;