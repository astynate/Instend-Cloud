import React, { useState } from "react";
import image from './color-mode.png';
import './main.css';

const ColorMode = () => {

    const [colorMode, setColorMode] = useState('light-color-mode');

    const ChangeColorMode = () => {

        setColorMode(prev => prev === 'light-color-mode' ? 
            'dark-color-mode' : 'light-color-mode');
            
        document.getElementById('root').className = colorMode;

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