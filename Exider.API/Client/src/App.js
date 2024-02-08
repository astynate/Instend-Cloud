import React, { useState } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import Authorization from './services/accounts/layout/Layout';
import Layout from './services/cloud/layout/Layout';
import PrivateRoutes from './routes/PrivateRoutes';
import PublicRoutes from './routes/PublicRoutes';

const App = () => {

    const [isAuthenticated, setAuthificationParameter] = useState(false);
    const applicationRoutes = [...PrivateRoutes, ...PublicRoutes];

    return (

        isAuthenticated ?

            <Layout>
                <Switch>
                    {applicationRoutes.map((path, component) => {
                        <Route path={path} component={component} exact={true} />
                    })}
                    <Redirect to="/home" />
                </Switch>
            </Layout>

        :

            <Authorization>
                <Switch>
                    {PrivateRoutes.map((path, component) => {
                        <Route path={path} component={component} exact={true} />
                    })}
                    <Redirect to="/accounts/login" />
                </Switch>
            </Authorization>

    );

};

export default App;