import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import Translate from './images/translate.png';
import Arrow from './images/arrow.png';
import './main.css';
import './media.css';

const CustomSelect = (props) => {

    const state = useSelector((state) => state);
    const [isOpen, setOpenState] = useState(false);
    const [t, i18n] = useTranslation();
    const dispatch = useDispatch();

    const ChangeLanguage = (value) => {

        dispatch({ type: 'SET_LANGUAGE', payload: value });
        setOpenState(false);

    };

    try {

        return (

            <div className='select' onMouseLeave={() => setOpenState(false)}>
                <div className='select-current' id={isOpen ? 'open-select' : null} onMouseEnter={() => setOpenState(true)}>
                    <img src={Translate} className='translate-image' />
                    <div>{state.languages.find((x) => x.key === state.selectedLanguage).label}</div>
                    <img src={Arrow} className='open-state' id={isOpen ? 'open-select' : null} />
                </div>
                <div className='select-values' id={isOpen ? 'open-select' : null}>
                    {state.languages.map((value, index) => {
                        return (value.key != state.selectedLanguage ? <div key={index} className='select-value' onClick={() => ChangeLanguage(value.key)}>{value.label}</div> : null)
                    })}
                </div>
            </div>
    
        );

    } catch {}

}

export default CustomSelect;