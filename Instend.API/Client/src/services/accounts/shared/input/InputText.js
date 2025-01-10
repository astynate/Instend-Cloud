import React from 'react';
import './styles/main.css';
import './styles/media.css';

const InputText = ({type='text', SetValue, autofocus, defaultValue, placeholder}) => {
    return (
        <div className="input-container">
            <input
                type={type}
                className='input'
                maxLength={30}
                onChange={(event) => SetValue(event.target.value)}
                autoFocus={autofocus}
                defaultValue={defaultValue}
                required
            />
            {type !== 'date' && <label htmlFor="input">{placeholder}</label>}
        </div>
    );
}

export default InputText;