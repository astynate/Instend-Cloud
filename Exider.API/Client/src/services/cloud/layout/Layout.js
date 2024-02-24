import React from 'react'
import { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import { Helmet } from 'react-helmet';
import Desktop from './Desktop';
import Mobile from './Mobile';

const Layout = () => {

    const [isLoading, setIsLoading] = useState(true);
    const handleLoading = () => setIsLoading(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    useEffect(() => {

        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    return (
        <div className='cloud-wrapper'>
            {isLoading && <Loader />}
            <Helmet>
                <title>Exider Cloud</title>
            </Helmet>
            {windowWidth > 500 ? 
            
                    <Desktop>
                        <div className='cloud-content-wrapper'>
                            <Routes>
                                {PrivateRoutes.map((route, index) => {
                                    const { element, ...rest } = route;
                                    return <Route key={index} {...rest} element={element} />;
                                })}
                            </Routes>
                        </div>
                    </Desktop>

                :

                    <Mobile>
                        <div className='cloud-content-wrapper'>
                            <Routes>
                                {PrivateRoutes.map((route, index) => {
                                    const { element, ...rest } = route;
                                    return <Route key={index} {...rest} element={element} />;
                                })}
                            </Routes>
                        </div>
                    </Mobile>

            }
        </div>
    );

};

export default Layout;