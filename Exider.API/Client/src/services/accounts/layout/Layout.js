import './styles/colors.css';
import './styles/main.css';
import React, { useEffect, useState } from 'react';
import { useTranslation, I18nextProvider } from 'react-i18next';
import Header from "../widgets/header/Header";
import Footer from "../widgets/footer/Footer";
import CustomSelect from "../shared/select/Select";
import Notification from "../features/notification/Notification";
import Content from '../widgets/content/Content';

const languages = [
    { key: 'en', label: 'English' },
    { key: 'ru', label: 'Русский' },
    { key: 'by-k', label: 'Беларускi' },
    { key: 'by-l', label: 'Biełaruski' }
];

const Layout = ({ children }) => {

    const { t } = useTranslation();
    const [isLanguageSelected, setLanguageState] = useState(localStorage.getItem('isLanguageSelected'));

    return (

        <I18nextProvider t={t}>
            <Header />
            <Content>
                <Notification title={t('account.select_language')}>
                    <CustomSelect options={languages} />
                </Notification>
                {children}
            </Content>
            <Footer />
        </I18nextProvider>

    );

}

export default Layout;