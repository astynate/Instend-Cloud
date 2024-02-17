import React, { useState, useEffect, useTransition } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Authorization from './services/accounts/layout/Layout';
import Layout from './services/cloud/layout/Layout';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';
import ValidateRoute from './utils/handlers/ValidateRoute'

const App = () => {

    let location = useLocation();

    const applicationRoutes = [...PrivateRoutes, ...PublicRoutes];
    const [isAuthenticated, setAuthificationParameter] = useState(false);
    const [isAccessibleRoute, setAccessibleRoute] = useState(ValidateRoute(PublicRoutes, isAuthenticated, location));

    useEffect(() => {

        setAccessibleRoute(ValidateRoute(PublicRoutes,
            isAuthenticated, location));

    }, [isAuthenticated, location]);

    return (

        (isAuthenticated ?

            <Layout>
                <Routes>
                    {applicationRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </Layout>

        :

            <Authorization>
                <Routes>
                    {PublicRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
                {(isAccessibleRoute === false) ? <Navigate to="/account/login" replace={true} /> : null}
            </Authorization>
        )
    );

};

export default App;