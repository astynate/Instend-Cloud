import React, { useEffect } from 'react';
import ColorMode from './components/global/ColorMode';
import Footer from './components/global/Footer';
import { Route, Routes } from 'react-router-dom';
import './global/css/content.css';
import './global/css/main.css';
import './global/css/media-queries.css';
import './global/css/footer.css';
import Login from './global/routes/Login';
import Registration from './global/routes/Registration';
import Content from './components/global/Content';

const Authorization = () => {

    useEffect(() => {

        document.body.setAttribute('class', 'notranslate');
        const colorMode = localStorage.getItem('color-mode');

        if (!colorMode) {

            localStorage.setItem('color-mode', 'light');
            document.querySelector('#root').className = 'light';

        }

    }, []);

    return (
        <>
            <ColorMode />
            <Content>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/registration" element={<Registration />} />
                </Routes>
            </Content>
            <Footer />
        </>
    );

};

export default Authorization;