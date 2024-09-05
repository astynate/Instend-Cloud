import React, { useLayoutEffect, useState } from "react";
import image from './color-mode.png';
import './main.css';

const ColorMode = () => {
    const [colorMode, setColorMode] = useState(localStorage.getItem('color-mode') || 'light-mode');

    useLayoutEffect(() => {
        document.getElementById('root').className = colorMode;
        localStorage.setItem('color-mode', colorMode);
    }, [colorMode]);

    const ChangeColorMode = () => {
        setColorMode(prev => prev === 'light-mode' ? 
            'dark-mode' : 'light-mode');  
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