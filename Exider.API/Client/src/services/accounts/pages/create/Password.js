import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { UserContext } from "../../processes/Registration";
import InputPassword from "../../shared/password/InputPassword";
import Button from "../../shared/button/Button";
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
    const [validationState, setValidationState] = useState(ValidateUserData(user, password, confirmedPassword));

    const SendRegistrationRequest = async () => {

        try {

            const response = await fetch("/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })

            if (response.status === 200) {

                const responseData = await response.text();
                navigate('/account/email/confirmation/' + responseData, { replace: true })

            }

        } catch (exception) {

            console.error(exception);

        }

    }

    useEffect(() => {

        user.password = password;
        setValidationState(ValidateUserData(user, password, confirmedPassword));

    }, [user, password, confirmedPassword, setValidationState]);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>This is a required field. Your password must be at least 8 characters long.</p>
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
            <Button
                title="Next"
                disabled={!validationState}
                onClick={() => { SendRegistrationRequest() }}
            />
        </>

    );

}

export default Password;