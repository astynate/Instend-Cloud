import React, { useEffect } from 'react';
import { Routes, useNavigate, Route, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';
import UserState from './state/entities/UserState';
import Main from './services/main/layout/Layout';
import Support from './services/support/layout/Layout';
import TopLineLoaderAnimation from './services/cloud/shared/animations/top-line-loader-animation/TopLineLoaderAnimation';

const App = observer(() => {
    let navigate = useNavigate();
    let location = useLocation();

    useEffect(() => {
        document.querySelector('#root').className = localStorage.getItem('color-mode');
        UserState.UpdateAuthorizeState(location.pathname, navigate);
    }, []);

    if (UserState.isLoading)
        return (<TopLineLoaderAnimation />);

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