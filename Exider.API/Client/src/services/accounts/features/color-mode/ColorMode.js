import React, { useEffect, useLayoutEffect, useState } from "react";
import image from './color-mode.png';
import './main.css';

const ColorMode = () => {

    const [colorMode, setColorMode] = useState(localStorage.getItem('color-mode') || 'light-color-mode');

    useLayoutEffect(() => {

        document.getElementById('root').className = colorMode;
        localStorage.setItem('color-mode', colorMode);

    }, [colorMode])

    const ChangeColorMode = () => {

        setColorMode(prev => prev === 'light-color-mode' ? 
            'dark-color-mode' : 'light-color-mode');
            
    }

    return (

        <img 
            src={image} 
            className="color-mode"
            id={colorMode} 
            onClick={() => ChangeColorMode()}
        />

    );

};

export default ColorMode;