import React, { useContext } from "react";
import { UserContext } from "../../processes/Registration";
import InputPassword from "../../shared/password/InputPassword";
import Button from "../../shared/button/Button";

const Password = () => {

    let user = useContext(UserContext);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>This is a required field. Your password must be at least 8 characters long.</p>
            <InputPassword placeholder="Enter your Password" autofocus={true} name="password" />
            <InputPassword placeholder="Confirm your password" name="confirm-password" />
            <Button title="Next" />
        </>

    );

}

export default Password;