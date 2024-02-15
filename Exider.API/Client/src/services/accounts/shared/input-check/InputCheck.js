import React from 'react';
import { useEffect, useState } from 'react';
import Valid from './images/valid.png';
import Invalid from './images/invalid.png';
import ValidateRequest from '../../api/request/validate-request';
import '../input/styles/main.css';
import './styles/main.css';
import '../input/styles/media.css';

const GetState = (func, value) =>
    { return func(value, 30) ? 'valid' : 'invalid'; }

const InputCheck = (props) => {

    const Validate = props.validationFunction;
    const [value, setValue] = useState(props.defaultValue);
    const [validationState, setValidationState] = useState(GetState(Validate, props.defaultValue));

    useEffect(() => {

        props.SetValue(value);
        props.setFieldState(validationState === 'valid');

    }, [validationState, props, value]);

    useEffect(() => {

        setValidationState('none');

        if (Validate(value, 30) === true) {

            const timeoutId = setTimeout(async () => {

                setValidationState('loading');
                setValidationState(await ValidateRequest(props.endpoint, value) ? 'valid' : 'invalid');

            }, 500);

            return () => clearTimeout(timeoutId);

        }

    }, [value, Validate, props.endpoint, props.placeholder]);

    return (

        <div className="input-container">
            <input
                type='text'
                className='input'
                maxLength={30}
                autoFocus={props.autofocus}
                onChange={(event) => { setValue(event.target.value)}}
                defaultValue={props.defaultValue}
                required
            />
            <label
                htmlFor="input">{props.placeholder}
            </label>
            {(validationState != 'none' ? <div className='check-state' id={validationState ?? 'none'}>
                <img src={(validationState === 'valid') ? Valid : Invalid} alt="check-state" />
            </div> : null)}
        </div>

    );

}

export default InputCheck;
