import React from 'react'
import LeftPanel from '../left-panel/LeftPanel';
import '../../css/fonts.css'
import '../../css/colors.css'
import '../../css/main.css'

const Layout = ({ children }) => {

    return (
        <>
            <LeftPanel />
            {children}
        </>
    );

};

export default Layout;