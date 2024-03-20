import React from 'react'
import { useState, useEffect } from 'react';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';
import { Helmet } from 'react-helmet';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { createSignalRContext } from "react-signalr/signalr";

export const SignalRContext = createSignalRContext();

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
        <SignalRContext.Provider url={"http://localhost:7128/message-hub"}>
            <div className='cloud-wrapper'>
                {isLoading && <Loader />}
                <Helmet>
                    <title>Exider Cloud</title>
                </Helmet>
                {windowWidth > 700 ? <Desktop /> : <Mobile /> }
            </div>
        </SignalRContext.Provider>
    );

};

export default Layout;