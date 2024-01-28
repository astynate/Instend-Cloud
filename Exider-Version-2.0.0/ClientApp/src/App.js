import React, { Component, useLayoutEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import Layout from './global/components/layout/Layout';
import Authorization from './authorization/Authorization';


const App = () => {

    let [isAuthenticated, setisAuthenticated] = useState(false);

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