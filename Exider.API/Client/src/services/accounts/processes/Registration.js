import React, { createContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Email from '../pages/create/Email';
import Nickname from '../pages/create/Nickname';
import Name from '../pages/create/Name';
import Password from '../pages/create/Password';
import Content from '../widgets/content/Content';
import Back from '../shared/back/Back';

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
                <div className='external-links'>
                    <div className='external-link'>
                        <p>By registering, you agree to the</p>
                        <Link to="/">Terms of use</Link>
                    </div>
                    <div className='external-link'>
                        <Link to="/account/login">Already have an account?</Link>
                    </div>
                </div>
            </Content>
        </UserContext.Provider>

    );

}

export { Registration, UserContext };