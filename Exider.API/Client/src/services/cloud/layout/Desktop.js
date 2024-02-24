import React from 'react';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';

const Desktop = ({ children }) => {

    return (

        <>
            <NavigationPanel />
            {children}
        </>
        
    );

};

export default Desktop;