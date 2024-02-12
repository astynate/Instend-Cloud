import React, { useEffect, useState } from 'react';
import './styles/main.css';
import './styles/media.css';

const InputText = (props) => {

    return (

        <div className="input-container">
            <input
                type='text'
                className='input'
                maxLength={30}
                onChange={(event) => { props.SetValue(event.target.value); }}
                onBlur={() => console.log('!')}
                autoFocus={props.autofocus}
                defaultValue={props.defaultValue}
                required
            />
            <label htmlFor="input">{props.placeholder}</label>
        </div>

    );

}

export default InputText;