import React from 'react'
import { useState, useEffect } from 'react';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';

import { Helmet } from 'react-helmet';
import Desktop from './Desktop';
import Mobile from './Mobile';

const Layout = () => {

    const handleLoading = () => setIsLoading(false);

    const [isLoading, setIsLoading] = useState(false);
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
            {windowWidth > 500 ? <Desktop /> : <Mobile /> }
        </div>
    );

};

export default Layout;