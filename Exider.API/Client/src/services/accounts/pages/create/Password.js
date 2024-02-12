import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../../processes/Registration";
import InputPassword from "../../shared/password/InputPassword";
import Button from "../../shared/button/Button";

const Password = () => {

    let user = useContext(UserContext);
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    useEffect(() => {

        user.password = password;
        user.confirmedPassword = confirmedPassword;

    }, [user, password, confirmedPassword]);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>This is a required field. Your password must be at least 8 characters long.</p>
            <InputPassword placeholder="Enter your Password" autofocus={true} name="password" SetValue={setPassword} />
            <InputPassword placeholder="Confirm your password" name="confirm-password" SetValue={setConfirmedPassword} />
            <Button title="Next" />
        </>

    );

}

export default Password;