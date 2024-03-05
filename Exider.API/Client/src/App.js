import React, { useEffect } from 'react';
import { Routes, useNavigate, Route, useLocation } from 'react-router-dom';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';
import userState from './states/user-state';
import { observer } from 'mobx-react-lite';
import MainLoader from './components/loader/MainLoader';

const App = observer(() => {

    let navigate = useNavigate();
    let location = useLocation();

    const {UpdateAuthorizeState, isLoading} = userState;

    useEffect(() => {

        document.querySelector('#root').className = localStorage.getItem('color-mode');
        UpdateAuthorizeState(location.pathname, navigate);

    }, []);

    return (

        (isLoading ?  <MainLoader /> :

            <>
                <Routes>
                    <Route path="/account/*" element={<Authorization />} />
                    <Route path="/*" element={<Cloud />} />
                    <Route path="*" element={<h1>404 - Not Found</h1>} />
                </Routes>
            </>
        )
    );

});

export default App;