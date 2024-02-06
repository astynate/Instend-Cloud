import React from 'react'
import { useState } from 'react';
import LeftPanel from '../left-panel/LeftPanel';
import Loader from '../loader/Loader';
import '../../css/fonts.css'
import '../../css/colors.css'
import '../../css/main.css'

const Layout = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const handleLoading = () => setIsLoading(false);

    return (
        <>
            {isLoading && <Loader />}
            <LeftPanel />
            {children}
        </>
    );

};

export default Layout;