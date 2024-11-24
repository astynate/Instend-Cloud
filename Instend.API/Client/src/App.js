import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';
import Main from './services/main/layout/Layout';
import Support from './services/support/layout/Layout';
import ApplicationState from './state/application/ApplicationState';

const App = observer(() => {
    useEffect(() => {
        const colorMode = localStorage.getItem('color-mode');
        document.querySelector('#root').className = colorMode;
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