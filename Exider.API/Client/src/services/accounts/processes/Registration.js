import React, { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import Email from '../pages/create/Email';
import Nickname from '../pages/create/Nickname';
import Name from '../pages/create/Name';
import Password from '../pages/create/Password';
import Content from '../widgets/content/Content';
import Back from '../shared/back/Back';
import Line from '../shared/line/Line';
import GoogleOAuth from '../features/google-oauth/GoogleOAuth';

let UserContext = createContext();

const Registration = () => {

    let user = {

        name: '',
        surname: '',
        nickname: '',
        email: '',
        password: ''

    }

    return (

        <UserContext.Provider value={user}>
            <Content>
                <Routes>
                    <Route path="email" element={<Email />} />7
                    <Route path="nickname" element={<Nickname />} />
                    <Route path="name" element={<Name />} />
                    <Route path="password" element={<Password />} />
                </Routes>
                <Back />
                <Line title="or" />
                <GoogleOAuth />
            </Content>
        </UserContext.Provider>

    );

}

export { Registration, UserContext };