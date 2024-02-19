import React from 'react'
import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';
import Loader from '../widgets/loader/Loader';
import font_styles from './css/fonts.css'
import color_styles from './css/colors.css'
import main_styles from './css/main.css'
import PrivateRoutes from '../../../routes/PrivateRoutes';

const Layout = () => {

    const [isLoading, setIsLoading] = useState(true);
    const handleLoading = () => setIsLoading(false);

    return (
        <>
            {isLoading && <Loader />}
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