import './styles/colors.css';
import './styles/main.css';
import React from 'react';
import Header from "../widgets/header/Header";
import Footer from "../widgets/footer/Footer";
import Content from '../widgets/content/Content';
import Notification from '../features/notification/Notification';
import PublicRoutes from '../../../routes/PublicRoutes';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import styles from './styles/wrapper.module.css';
import ColorMode from '../features/color-mode/ColorMode';

const Layout = () => {
    const { t } = useTranslation()
    const isLanguageSelect = useSelector((store) => store.isLanguageSelect);

    return (
        <div className={styles.wrapper}>
            <Helmet>
                <title>Yexider Account</title>
            </Helmet>
            <Header name={t('account.service_name')} />
            {isLanguageSelect === false ? <Notification title={t('account.select_language')} />: null}
            <Content>
                <Routes>
                    {PublicRoutes.map((route, index) => {
                        const { element, ...rest } = route;
                        return <Route key={index} {...rest} element={element} />;
                    })}
                </Routes>
            </Content>
            <ColorMode />
            <Footer />
        </div>
    );
}

export default Layout;
