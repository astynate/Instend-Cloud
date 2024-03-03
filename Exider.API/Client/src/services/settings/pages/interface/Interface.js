import React, { useEffect, useState } from 'react';
import styles from './styles/main.module.css';
import SettingType from '../../shared/setting-type/SettingType'
import colorMode from './images/color-mode.png';
import nightMode from './images/night-mode.png';
import Switch from '../../shared/switch/Switch.js';

const Interface = () => {

    const [colorMode, setColorMode] = useState(localStorage.getItem('color-mode') ?? 'light-mode');

    useEffect(() => {

        document.querySelector('#root').className = colorMode;
        localStorage.setItem('color-mode', colorMode)

    }, [colorMode]);

    return (

        <>
            <SettingType 
                image={<img src={colorMode} className={styles.descImage} draggable="false" />}
                title="Color Mode" 
                description="Please note that your profile photo will be visible to everyone." 
            />
            <Switch 
                img={nightMode}
                title="Night mode"
                description="Changes the color scheme to a darker one, reducing eye strain in low light"
                active={colorMode}
                onClick={() => setColorMode(prev => !prev)}
            />
        </>
        
    );

};

export default Interface;