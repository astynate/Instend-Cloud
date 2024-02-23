import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../processes/Registration";
import InputPassword from "../../shared/password/InputPassword";
import Button from "../../shared/button/Button";
import Error from "../../shared/error/Error";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";

const ValidateUserData = (user, password, confirm) => {

    if (ValidationHandler.ValidateEmail(user.email) === false) {
        return false;
    }

    if (ValidationHandler.ValidateStrings([user.name, user.surname, user.nickname]) === false) {
        return false;
    }

    return password.length >= 8 && password === confirm;

}

const Password = () => {

    let user = useContext(UserContext);
    let navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const [validationState, setValidationState] = useState(ValidateUserData(user, password, confirmedPassword) ? 'valid' : 'invalid');
    const [isError, setErrorState] = useState(false);

    const SendRegistrationRequest = async () => {

        try {

            setValidationState('loading');

            const response = await fetch("/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

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

        user.password = password;
        setValidationState(ValidateUserData(user, password, confirmedPassword) ? 'valid' : 'invalid');

    }, [user, password, confirmedPassword, setValidationState]);

    return (

        <>
            { isError ? <Error message="Something went wrong." state={isError} setState={setErrorState} /> : null }
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p className='page-description'>This is a required field. Your password must be at least 8 characters long.</p>
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
        </>

    );

}

export default Password;