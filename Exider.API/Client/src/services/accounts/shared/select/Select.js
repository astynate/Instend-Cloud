import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import './main.css';

const CustomSelect = (props) => {

    const [isOpen, setOpenState] = useState(false);
    const [j, i18n] = useTranslation(); 

    return (

        <div className='select'>
            <div className='select-current' id={isOpen ? 'open-select' : null} onClick={() => setOpenState((prev) => !prev)}>
                <div>{props.options[0].label}</div>
            </div>
            {isOpen ? <div className='select-values'>
                {props.options.map((value, index) => {
                    return (index != 0 ? <div key={index} className='select-value' onClick={() => i18n.changeLanguage(value.key)}>{value.label}</div> : null)
                })}
            </div> : null}
        </div>

    );

}

export default CustomSelect;