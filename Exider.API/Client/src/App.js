import React, { useEffect, useLayoutEffect } from 'react';
import { Routes, Navigate, Route, useLocation } from 'react-router-dom';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';
import userState from './states/user-state';
import { observer } from 'mobx-react-lite';

const App = observer(() => {

    let location = useLocation();

    const {isAuthorize, UpdateAuthorizeState, isLoading, isAccessibleRoute} = userState;

    useLayoutEffect(() => {

        UpdateAuthorizeState();

    }, []);

    return (

        (isLoading ? 
        
            <h1>Loading...</h1> 

        :

            <>
                <Routes>
                    <Route path="/account/*" element={<Authorization />} />
                    <Route path="/*" element={<Cloud />} />
                    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
                {(isAccessibleRoute === false) ? <Navigate to="/account/login" replace={true} /> : null}
            </>
        )
    );

});

export default App;