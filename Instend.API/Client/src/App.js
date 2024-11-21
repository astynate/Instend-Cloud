import React, { useEffect } from 'react';
import { Routes, useNavigate, Route, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';
import UserState from './state/entities/UserState';
import Main from './services/main/layout/Layout';
import Support from './services/support/layout/Layout';
import ApplicationState from './state/application/ApplicationState';
import AccountController from './api/AccountController';

const App = observer(() => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        document.querySelector('#root').className = localStorage.getItem('color-mode');
        
        AccountController.GetAccountData(
            UserState.SetUser, 
            () => navigate('/main')
        );
    }, [ApplicationState.theme]);

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