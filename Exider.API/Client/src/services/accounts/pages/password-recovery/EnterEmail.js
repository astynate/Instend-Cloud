import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import InputCheck from "../../shared/input-check/InputCheck";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";
import { PasswordRecoveryContext } from "../../processes/PasswordRecovery";
import Error from '../../shared/error/Error';
import Back from '../../shared/back/Back';
import Line from "../../shared/line/Line";

const EnterEmail = () => {

    const data = useContext(PasswordRecoveryContext);
    const [email, setEmail] = useState(data.email);
    const [isError, setErrorState] = useState(false);
    const [isValidEmail, setEmailState] = useState(ValidationHandler.ValidateEmail(data.email));
    const [buttonState, setButtonState] = useState(isValidEmail ? 'valid' : 'invalid');

    useEffect(() => {

        data.email = email;
        setButtonState(isValidEmail ? 'valid' : 'invalid');

    }, [data, email, buttonState, isValidEmail]);

    const SendRecoveryRequest = async () => {

        const controller = new AbortController();
        const { signal } = controller;

        setButtonState('loading');

        const timeoutId = setTimeout(() => {

            controller.abort();

        }, 3000);

        const response = await fetch(`/password-recovery?email=${email}`, { signal });
        const data = await response.text();

        if (response.status === 200) {

            setButtonState('valid');

        } else {

            setButtonState('invalid');

        }

        clearTimeout(timeoutId);

    };

    return (

        <>
            { isError ? <Error message="Something went wrong" state={isError} setState={setErrorState} /> : null }
            <h1>Password <span className="selected-text">Recovery</span></h1>
            <p className='page-description'>To recover your password, please enter your email. We will send you a verification code.</p>
            <InputCheck
                placeholder='Email'
                autofocus={true}
                defaultValue={data.email}
                SetValue={setEmail}
                validationFunction={ValidationHandler.ValidateEmail}
                setFieldState={setEmailState}
                statusCode={200}
                endpoint='/accounts/email'
            />
            <div className='next margin-top-40'>
                <Button title="Next" state={buttonState} onClick={() => SendRecoveryRequest()} />
            </div>
            <Back />
            <Line title="or" />
            <div className='external-links'>
                <div className='external-link'>
                    <p>Don't need to recover your password?</p>
                </div>
                <div className='external-link'>
                    <Link to='/account/login'>Go back to main page</Link>
                </div>
            </div>
        </>

    );

}

export default EnterEmail;