import React from 'react'
import MobileNavigation from '../widgets/navigation-panel/MobileNavigation';
import logo from '../widgets/navigation-panel/images/logo/main-logo-black.svg';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import { NavLink, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './css/main.css';
import styles from './css/mobile.module.css';
import { observer } from 'mobx-react-lite';
import userState from '../../../states/user-state';

const Mobile = observer(() => {

    const { user } = userState;

    return (

        <>
            <div className='mobile-header'>
                <div className='service-name'>
                    <img src={logo} />
                    <h1>Exider&nbsp;</h1>
                    <h2>Cloud</h2>
                </div>
                <NavLink to='/profile' className={styles.profileLink}>
                    <img src={`data:image/png;base64,${user.avatar || ""}`} className={styles.avatar} />
                </NavLink>
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

});

export default Mobile;