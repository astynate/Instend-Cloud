import React, { useEffect, useMemo, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { matchPath, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import MobileNavigation from './components/navigation-panel/MobileNavigation';
import AccountState from '../../../state/entities/AccountState';
import ApplicationState from '../../../state/application/ApplicationState';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import logo from './components/navigation-panel/images/logo/main-logo-black.svg';
import styles from './css/mobile.module.css';
import StorageController from '../../../api/StorageController';
import search from './images/search.png';
import './css/main.css';

const routes = [...PrivateRoutes].reverse();

const Mobile = observer(() => {
    const [currentRouteIndex, setCurrentRouteIndex] = useState(0);
    const { account } = AccountState;
    const location = useLocation();
    
    useEffect(() => {
        ApplicationState.setIsMobile(true);
    }, []);
        
    if (!account) {
        return null;
    };

    useEffect(() => {
        const currentRoute = routes
            .findIndex(route => {
                console.log(route, location.pathname);
                return matchPath({ path: route.path, exact: true, strict: true }, location.pathname)}
            );
                
        setCurrentRouteIndex(currentRoute);
    }, [routes, location.pathname]); 

    return (
        <>
            {!routes[currentRouteIndex].isHeaderless && <div className='mobile-header'>
                <div className='service-name'>
                    <img src={logo} draggable="false" />
                    <h1 className={styles.application}>Instend&nbsp;</h1>
                    <h2 className={styles.service}>{currentRouteIndex ? routes[currentRouteIndex].name : "Home"}</h2>
                </div>
                <div className={styles.buttons}>
                    <NavLink to='/explore' className={styles.button}>
                        <img src={search} draggable="false" />
                    </NavLink>
                    <NavLink to='/profile' className={styles.profileLink}>
                        <img 
                            src={StorageController.getFullFileURL(account.avatar)} 
                            className={styles.avatar}
                            draggable="false"
                        />
                    </NavLink>
                </div>
            </div>}
            <div className='cloud-content-wrapper'>
                <Routes>
                    {routes.map((route, index) => {
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
            {!routes[currentRouteIndex].isWithoutBottomPanel && <MobileNavigation />}
        </>
    );
});

export default Mobile;