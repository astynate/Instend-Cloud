import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Authorization from './services/accounts/layout/Layout';
import Layout from './services/cloud/layout/Layout';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';

const App = () => {

    const [isAuthenticated, setAuthificationParameter] = useState(false);
    const [isAccessibleRoute, setAccessibleRoute] = useState(false);
    const applicationRoutes = [...PrivateRoutes, ...PublicRoutes];

    let location = useLocation();

    useEffect(() => {

        setAccessibleRoute(!(isAuthenticated === false &&
            PrivateRoutes.concat(location) === false));

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
                {(isAccessibleRoute === false) ? <Navigate to="/login" replace={true} /> : null}
            </Authorization>)
    );

};

export default App;