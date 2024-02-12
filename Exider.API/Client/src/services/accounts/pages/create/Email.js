import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputText from "../../shared/input/InputText";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";

const Email = () => {

    const user = useContext(UserContext);
    const [email, setEmail] = useState(user.email);
    const [isValidEmail, setValidationData] = useState(ValidationHandler
        .ValidateEmail(email));

    useEffect(() => {

        user.email = email;

        setValidationData(ValidationHandler
            .ValidateEmail(email));

    }, [user, email]);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>Please enter your email. This field is required and must look like<br /> example@domain.com</p>
            <InputText placeholder="Email" autofocus={true} defaultValue={user.email} SetValue={setEmail} />
            <Link to='/account/create/nickname'>
                <Button title="Next" disabled={!isValidEmail} />
            </Link>
        </>

    );

}

export default Email;