import React from 'react'
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css'
import './css/colors.css'
import './css/main.css'
import PrivateRoutes from '../../../routes/PrivateRoutes';
import { Helmet } from 'react-helmet';

const Layout = () => {

    const [isLoading, setIsLoading] = useState(true);
    const handleLoading = () => setIsLoading(false);

    return (
        <>
            {isLoading && <Loader />}
            <Helmet>
                <title>Exider Cloud</title>
            </Helmet>
            <NavigationPanel />
            <Routes>
                {PrivateRoutes.map((route, index) => {
                    const { element, ...rest } = route;
                    return <Route key={index} {...rest} element={element} />;
                })}
            </Routes>
        </>
    );

};

export default Layout;