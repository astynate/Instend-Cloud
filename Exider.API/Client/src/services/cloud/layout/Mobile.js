import React from 'react'
import MobileNavigation from '../widgets/navigation-panel/MobileNavigation';

const Mobile = ({ children }) => {

    return (

        <>
            <MobileNavigation />
            {children}
        </>
        
    );

};

export default Mobile;