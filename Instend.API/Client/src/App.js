import React, { useEffect } from 'react';
import { Routes, useNavigate, Route, useLocation } from 'react-router-dom';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';
import userState from './states/user-state';
import { observer } from 'mobx-react-lite';
import MainLoader from './components/loader/MainLoader';
import Main from './services/main/layout/Layout';
import Support from './services/support/layout/Layout';

const App = observer(() => {
    let navigate = useNavigate();
    let location = useLocation();

    const {UpdateAuthorizeState, isLoading} = userState;

    useEffect(() => {
        try {
            document.querySelector('#root').className = localStorage.getItem('color-mode');
            UpdateAuthorizeState(location.pathname, navigate);
        } catch {
            // console.error(error);
        }
    }, []);

    if (isLoading)
        return (<MainLoader />);

    return (
        <Routes>
            <Route path="/account/*" element={<Authorization />} />
            <Route path="/main" element={<Main />} />
            <Route path="/support" element={<Support />} />
            <Route path="/*" element={<Cloud />} />
            <Route path="*" element={<h1>404 - Not Found</h1>} />
        </Routes>
    );
});

export default App;