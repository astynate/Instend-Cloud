import React, { useState, useEffect } from 'react';
import { Routes, useLocation, Navigate, Route } from 'react-router-dom';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';
import ValidateRoute from './utils/handlers/ValidateRoute'
import { useSelector } from 'react-redux';
import Authorization from './services/accounts/layout/Layout';
import Cloud from './services/cloud/layout/Layout';

const App = () => {

    let location = useLocation();

    const applicationRoutes = [...PrivateRoutes, ...PublicRoutes];
    const isAuthenticated = useSelector((state) => state.isAuthenticated);
    const [isAccessibleRoute, setAccessibleRoute] = useState(ValidateRoute(PublicRoutes, isAuthenticated, location));

    useEffect(() => {

        setAccessibleRoute(ValidateRoute(PublicRoutes,
            isAuthenticated, location));

    }, [isAuthenticated, location]);

    return (

        <>
            <Routes>
                <Route path="/account/*" element={<Authorization />} />
                <Route path="/*" element={<Cloud />} />
            </Routes>
            {(isAccessibleRoute === false) ? <Navigate to="/account/login" replace={true} /> : null}
        </>

    );

};

export default App;