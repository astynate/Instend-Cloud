import React, { useState, useEffect } from 'react';
import { Route, Routes, useLocation, Navigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout from './global/components/layout/Layout';
import Authorization from './authorization/Authorization';


const App = () => {

    let [isAuthenticated, setisAuthenticated] = useState(false);
    let location = useLocation();
    let authRoutes = ['/login', '/registration', '/confirm'];

    useEffect(() => {

        if (!isAuthenticated && !authRoutes.includes(location.pathname)) {

            window.location.href = '/login';

        }

    }, [isAuthenticated, location]);

    return (

        isAuthenticated ?

            <Layout>
                <Routes>
                    {AppRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </Layout>

        : <Authorization />

    );

};

export default App;