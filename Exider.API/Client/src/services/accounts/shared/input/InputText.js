import React from 'react';
import './styles/main.css';
import './styles/media.css';

const InputText = (props) => {

    return (

        <div className="input-container">
            <input
                type='text'
                className='input'
                maxLength={30}
                onChange={(event) => { props.onChange(event.target.value); }}
                autoFocus={props.autofocus}
                required
            />
            <label htmlFor="input">{props.placeholder}</label>
        </div>

    );

}

export default InputText;