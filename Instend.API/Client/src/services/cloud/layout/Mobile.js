import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite';
import { NavLink, Route, Routes } from 'react-router-dom';
import MobileNavigation from './components/navigation-panel/MobileNavigation';
import UserState from '../../../state/entities/UserState';
import ApplicationState from '../../../state/application/ApplicationState';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import logo from './components/navigation-panel/images/logo/main-logo-black.svg';
import styles from './css/mobile.module.css';
import './css/main.css';

const Mobile = observer(() => {
    const { user } = UserState;
    
    useEffect(() => {
        ApplicationState.setIsMobile(true);
    }, []);

    return (
        <>
            <div className='mobile-header'>
                <div className='service-name'>
                    <img src={logo} />
                    <h1 className={styles.application}>Instend&nbsp;</h1>
                    <h2 className={styles.service}>Cloud</h2>
                </div>
                <NavLink to='/profile' className={styles.profileLink}>
                    <img src={`data:image/png;base64,${user.avatar || ""}`} className={styles.avatar} />
                </NavLink>
            </div>
            <div className='cloud-content-wrapper'>
                <Routes>
                    {PrivateRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return (<Route 
                            key={index} 
                            {...rest} 
                            element={React.cloneElement(element, { 
                                isMobile: true
                            })}
                        />);
                    })}
                </Routes>
            </div>
            <MobileNavigation />
        </>
    );
});

export default Mobile;