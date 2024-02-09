import React from 'react'
import { useState } from 'react';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css'
import './css/colors.css'
import './css/main.css'

const Layout = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const handleLoading = () => setIsLoading(false);

    return (
        <>
            {isLoading && <Loader />}
            <NavigationPanel />
            {children}
        </>
    );

};

export default Layout;