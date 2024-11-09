import React, { useEffect, useState } from 'react';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';
import { observer } from 'mobx-react-lite';
import userState from '../../../state/entities/UserState';
import PrivateRoutes from '../../../routes/PrivateRoutes';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Disconnected from '../features/disconnected/Disconnected';
import applicationState from '../../../states/application-state';

const Desktop = observer(({ }) => {
    const { user, UpdateAuthorizeState, isAuthorize } = userState;
    const [isPanelRolledUp, setPanelState] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            UpdateAuthorizeState(location.pathname, navigate);
        }
    }, [user]);

    useEffect(() => {
        applicationState.setIsMobile(false);
    }, []);

    if (isAuthorize) {
        return (
            <>
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
            </>
        );
    } else {
        navigate('/account/login');
    }
});

export default Desktop;