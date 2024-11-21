import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Route, Routes } from 'react-router-dom';
import NavigationPanel from './components/navigation-panel/NavigationPanel';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import ApplicationState from '../../../state/application/ApplicationState';

const Desktop = observer(({ }) => {
    const [isPanelRolledUp, setPanelState] = useState(true);

    useEffect(() => {
        ApplicationState.setIsMobile(false);
    }, []);

    return (
        <div className='wrapper'>
            <NavigationPanel isPanelRolledUp={isPanelRolledUp} />
            <div className='cloud-content-wrapper'>
                <Routes>
                    {PrivateRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return (
                            <Route
                                key={index}
                                {...rest}
                                element={React.cloneElement(element, { 
                                    setPanelState: setPanelState,
                                    isMobile: false
                                })}
                            />
                        );
                    })}
                </Routes>
            </div>
        </div>
    );
});

export default Desktop;