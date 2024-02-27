import React, { useEffect, useState } from 'react';
import NavigationPanel from '../widgets/navigation-panel/NavigationPanel';
import { observer } from 'mobx-react-lite';
import userState from '../../../states/user-state';
import { useLocation, useNavigate } from 'react-router-dom';

const Desktop = observer(({ children }) => {
    
    const { user, UpdateAuthorizeState, isAuthorize } = userState;
    const [isPanelOpen, setPanelState] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {

        if (user === null) {
            UpdateAuthorizeState(location.pathname, navigate);
        }

    }, [user]);

    if (isAuthorize) {

        return (

            <>
                <NavigationPanel isOpen={isPanelOpen} />
                <div className='cloud-content-wrapper'>
                    {React.cloneElement(children, { setPanelState: setPanelState })}
                </div>
            </>
            
        );

    } else {
        navigate('/account/login');
    }

});

export default Desktop;