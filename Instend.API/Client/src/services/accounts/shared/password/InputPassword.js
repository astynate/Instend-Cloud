import React, { useState } from 'react';
import '../input/styles/main.css';
import './styles/main.css';
import '../input/styles/media.css';
import Visible from './images/visible.png';
import Hidden from './images/hidden.png';

const InputPassword = (props) => {

    const [isVisible, setVisibility] = useState(false);

    return (

        <div className="input-container">
            <input
                type={isVisible ? 'text' : 'password'}
                className='input' maxLength={30}
                autoFocus={props.autofocus}
                onChange={(event) => props.SetValue(event.target.value)}
                name={props.name}
                required
            />
            <label
                htmlFor="input">{props.placeholder}
            </label>
            <img
                src={isVisible ? Visible : Hidden}
                onClick={() => setVisibility(prev => !prev)}
                alt="visibility"
                className='password-visibility-button'
            />
        </div>

    );

}

export default InputPassword;