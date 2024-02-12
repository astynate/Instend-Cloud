import React, { useEffect, useState } from 'react';
import Accept from './images/accept.png';
import '../input/styles/main.css';
import './styles/main.css';
import '../input/styles/media.css';

const InputCheck = (props) => {

    return (

        <div className="input-container">
            <input
                type='text'
                className='input' maxLength={30}
                autoFocus={props.autofocus}
                onChange={(event) => props.SetValue(event.target.value)}
                defaultValue={props.defaultValue}
                name={props.name}
                required
            />
            <label
                htmlFor="input">{props.placeholder}
            </label>
            <div className='check-state' id={props.state ?? 'none'}>
                <img src={Accept} alt="check-state" />
            </div>
        </div>

    );

}

export default InputCheck;