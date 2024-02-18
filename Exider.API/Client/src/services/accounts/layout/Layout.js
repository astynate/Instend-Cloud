import './styles/colors.css';
import './styles/main.css';
import React from 'react';
import { Provider } from 'react-redux';
import Header from "../widgets/header/Header";
import Footer from "../widgets/footer/Footer";
import Content from '../widgets/content/Content';
import Notification from '../features/notification/Notification';
import CustomSelect from '../shared/select/Select';
import languageStore from '../../../state/Store';
import { useTranslation } from 'react-i18next';

const Layout = ({ children }) => {

    const { t } = useTranslation()

    return (
        <>
            <Provider store={languageStore}>
                <Header />
                <Notification title={t('account.select_language')}>
                    <CustomSelect />
                </Notification>
                <Content>
                    {children}
                </Content>
                <Footer />
            </Provider>
        </>
    );
}

export default Layout;
