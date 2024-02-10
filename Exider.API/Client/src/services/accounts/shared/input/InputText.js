import React from 'react';
import './main.css';

const InputText = (props) => {

    return (

        <div class="input-container">
            <input type='text' className='input' id="input" maxLength={30} autoFocus={props.autofocus} required />
            <label for="input">{props.placeholder}</label>
        </div>

    );

}

export default InputText;