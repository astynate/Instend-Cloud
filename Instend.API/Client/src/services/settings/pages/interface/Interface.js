import React, { useEffect, useState } from 'react';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType'
import colorModeIcon from './images/color-mode.png';
import nightMode from './images/night-mode.png';
import Switch from '../../shared/switch/Switch.js';
import { useTranslation } from 'react-i18next';

const Interface = () => {

    const [colorMode, setColorMode] = useState(localStorage.getItem('color-mode') || 'light-mode');
    const { t } = useTranslation();

    useEffect(() => {

        document.querySelector('#root').className = colorMode;
        localStorage.setItem('color-mode', colorMode)

    }, [colorMode]);

    return (

        <>
            <SettingType 
                image={<img src={colorModeIcon} className={styles.descImage} draggable="false" />}
                title={t('cloud.settings.color_mode')}
                description={t('cloud.settings.color_mode.desc')}
            />
            <Switch 
                img={nightMode}
                title={t('cloud.settings.night_mode')}
                description={t('cloud.settings.night_mode.desc')}
                active={colorMode === 'dark-mode'}
                onClick={() => setColorMode(prev => prev === 'dark-mode' ? 'light-mode' : 'dark-mode')}
            />
        </>
        
    );

};

export default Interface;