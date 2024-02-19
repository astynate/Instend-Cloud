import './styles/colors.css';
import './styles/main.css';
import React from 'react';
import Header from "../widgets/header/Header";
import Footer from "../widgets/footer/Footer";
import Content from '../widgets/content/Content';
import Notification from '../features/notification/Notification';
import CustomSelect from '../shared/select/Select';
import PublicRoutes from '../../../routes/PublicRoutes';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Layout = () => {

    const { t } = useTranslation()

    return (

        <>
            <Header />
            <Notification title={t('account.select_language')}>
                <CustomSelect />
            </Notification>
            <Content>
                <Routes>
                    {PublicRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </Content>
            <Footer />
        </>
        
    );
}

export default Layout;
