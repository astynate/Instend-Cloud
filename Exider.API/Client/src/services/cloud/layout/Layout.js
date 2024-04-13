import React, { useContext } from 'react'
import { useState, useEffect } from 'react';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';
import { Helmet } from 'react-helmet';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { createSignalRContext } from "react-signalr/signalr";

export const messageWSContext = createSignalRContext();
export const storageWSContext = createSignalRContext();

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
        <messageWSContext.Provider url={"http://localhost:5000/message-hub"}>
            <storageWSContext.Provider url={"http://localhost:5000/storage-hub"}>
                <div className='cloud-wrapper'>
                    {isLoading && <Loader />}
                    <Helmet>
                        <title>Exider Cloud</title>
                    </Helmet>
                    {windowWidth > 700 ? <Desktop /> : <Mobile /> }
                </div>
            </storageWSContext.Provider>
        </messageWSContext.Provider>
    );

};

export default Layout;