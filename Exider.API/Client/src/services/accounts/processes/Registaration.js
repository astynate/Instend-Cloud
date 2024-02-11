import React, { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';

const UserContext = createContext();

const Registration = ({ children }) => {

    const defaultUser = {

        name: '',
        surname: '',
        nickname: '',
        email: '',
        password: ''

    }

    const [user, setUser] = useState(defaultUser);

    return (

        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>

    );

}

export default UserContext;