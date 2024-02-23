import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import InputPassword from "../../shared/password/InputPassword";
import Button from "../../shared/button/Button";
import Error from "../../shared/error/Error";
import { PasswordRecoveryContext } from '../../processes/PasswordRecovery'
import { Link } from "react-router-dom";
import Line from "../../shared/line/Line";

const NewPassword = () => {

    let data = useContext(PasswordRecoveryContext);
    let navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [validationState, setValidationState] = useState('invalid');
    const [isError, setErrorState] = useState(false);

    const SendRegistrationRequest = async () => {

        try {

            setValidationState('loading');

            const response = await fetch(`/password-recovery?link=${data.link}&password=${data.password}&code=${data.code}`, { method: "PUT" })

            if (response.status === 200) {

                const responseData = await response.text();
                navigate('/account/email/confirmation/' + responseData, { replace: true });

                setValidationState('valid');

            } else {

                setErrorState(true);
                setValidationState('invalid');

            }

        } catch (exception) {

            console.error(exception);

            setErrorState(true);
            setValidationState('invalid');

        }

    }

    useEffect(() => {

        data.password = password;

    }, [data, password, confirmedPassword, setValidationState]);

    return (

        <>
            { isError ? <Error message="Something went wrong." state={isError} setState={setErrorState} /> : null }
            <h1>New <span className="selected-text">Password</span></h1>
            <p className='page-description'>Please enter your new password. This is a required field. Your password must be at least 8 characters long.</p>
            <InputPassword
                placeholder="Enter your password"
                autofocus={true} name="password"
                SetValue={setPassword}
            />
            <InputPassword
                placeholder="Confirm your password"
                name="confirm-password"
                SetValue={setConfirmedPassword}
            />
            <div className="margin-top-40">
                <Button
                    title="Next"
                    state={validationState}
                    onClick={() => { SendRegistrationRequest() }}
                />
            </div>
            <div className='external-links margin-top-40'>
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

export default NewPassword;