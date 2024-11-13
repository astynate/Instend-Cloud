import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType';
import LanguageIcon from './images/language.png';
import Search from '../../shared/search/Search';
import RadioButton from '../../shared/radio-button/RadioButton.js';
import external_styles from '../profile/styles/main.module.css';
import GlobalContext from '../../../../global/GlobalContext.js';

const Language = (props) => {
    const [searchRequest, setSearchRequest] = useState("");
    const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('i18nextLng') || 'eng');
    const [selectedLanguage, setSelectedLanguage] = useState(currentLanguage);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        if (props.isSaving) {
            i18n.changeLanguage(selectedLanguage);
            setCurrentLanguage(selectedLanguage);

            props.setSavingState(false);
        }
    }, [props.isSaving]);

    const ChangeLanguageAsync = async (key) => {
        setSelectedLanguage(key);
    };

    return (
        <>
            <SettingType
                image={<img src={LanguageIcon} className={styles.descImage} draggable="false" />}
                title={t('cloud.settings.language_preferences')}
                description={t('cloud.settings.language_preferences.desc')}
            />
            <div className={external_styles.settingBar}>
                <Search
                    placeholder={t('cloud.settings.language_search')}
                    setValue={setSearchRequest}
                />
                {GlobalContext.supportedLanguages
                    .filter((element) => element.label.toLowerCase().includes(searchRequest.toLowerCase()))
                    .sort(element => element.key === currentLanguage ? -1 : 1)
                    .map((prev, index) => {
                        return <RadioButton 
                            title={prev.label}
                            key={prev.key}
                            type={(index + 1 === GlobalContext.supportedLanguages.length ? 'last' : null)}
                            active={prev.key === selectedLanguage}
                            onClick={() => ChangeLanguageAsync(prev.key)}
                        />;
                    })
                }
            </div>
        </>
    );
};

export default Language;
