import React from 'react';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';
import Header from '../widgets/header/Header';

const Desktop = ({ children }) => {
    
    return (

        <>
            <NavigationPanel />
            <div className='cloud-content-wrapper'>
                <Header />
                {children}
            </div>
        </>
        
    );

};

export default Desktop;